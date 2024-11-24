import React from 'react';
import './Logs.css';
import ReactMarkdown from 'react-markdown'; // For markdown support

function Post({ post, onDelete }) {
  const handleDelete = async () => {
    const confirmed = window.confirm(`Are you sure you want to delete the post: "${post.title}"?`);
    if (confirmed) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:3001/posts/${post.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          onDelete(post.id); // Call the onDelete function to refresh the posts
        } else {
          console.error('Failed to delete the post');
        }
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  };

  return (
    <div className="post">
      <h3>{post.title}</h3>
      <p>By: {post.author}</p>
      {post.imageUrl && (
        <div className="post-image-placeholder">
          <img 
            src={`http://localhost:3001${post.imageUrl}`} 
            alt="Post visual" 
            onError={(e) => {
              console.error('Image failed to load:', post.imageUrl);
              e.target.style.display = 'none';
            }}
          />
        </div>
      )}

      {/* Render markdown content with proper new line handling */}
      <ReactMarkdown children={post.content} />

      {/* Delete Button */}
      <button onClick={handleDelete} style={{ marginTop: '10px', backgroundColor: 'red', color: 'white' }}>
        Delete
      </button>
    </div>
  );
}

export default Post;
