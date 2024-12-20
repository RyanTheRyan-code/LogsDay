import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreatePost.css';

function CreatePost() {
  const navigate = useNavigate();
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [mediaFiles, setMediaFiles] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [showNewProjectForm, setShowNewProjectForm] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '' });
  const [isDragging, setIsDragging] = useState(false);
  const [previewImages, setPreviewImages] = useState([]);
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState('');

  useEffect(() => {
    fetchProjects();
    getLocation();
  }, []);

  const getLocation = async () => {
    try {
      const response = await fetch('http://ip-api.com/json/');
      const data = await response.json();
      if (data.lat && data.lon) {
        setLocation({
          latitude: data.lat,
          longitude: data.lon
        });
        setLocationError('');
      } else {
        throw new Error('Could not get location from IP');
      }
    } catch (error) {
      console.error('Error getting location:', error);
      setLocationError('Unable to get your location. Location will not be added to the post.');
    }
  };

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/projects`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
      alert('Error fetching projects: ' + error.message);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newProject)
      });
      if (!response.ok) {
        throw new Error('Failed to create project');
      }
      const createdProject = await response.json();
      setProjects([...projects, createdProject]);
      setSelectedProject(createdProject.id);
      setShowNewProjectForm(false);
      setNewProject({ name: '', description: '' });
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Error creating project: ' + error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', postTitle);
    formData.append('content', postContent);
    formData.append('project_id', selectedProject);

    if (location) {
      formData.append('latitude', location.latitude);
      formData.append('longitude', location.longitude);
    }

    mediaFiles.forEach(file => {
      formData.append('images', file);
    });

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/posts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create post');
      }

      // Clear form and navigate back to feed
      setPostTitle('');
      setPostContent('');
      setMediaFiles([]);
      setPreviewImages([]);
      navigate('/logs');
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Error creating post: ' + error.message);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  const handleFiles = (files) => {
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    setMediaFiles(prev => [...prev, ...imageFiles]);

    // Create preview URLs
    const newPreviewUrls = imageFiles.map(file => URL.createObjectURL(file));
    setPreviewImages(prev => [...prev, ...newPreviewUrls]);
  };

  return (
    <div className="create-post-page">
      <div className="wood"></div>
      <div className="content-container">
        <div className="create-post-form">
          <h2>Create New Log</h2>
          
          {locationError && (
            <div className="location-error">
              {locationError}
            </div>
          )}
          
          {location && (
            <div className="location-info">
              📍 Location will be added to your post
            </div>
          )}

          <div className="form-group">
            <label htmlFor="project">Project</label>
            <div className="project-selection">
              <select
                id="project"
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
              >
                <option value="">Select a project</option>
                {projects.map(project => (
                  <option key={project.id} value={project.id}>{project.name}</option>
                ))}
              </select>
              <button 
                type="button" 
                className="new-project-btn"
                onClick={() => setShowNewProjectForm(true)}
              >
                New
              </button>
            </div>
          </div>

          {showNewProjectForm && (
            <div className="new-project-form">
              <h3>Create New Project</h3>
              <input
                type="text"
                placeholder="Project Name"
                value={newProject.name}
                onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
              />
              <textarea
                placeholder="Project Description"
                value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              />
              <button onClick={handleCreateProject}>Create Project</button>
              <button onClick={() => setShowNewProjectForm(false)}>Cancel</button>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              value={postTitle}
              onChange={(e) => setPostTitle(e.target.value)}
              placeholder="Enter title..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="content">Content</label>
            <textarea
              id="content"
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              placeholder="Write your log content..."
            />
          </div>

          <div 
            className={`file-upload-area ${isDragging ? 'dragging' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <p>Drag & drop files here or click to select</p>
            <input
              type="file"
              multiple
              onChange={handleFileSelect}
              style={{ display: 'none' }}
              id="file-input"
            />
            <button 
              type="button" 
              onClick={() => document.getElementById('file-input').click()}
            >
              Choose Files
            </button>
          </div>

          {previewImages.length > 0 && (
            <div className="image-previews">
              {previewImages.map((url, index) => (
                <img key={index} src={url} alt={`Preview ${index + 1}`} />
              ))}
            </div>
          )}

          <button onClick={handleSubmit} className="submit-btn">Create Post</button>
        </div>
      </div>
    </div>
  );
}

export default CreatePost;
