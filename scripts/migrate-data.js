const fs = require('fs').promises;
const path = require('path');
const db = require('../db/config');
const bcrypt = require('bcrypt');

async function migrateData() {
  try {
    // grab the old data from json
    const accountsData = await fs.readFile(path.join(__dirname, '../accounts.json'), 'utf-8');
    const postsData = await fs.readFile(path.join(__dirname, '../posts.json'), 'utf-8');
    
    const accounts = JSON.parse(accountsData);
    const posts = JSON.parse(postsData);

    // convert accounts into profiles w better structure
    console.log('Migrating accounts to profiles...');
    for (const account of accounts) {
      const [userId] = await db('profiles')
        .insert({
          email: account.email,
          password_hash: account.password,
          created_at: new Date(),
          name: account.email.split('@')[0] // Use email username as initial name
        })
        .returning('id')
        .onConflict('email')
        .ignore();
      
      console.log(`Migrated account: ${account.email}`);
    }

    // move over all the posts
    console.log('\nMigrating posts...');
    for (const post of posts) {
      // find who wrote it
      const profile = await db('profiles')
        .where({ email: post.author })
        .first();

      if (profile) {
        // add the post to the new system
        const [postId] = await db('posts')
          .insert({
            profile_id: profile.id,
            title: post.title || 'Untitled Post',
            content: post.content,
            created_at: new Date(post.timestamp) || new Date(),
            streak_day: post.streakDay || null
          })
          .returning('id');

        // handle any pics they added
        if (post.imageUrl) {
          await db('media').insert({
            post_id: postId,
            type: 'image',
            url: post.imageUrl,
            filename: path.basename(post.imageUrl),
            created_at: new Date(post.timestamp) || new Date()
          });
        }

        console.log(`Migrated post: ${post.title || 'Untitled Post'}`);
      }
    }

    console.log('\nMigration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await db.destroy();
  }
}

migrateData();
