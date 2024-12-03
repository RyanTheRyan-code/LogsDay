import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Post from './Post';
import './Projects.css';

function Projects() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [projectPosts, setProjectPosts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // grab project data when id changes
  useEffect(() => {
    if (id) {
      fetchProject();
      fetchProjectPosts();
    }
  }, [id]);

  const fetchProject = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/projects/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setProject(data);
      } else {
        setError('Failed to load project');
      }
    } catch (error) {
      setError('Error loading project');
    } finally {
      setLoading(false);
    }
  };

  const fetchProjectPosts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/projects/${id}/posts`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setProjectPosts(data);
      } else {
        setError('Failed to load project posts');
      }
    } catch (error) {
      setError('Error loading project posts');
    }
  };

  const handleDeletePost = (postId) => {
    setProjectPosts(projectPosts.filter(post => post.id !== postId));
  };

  return (
    <div className="project-page">
      {loading ? (
        // show loading spinner while we fetch stuff
        <div className="loading">Loading project...</div>
      ) : error ? (
        // whoops something went wrong
        <div className="error">{error}</div>
      ) : project ? (
        // got the project, show everything
        <div className="project-content">
          <div className="wood"></div>
          <div className="project-header">
            <div className="header-content">
              <h1 className="project-title">{project.name}</h1>
              {project.description && (
                <div className="description-section">
                  <p className="project-description">{project.description}</p>
                </div>
              )}
            </div>
          </div>

          <div className="project-posts">
            {projectPosts.length === 0 ? (
              <div className="no-posts">
                <p>No posts yet in this project.</p>
                <p>Create a new post and select this project to get started!</p>
              </div>
            ) : (
              <div className="posts-container">
                {projectPosts.map(post => (
                  <Post key={post.id} post={post} onDelete={handleDeletePost} />
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="project-page">
          <div className="wood"></div>
          <div className="error">Project not found</div>
        </div>
      )}
    </div>
  );
}

export default Projects;
