// grab all the stuff we need
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const knex = require('knex');
const db = knex({
  client: 'pg',
  connection: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: { rejectUnauthorized: false }
  },
  pool: { min: 0, max: 7 }
});
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3001;

// setup cors so frontend can talk to us
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));
app.use(express.json());

// serve uploaded files
app.use('/uploads', (req, res, next) => {
  console.log('Accessing uploaded file:', req.url);
  next();
}, express.static('uploads'));

// setup where to save files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    // make unique filename so nothing gets overwritten
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

// only let em upload pics & vids
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Only images and videos are allowed!'), false);
  }
};

// setup file upload with size limit
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // max 50mb
  }
});

// google oauth setup
const client = new OAuth2Client({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: `${process.env.BACKEND_URL}/auth/google/callback`
});

// check if user's logged in
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  try {
    // make sure token is legit
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // check if user exists
    const user = await db('profiles')
      .where({ id: decoded.id, email: decoded.email })
      .first();

    if (!user) {
      return res.sendStatus(403);
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    return res.sendStatus(403);
  }
};

// get all projects for user
app.get('/projects', authenticateToken, async (req, res) => {
  try {
    const projects = await db('projects')
      .where({ profile_id: req.user.id })
      .orderBy('created_at', 'desc');
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// create new project
app.post('/projects', authenticateToken, async (req, res) => {
  try {
    const { name, description } = req.body;
    const [project] = await db('projects')
      .insert({
        name,
        description,
        profile_id: req.user.id
      })
      .returning('*');
    res.status(201).json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// get a project by id
app.get('/projects/:id', authenticateToken, async (req, res) => {
  try {
    const project = await db('projects')
      .where({ 
        'projects.id': req.params.id
      })
      .first();
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    res.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

// get all posts for a project
app.get('/projects/:id/posts', authenticateToken, async (req, res) => {
  try {
    const posts = await db('posts')
      .join('profiles', 'posts.profile_id', 'profiles.id')
      .leftJoin('media', 'posts.id', 'media.post_id')
      .leftJoin('projects', 'posts.project_id', 'projects.id')
      .where('posts.project_id', req.params.id)
      .select(
        'posts.id',
        'posts.title',
        'posts.content',
        'posts.created_at',
        'posts.post_index',
        'posts.project_id',
        'projects.name as project_name',
        'profiles.name as author_name',
        'profiles.email as author_email',
        'profiles.profile_picture_url',
        db.raw('COALESCE(json_agg(media.* ORDER BY media.created_at) FILTER (WHERE media.id IS NOT NULL), \'[]\'::json) as media')
      )
      .groupBy(
        'posts.id',
        'posts.title',
        'posts.content',
        'posts.created_at',
        'posts.post_index',
        'posts.project_id',
        'projects.name',
        'profiles.name',
        'profiles.email',
        'profiles.profile_picture_url'
      )
      .orderBy('posts.post_index', 'asc');
    res.json(posts);
  } catch (error) {
    console.error('Error fetching project posts:', error);
    res.status(500).json({ error: 'Failed to fetch project posts' });
  }
});

// google oauth redirect
app.get('/auth/google', (req, res) => {
  const redirectUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(`${process.env.BACKEND_URL}/auth/google/callback`)}&response_type=code&scope=email%20profile&access_type=offline`.replace(/\s+/g, '');
  res.redirect(redirectUrl);
});

// google oauth callback
app.get('/auth/google/callback', async (req, res) => {
  try {
    console.log('Received OAuth callback with code:', req.query.code);
    const code = req.query.code;
    
    console.log('Getting tokens from Google...');
    const { tokens } = await client.getToken({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: `${process.env.BACKEND_URL}/auth/google/callback`
    });
    console.log('Received tokens from Google');

    console.log('Verifying ID token...');
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    console.log('ID token verified');

    const payload = ticket.getPayload();
    const { email, name, picture } = payload;
    console.log('User info:', { email, name });

    console.log('Checking if user exists in database...');
    let user = await db('profiles')
      .where({ email })
      .first();

    if (!user) {
      console.log('Creating new user...');
      const [newUser] = await db('profiles')
        .insert({
          email,
          name,
          profile_picture_url: picture,
          oauth_provider: 'google'
        })
        .returning(['id', 'email', 'name']);
      user = newUser;
      console.log('New user created:', user);
    } else {
      console.log('Existing user found:', user);
    }

    console.log('Generating JWT...');
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    console.log('JWT generated');

    const redirectUrl = `${process.env.FRONTEND_URL}/oauth-callback?token=${token}`;
    console.log('Redirecting to:', redirectUrl);
    res.redirect(redirectUrl);
  } catch (error) {
    console.error('Detailed OAuth error:', {
      message: error.message,
      stack: error.stack,
      details: error.response?.data || error
    });
    res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_failed`);
  }
});

// google oauth token exchange
app.post('/auth/google', async (req, res) => {
  try {
    const { token } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    const payload = ticket.getPayload();

    let user = await db('profiles')
      .where({ email: payload.email })
      .first();

    if (!user) {
      const [userId] = await db('profiles')
        .insert({
          email: payload.email,
          name: payload.name,
          profile_picture_url: payload.picture,
          is_google_user: true,
          google_id: payload.sub
        })
        .returning('id');

      user = { id: userId, email: payload.email };
    }

    const jwtToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token: jwtToken });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

// signup endpoint
app.post('/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const existingUser = await db('profiles')
      .where({ email })
      .first();

    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const [user] = await db('profiles')
      .insert({
        email,
        name,
        password_hash: passwordHash
      })
      .returning(['id', 'email']);

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Signup failed' });
  }
});

// login endpoint
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await db('profiles')
      .where({ email })
      .first();

    if (!user || !user.password_hash) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    await db('profiles')
      .where({ id: user.id })
      .update({ last_login: db.fn.now() });

    res.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// get all posts for user
app.get('/posts', authenticateToken, async (req, res) => {
  try {
    console.log('Fetching posts for user:', req.user);
    
    let query = db
      .select(
        'p.id',
        'p.title',
        'p.content',
        'p.created_at',
        'p.post_index',
        'p.project_id',
        db.raw('p.location::text as location_text'),
        'proj.name as project_name',
        'prof.name as author_name',
        'prof.email as author_email',
        'prof.profile_picture_url',
        db.raw('(SELECT COALESCE(json_agg(m.* ORDER BY m.created_at), \'[]\'::json) FROM media m WHERE m.post_id = p.id) as media')
      )
      .from('posts as p')
      .join('profiles as prof', 'p.profile_id', 'prof.id')
      .leftJoin('projects as proj', 'p.project_id', 'proj.id')
      .orderBy('p.created_at', 'desc');

    if (req.query.date) {
      const date = new Date(req.query.date);
      const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
      
      console.log('Date filter:', { startOfDay, endOfDay });
      query = query.whereBetween('p.created_at', [startOfDay, endOfDay]);
    }

    const sql = query.toString();
    console.log('SQL Query:', sql);

    const posts = await query;

    // Parse location text into longitude and latitude
    const processedPosts = posts.map(post => {
      if (post.location_text) {
        const match = post.location_text.match(/\((.*?),(.*?)\)/);
        if (match) {
          post.longitude = parseFloat(match[1]);
          post.latitude = parseFloat(match[2]);
        }
        delete post.location_text;
      }
      return post;
    });

    console.log('Found posts:', posts.length);
    if (posts.length > 0) {
      console.log('Sample post:', posts[0]);
    }

    res.json(processedPosts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// get all posts for a project
app.get('/projects/:id/posts', authenticateToken, async (req, res) => {
  try {
    const posts = await db('posts')
      .join('profiles', 'posts.profile_id', 'profiles.id')
      .leftJoin('media', 'posts.id', 'media.post_id')
      .leftJoin('projects', 'posts.project_id', 'projects.id')
      .where('posts.project_id', req.params.id)
      .select(
        'posts.id',
        'posts.title',
        'posts.content',
        'posts.created_at',
        'posts.post_index',
        'posts.project_id',
        'projects.name as project_name',
        'profiles.name as author_name',
        'profiles.email as author_email',
        'profiles.profile_picture_url',
        db.raw('COALESCE(json_agg(media.* ORDER BY media.created_at) FILTER (WHERE media.id IS NOT NULL), \'[]\'::json) as media')
      )
      .groupBy(
        'posts.id',
        'posts.title',
        'posts.content',
        'posts.created_at',
        'posts.post_index',
        'posts.project_id',
        'projects.name',
        'profiles.name',
        'profiles.email',
        'profiles.profile_picture_url'
      )
      .orderBy('posts.post_index', 'asc');
    res.json(posts);
  } catch (error) {
    console.error('Error fetching project posts:', error);
    res.status(500).json({ error: 'Failed to fetch project posts' });
  }
});

// create a new post
app.post('/posts', authenticateToken, upload.array('images'), async (req, res) => {
  try {
    console.log('Received post request with body:', req.body);
    console.log('Received files:', req.files);
    console.log('User:', req.user);

    const { title, content, project_id, latitude, longitude } = req.body;
    
    if (!project_id) {
      return res.status(400).json({ error: 'Project ID is required' });
    }

    console.log('Creating post with:', { title, content, project_id, userId: req.user.id, latitude, longitude });
    
    const result = await db('posts')
      .where({ project_id })
      .count('id as count')
      .first();
    const post_index = parseInt(result.count) + 1;

    console.log('Next post index:', post_index);

    // Create PostgreSQL point using proper syntax
    const location = latitude && longitude ? db.raw('point(?, ?)', [longitude, latitude]) : null;

    const [newPost] = await db('posts')
      .insert({
        profile_id: req.user.id,
        project_id,
        title,
        content,
        post_index,
        created_at: db.fn.now(),
        streak_day: req.body.streak_day,
        location
      })
      .returning('*');

    console.log('Created post:', newPost);

    let mediaData = [];
    if (req.files && req.files.length > 0) {
      const mediaEntries = req.files.map(file => ({
        post_id: newPost.id,
        url: `/uploads/${file.filename}`,
        type: file.mimetype.startsWith('image/') ? 'image' : 'video',
        filename: file.originalname,
        created_at: db.fn.now()
      }));

      mediaData = await db('media').insert(mediaEntries).returning('*');
    }

    const [completePost] = await db('posts')
      .join('profiles', 'posts.profile_id', 'profiles.id')
      .leftJoin('projects', 'posts.project_id', 'projects.id')
      .leftJoin('media', 'posts.id', 'media.post_id')
      .where('posts.id', newPost.id)
      .select(
        'posts.id',
        'posts.title',
        'posts.content',
        'posts.created_at',
        'posts.streak_day',
        'posts.project_id',
        'profiles.name as author_name',
        'profiles.email as author_email',
        'profiles.profile_picture_url',
        'projects.name as project_name',
        db.raw('COALESCE(json_agg(media.* ORDER BY media.created_at) FILTER (WHERE media.id IS NOT NULL), \'[]\'::json) as media')
      )
      .groupBy(
        'posts.id',
        'posts.title',
        'posts.content',
        'posts.created_at',
        'posts.streak_day',
        'posts.project_id',
        'profiles.name',
        'profiles.email',
        'profiles.profile_picture_url',
        'projects.name'
      );

    if (!completePost.media || completePost.media[0] === null) {
      completePost.media = [];
    }

    console.log('Returning complete post:', completePost);
    res.json(completePost);
  } catch (error) {
    console.error('Error creating post:', error);
    console.error('Full error:', error);
    res.status(500).json({ error: 'Failed to create post', details: error.message });
  }
});

// delete a post
app.delete('/posts/:id', authenticateToken, async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;

    const post = await db('posts')
      .where({ id: postId })
      .first();

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (post.profile_id !== userId) {
      return res.status(403).json({ error: 'Unauthorized: You can only delete your own posts' });
    }

    const media = await db('media')
      .where({ post_id: postId });

    for (const file of media) {
      if (file.url) {
        const filePath = path.join(__dirname, file.url);
        try {
          await fs.promises.unlink(filePath);
        } catch (error) {
          console.error('Error deleting file:', error);
        }
      }
    }

    await db('media')
      .where({ post_id: postId })
      .delete();

    await db('posts')
      .where({ id: postId })
      .delete();

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

// get all post dates for user
app.get('/posts/dates', authenticateToken, async (req, res) => {
  try {
    const dates = await db('posts')
      .where('profile_id', req.user.id)
      .distinct('created_at')
      .orderBy('created_at', 'desc');
    
    res.json(dates.map(d => d.created_at));
  } catch (error) {
    console.error('Error fetching post dates:', error);
    res.status(500).json({ error: 'Failed to fetch post dates' });
  }
});

// get user profile
app.get('/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const profile = await db('profiles')
      .where({ id: userId })
      .first();

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    const socialLinks = await db('social_links')
      .where({ profile_id: userId });

    res.json({
      ...profile,
      social_links: socialLinks
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// update user profile
app.put('/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, bio, social_links } = req.body;

    await db('profiles')
      .where({ id: userId })
      .update({
        name,
        bio,
        updated_at: db.fn.now()
      });

    if (social_links) {
      await db('social_links')
        .where({ profile_id: userId })
        .del();

      if (social_links.length > 0) {
        const linkEntries = social_links.map(link => ({
          profile_id: userId,
          platform: link.platform,
          url: link.url
        }));

        await db('social_links').insert(linkEntries);
      }
    }

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
