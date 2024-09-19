import React, { useState, useEffect } from 'react';
import logo from './logo.png';
import './Logs.css';
import NavBar from '../NavBar';

function Logs() {
  const [posts, setPosts] = useState([]);
  const [postContent, setPostContent] = useState('');

  useEffect(() => {
    fetch('/posts')
      .then(response => response.json())
      .then(data => setPosts(data))
      .catch(error => console.error('Error fetching posts:', error));
  }, []);

  const savePostToServer = async (post) => {
    try {
      const response = await fetch('http://localhost:3001/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(post),
      });

      if (response.ok) {
        const message = await response.text();
        console.log(message); // Logs "Posts saved"
      } else {
        console.error('Failed to save posts');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const addPost = () => {
    if (postContent.trim()) {
      const newPost = {
        id: posts.length + 1,
        content: postContent,
        author: `User${posts.length + 1}`,
      };
      setPosts([...posts, newPost]);
      setPostContent('');
      savePostToServer(newPost); // Save the post to the server
    }
  };

  return (
    <div className="Logs">
      <NavBar />
      <div className="wood"></div>
      <header className="App-header">
        <img src={logo} className="Logs-logo" alt="logo" />
        <h1>Logs</h1>
        <p>Log it up!</p>
      </header>

      <div className="input-section">
        <input
          type="text"
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
          placeholder="Write a post"
        />
        <button onClick={addPost}>Add Post</button>
      </div>

      <div className="feed">
        {posts.map(post => (
          <div className="post" key={post.id}>
            <h3>{post.author}</h3>
            <p>{post.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}


export default Logs;
