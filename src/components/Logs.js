import React, { useState, useEffect } from 'react';
import logo from './logo.png';
import './Logs.css';
import NavBar from './NavBar';
import Post from './Post'; // Use the correct Post component name and path

function Logs() {
  const [posts, setPosts] = useState([]); // State to store posts
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [imageFile, setImageFile] = useState(null);

  // Fetch posts from the server when the component mounts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3001/posts', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setPosts(data); // Set the posts in state
        } else {
          console.error('Failed to fetch posts');
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts(); // Call the fetchPosts function when the component loads
  }, []); // Empty dependency array ensures this runs once when the component mounts

  // Handle post deletion (removes post from the state)
  const handleDeletePost = (postId) => {
    setPosts(posts.filter(post => post.id !== postId)); // Filter out the deleted post
  };

  // Handle file selection for image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };

  // Function to handle image upload to server
  const uploadImage = async () => {
    if (imageFile) {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('file', imageFile);

      const response = await fetch('http://localhost:3001/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        return data.imageUrl; // Return the uploaded image URL
      } else {
        console.error('Failed to upload image');
      }
    }
    return ''; // Return empty string if no image or upload fails
  };

  const addPost = async () => {
    if (postTitle.trim() && postContent.trim()) {
      const token = localStorage.getItem('token');
      const uploadedImageUrl = await uploadImage(); // Upload image, get URL
  
      const newPost = {
        id: posts.length + 1,
        title: postTitle,
        content: postContent,
        imageUrl: uploadedImageUrl,
        author: `User${posts.length + 1}`,
      };
  
      // Post the new post to the server
      const response = await fetch('http://localhost:3001/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newPost),
      });
  
      if (response.ok) {
        const updatedPosts = [...(Array.isArray(posts) ? posts : []), newPost];
        setPosts(updatedPosts);
        setPostTitle('');
        setPostContent('');
        setImageFile(null);
      } else {
        console.error('Failed to save the post');
      }
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
          value={postTitle}
          onChange={(e) => setPostTitle(e.target.value)}
          placeholder="Post title"
        />
        <textarea
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
          placeholder="Post content (supports markdown)"
          rows="5"
          style={{ width: '100%' }}
        />
        <input type="file" onChange={handleImageUpload} accept="image/*" />
        <button onClick={addPost}>Add Post</button>
      </div>
  
      {/* Feed rendering posts */}
      <div className="feed">
        {Array.isArray(posts) && posts.length > 0 ? (
          posts.map(post => (
            <Post key={post.id} post={post} onDelete={handleDeletePost} />
          ))
        ) : (
          <p>No posts available.</p>
        )}
      </div>
    </div>
  );
  
}

export default Logs;
