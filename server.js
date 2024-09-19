const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3001;
const postsFilePath = path.join(__dirname, 'posts.json');

app.use(express.json());

app.get('/posts', (req, res) => {
  if (fs.existsSync(postsFilePath)) {
    const data = fs.readFileSync(postsFilePath);
    res.json(JSON.parse(data));
  } else {
    res.json([]);
  }
});

app.post('/posts', (req, res) => {
  const posts = req.body;
  fs.writeFileSync(postsFilePath, JSON.stringify(posts, null, 2));
  res.status(201).send('Posts saved');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
