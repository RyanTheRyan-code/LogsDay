// Import required modules
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { signup, login, authenticateToken } = require('./services/auth');

const app = express();
const port = 3001;
const postsFilePath = path.join(__dirname, 'posts.json');
const accountsFilePath = path.join(__dirname, 'accounts.json');

app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse incoming JSON requests

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Passport configuration for Google OAuth
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback',
    },
    (accessToken, refreshToken, profile, done) => {
      // Here you would find or create a user in your database
      const user = { id: profile.id, email: profile.emails[0].value };
      return done(null, user);
    }
  )
);

app.use(passport.initialize());

// Ensure 'uploads' folder exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Set up multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir); // Use absolute path for uploads
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Helper function to save account information to accounts.json
const saveAccountToFile = (account) => {
  let accounts = [];
  if (fs.existsSync(accountsFilePath)) {
    try {
      const data = fs.readFileSync(accountsFilePath, 'utf-8');
      accounts = JSON.parse(data);
    } catch (error) {
      console.error('Error reading accounts.json:', error);
      accounts = [];
    }
  }

  accounts.push(account);

  try {
    fs.writeFileSync(accountsFilePath, JSON.stringify(accounts, null, 2));
    console.log('Account successfully saved to accounts.json');
  } catch (error) {
    console.error('Error writing to accounts.json:', error);
  }
};

// User signup route
app.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const token = await signup(email, hashedPassword);
    const account = { email, password: hashedPassword, token };
    saveAccountToFile(account);
    res.json({ token });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).send('Signup failed');
  }
});

// User login route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    let accounts = [];
    if (fs.existsSync(accountsFilePath)) {
      const data = fs.readFileSync(accountsFilePath, 'utf-8');
      accounts = JSON.parse(data);
    }
    const user = accounts.find(account => account.email === email);
    if (user && await bcrypt.compare(password, user.password)) {
      console.log(true);
      res.status(200).send('Login successful');
    } else {
      throw new Error('Invalid credentials');
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(401).send('Invalid credentials');
  }
});

// Google OAuth routes
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get(
  '/auth/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: 'http://localhost:3000/login' }),
  (req, res) => {
    // Generate JWT token
    const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET || 'secretKey', { expiresIn: '1h' });
    // Redirect to frontend with token
    res.redirect(`http://localhost:3000/auth/google/callback?token=${token}`);
  }
);

// Protected endpoint to retrieve posts
app.get('/posts', authenticateToken, (req, res) => {
  if (fs.existsSync(postsFilePath)) {
    try {
      const data = fs.readFileSync(postsFilePath, 'utf-8');
      const posts = JSON.parse(data);
      res.json(Array.isArray(posts) ? posts : []);
    } catch (error) {
      console.error('Error parsing posts.json:', error);
      res.json([]);
    }
  } else {
    res.json([]);
  }
});

// Protected endpoint to save posts
app.post('/posts', authenticateToken, (req, res) => {
  const newPost = req.body;
  console.log('Received new post:', newPost);

  let posts = [];
  if (fs.existsSync(postsFilePath)) {
    try {
      const data = fs.readFileSync(postsFilePath, 'utf-8');
      posts = JSON.parse(data);
    } catch (error) {
      console.error('Error reading posts.json:', error);
      posts = [];
    }
  }

  posts.push(newPost);

  try {
    fs.writeFileSync(postsFilePath, JSON.stringify(posts, null, 2));
    console.log('Posts successfully saved to posts.json');
    res.status(201).send('Post saved');
  } catch (error) {
    console.error('Error writing to posts.json:', error);
    res.status(500).send('Failed to save post');
  }
});

// Protected endpoint to handle image upload
app.post('/upload', authenticateToken, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  const filePath = `/uploads/${req.file.filename}`; // Use relative path for URL
  res.json({ imageUrl: filePath });
});

// Endpoint to delete posts (protected)
app.delete('/posts/:id', authenticateToken, (req, res) => {
  const postId = parseInt(req.params.id);
  console.log('Delete request for post with id:', postId);

  if (fs.existsSync(postsFilePath)) {
    try {
      const data = fs.readFileSync(postsFilePath, 'utf-8');
      let posts = JSON.parse(data);
      posts = posts.filter(post => post.id !== postId);
      fs.writeFileSync(postsFilePath, JSON.stringify(posts, null, 2));
      console.log(`Post with id ${postId} removed`);
      res.status(200).send('Post deleted');
    } catch (error) {
      console.error('Error deleting post:', error);
      res.status(500).send('Failed to delete post');
    }
  } else {
    res.status(404).send('Post not found');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
