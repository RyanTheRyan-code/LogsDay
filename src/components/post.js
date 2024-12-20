// handles individual post display and actions
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './Logs.css';

function Post({ post, onDelete }) {
  const navigate = useNavigate();
  const [showFullContent, setShowFullContent] = useState(false);
  const contentPreviewLength = 150;
  const hasLongContent = post.content && post.content.length > contentPreviewLength;

  // yeet the post
  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/posts/${post.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        onDelete(post.id);
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to delete post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Error deleting post');
    }
  };

  // get current user email
  const getCurrentUserEmail = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.email;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };

  // check if current user is post author
  const isCurrentUserPost = getCurrentUserEmail() === post.author_email;

  // jump to the project page
  const handleProjectClick = (e) => {
    e.stopPropagation();
    if (post.project_id) {
      navigate(`/projects/${post.project_id}`);
    }
  };

  // format the date all nice
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const renderLocation = () => {
    if (post.latitude && post.longitude) {
      return (
        <div className="post-location">
          <span role="img" aria-label="location" className="location-icon">📍</span>
          <a 
            href={`https://www.google.com/maps?q=${post.latitude},${post.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="location-link"
            title={`View on Google Maps (${post.latitude.toFixed(4)}, ${post.longitude.toFixed(4)})`}
          >
            <span className="location-text">View on Maps</span>
          </a>
        </div>
      );
    }
    return null;
  };

  // get project name
  const getProjectName = () => {
    return post.project_name || 'Unknown Project';
  };

  // get media url
  const getMediaUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `${process.env.REACT_APP_BACKEND_URL}${url}`;
  };

  // download media
  const handleDownload = async (media) => {
    try {
      const mediaUrl = getMediaUrl(media.url);
      const response = await fetch(mediaUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = media.filename || 'download';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading media:', error);
    }
  };

  return (
    <article className="post">
      <div className="post-header">
        <div>
          <h2 className="post-title">{post.title}</h2>
          <div className="post-metadata">
            <span 
              className="project-tag clickable" 
              onClick={handleProjectClick}
              title="Click to view project"
              role="button"
              style={{ cursor: 'pointer' }}
            >
              {getProjectName()}
            </span>
            <span className="author-tag">
              By {post.author_name || 'Anonymous'}
            </span>
            <span>{formatDate(post.created_at)}</span>
            {post.streak_day && <span>Streak Day {post.streak_day}</span>}
            {renderLocation()}
          </div>
        </div>
        {isCurrentUserPost && (
          <button className="button secondary" onClick={handleDelete}>
            Delete
          </button>
        )}
      </div>

      <div className="post-content">
        <ReactMarkdown 
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({node, children, ...props}) => (
              <h1 style={{
                fontSize: '2em',
                fontWeight: '600',
                lineHeight: '1.25',
                marginBottom: '16px',
                marginTop: '24px',
                border: 'none'
              }} {...props}>{children}</h1>
            ),
            h2: ({node, children, ...props}) => (
              <h2 style={{
                fontSize: '1.5em',
                fontWeight: '600',
                lineHeight: '1.25',
                marginBottom: '16px',
                marginTop: '24px',
                border: 'none'
              }} {...props}>{children}</h2>
            ),
            code: ({node, inline, ...props}) => (
              <code style={inline ? {
                background: '#f6f8fa',
                padding: '0.2em 0.4em',
                borderRadius: '3px'
              } : {}} {...props}/>
            ),
            pre: ({node, ...props}) => (
              <pre style={{
                background: '#f6f8fa',
                padding: '16px',
                borderRadius: '6px',
                overflow: 'auto'
              }} {...props}/>
            ),
            blockquote: ({node, ...props}) => (
              <blockquote style={{
                borderLeft: '4px solid #ddd',
                paddingLeft: '1em',
                margin: '1em 0',
                color: '#666'
              }} {...props}/>
            ),
            a: ({node, ...props}) => (
              <a style={{color: '#0366d6', textDecoration: 'none'}} {...props}/>
            )
          }}
        >
          {post.content}
        </ReactMarkdown>
      </div>

      {post.media && post.media.length > 0 && (
        <div className={`media-container ${post.media.length === 1 ? 'single-media' : ''}`}>
          {post.media.map((media, index) => {
            const isVideo = media.type === 'video';
            const mediaUrl = getMediaUrl(media.url);
            
            return (
              <div key={index} className="media-item">
                {isVideo ? (
                  <video
                    src={mediaUrl}
                    controls
                    className="media-content"
                  />
                ) : (
                  <img
                    src={mediaUrl}
                    alt={`Post media ${index + 1}`}
                    className="media-content"
                  />
                )}
                <button 
                  className="download-button"
                  onClick={() => handleDownload(media)}
                  title="Download media"
                >
                  ↓
                </button>
              </div>
            );
          })}
        </div>
      )}
    </article>
  );
}

export default Post;
