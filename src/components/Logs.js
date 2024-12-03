import React, { useState, useEffect } from 'react';
import './Logs.css';
import Post from './Post';
import FilterControls from './FilterControls';

function Logs() {
  const [posts, setPosts] = useState([]);
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [mediaFiles, setMediaFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [previewImages, setPreviewImages] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [showNewProjectForm, setShowNewProjectForm] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '' });
  const [streakDay, setStreakDay] = useState(1);
  const [sortBy, setSortBy] = useState('newest');
  const [filterByMedia, setFilterByMedia] = useState('all');
  const [filterByStreak, setFilterByStreak] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const dateParam = params.get('date');
    if (dateParam) {
      setDateFilter(dateParam);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
    fetchProjects();
  }, [dateFilter]);

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem('token');
      let url = 'http://localhost:3001/posts';
      
      // slap on the date filter if we got one
      if (dateFilter) {
        url += `?date=${dateFilter}`;
      }
      
      console.log('Fetching posts from:', url);
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched posts:', {
          total: data.length,
          sample: data[0],
          authors: [...new Set(data.map(p => p.author_name))]
        });
        setPosts(data);
      } else {
        const error = await response.json();
        console.error('Failed to fetch posts:', error);
        setError('Failed to load posts. Please try again.');
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError('Error loading posts. Please check your connection.');
    }
  };

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/projects', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      }
    } catch (error) {
      setError('Failed to load projects');
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      setPosts(posts.filter(post => post.id !== postId));
    } catch (error) {
      console.error('Error updating posts after deletion:', error);
      // Refresh posts to ensure consistency
      fetchPosts();
    }
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    // grab files from the drop
    const droppedFiles = Array.from(e.dataTransfer.files).filter(
      file => file.type.startsWith('image/') || file.type.startsWith('video/')
    );
    
    // show previews for images
    const newPreviewImages = droppedFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    
    setMediaFiles(prev => [...prev, ...droppedFiles]);
    setPreviewImages(prev => [...prev, ...newPreviewImages]);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files).filter(file => 
      file.type.startsWith('image/') || file.type.startsWith('video/')
    );
    setMediaFiles(prevFiles => [...prevFiles, ...files]);
    
    // Generate preview URLs
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImages(prev => [...prev, {
          file,
          preview: reader.result,
          type: file.type.startsWith('video/') ? 'video' : 'image'
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removePreview = (index) => {
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/projects', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newProject)
      });

      if (response.ok) {
        const project = await response.json();
        setProjects([...projects, project]);
        setSelectedProject(project.id.toString());
        setNewProject({ name: '', description: '' });
        setShowNewProjectForm(false);
      }
    } catch (error) {
      setError('Failed to create project');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // prep the form data with all our stuff
      const formData = new FormData();
      formData.append('title', postTitle);
      formData.append('content', postContent);
      formData.append('project_id', selectedProject);
      formData.append('streak_day', streakDay);
      
      // add any pics or vids
      mediaFiles.forEach(file => {
        formData.append('images', file);
      });

      console.log('Submitting post with:', {
        title: postTitle,
        content: postContent,
        project_id: selectedProject,
        streak_day: streakDay,
        imageCount: mediaFiles.length
      });

      const response = await fetch('http://localhost:3001/posts', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create post');
      }

      const newPost = await response.json();
      console.log('Created post:', newPost);
      setPosts(prevPosts => [newPost, ...prevPosts]);
      
      // Reset form
      setPostTitle('');
      setPostContent('');
      setMediaFiles([]);
      setStreakDay(1);
      
    } catch (error) {
      console.error('Error creating post:', error);
      setError(error.message || 'Failed to create post. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Add new function to filter and sort posts
  const getFilteredAndSortedPosts = () => {
    let filteredPosts = [...posts];
    console.log('Initial posts:', filteredPosts.length);

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredPosts = filteredPosts.filter(post => 
        post.title.toLowerCase().includes(query) ||
        post.content.toLowerCase().includes(query) ||
        post.author_name?.toLowerCase().includes(query) ||
        post.author_email?.toLowerCase().includes(query)
      );
      console.log('After search filter:', filteredPosts.length);
    }

    // Apply date filter
    if (dateFilter) {
      // Create date object and adjust for timezone
      const filterDate = new Date(dateFilter + 'T00:00:00');
      const filterEndDate = new Date(dateFilter + 'T23:59:59.999');
      
      console.log('Filtering by date:', {
        filterDate: filterDate.toISOString(),
        filterEndDate: filterEndDate.toISOString()
      });
      
      filteredPosts = filteredPosts.filter(post => {
        const postDate = new Date(post.created_at);
        console.log('Checking post:', {
          title: post.title,
          created_at: post.created_at,
          postDate: postDate.toISOString(),
          isInRange: postDate >= filterDate && postDate <= filterEndDate
        });
        return postDate >= filterDate && postDate <= filterEndDate;
      });
      console.log('After date filter:', filteredPosts.length);
    }

    // Apply media filter
    if (filterByMedia !== 'all') {
      console.log('Applying media filter:', filterByMedia);
      switch (filterByMedia) {
        case 'images':
          filteredPosts = filteredPosts.filter(post => 
            post.media && post.media.some(m => m.type === 'image')
          );
          console.log('After images filter:', filteredPosts.length);
          break;
        case 'videos':
          filteredPosts = filteredPosts.filter(post => 
            post.media && post.media.some(m => m.type === 'video')
          );
          console.log('After videos filter:', filteredPosts.length);
          break;
        case 'media':
          filteredPosts = filteredPosts.filter(post => 
            post.media && post.media.length > 0
          );
          console.log('After media filter:', filteredPosts.length);
          break;
        case 'none':
          filteredPosts = filteredPosts.filter(post => 
            !post.media || post.media.length === 0
          );
          console.log('After none filter:', filteredPosts.length);
          break;
        default:
          break;
      }
    }

    // Apply streak filter
    switch (filterByStreak) {
      case 'active':
        filteredPosts = filteredPosts.filter(post => post.streakDay > 1);
        console.log('After active streak filter:', filteredPosts.length);
        break;
      case 'high':
        filteredPosts = filteredPosts.filter(post => post.streakDay >= 5);
        console.log('After high streak filter:', filteredPosts.length);
        break;
      default:
        break;
    }

    // Apply sorting
    switch (sortBy) {
      case 'oldest':
        filteredPosts.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        console.log('After oldest sort:', filteredPosts.length);
        break;
      case 'streak':
        filteredPosts.sort((a, b) => b.streakDay - a.streakDay);
        console.log('After streak sort:', filteredPosts.length);
        break;
      case 'newest':
      default:
        filteredPosts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        console.log('After newest sort:', filteredPosts.length);
        break;
    }

    return filteredPosts;
  };

  return (
    <div className="Logs">
      <div className="wood"></div>
      <div className="main-container">
        <aside className="sidebar">
          <div className="create-post-form">
            <h2>Create New Log</h2>
            <div className="form-group">
              <label htmlFor="project">Project</label>
              <div className="project-selection">
                <select
                  id="project"
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                  className="form-control"
                >
                  <option value="">Select a project</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className="button secondary"
                  onClick={() => setShowNewProjectForm(!showNewProjectForm)}
                >
                  {showNewProjectForm ? 'Cancel' : 'New'}
                </button>
              </div>
            </div>

            {showNewProjectForm && (
              <div className="new-project-form">
                <input
                  type="text"
                  placeholder="Project Name"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  className="form-control"
                />
                <textarea
                  placeholder="Project Description"
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  className="form-control"
                />
                <button 
                  type="button"
                  className="button" 
                  onClick={handleCreateProject}
                >
                  Create Project
                </button>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                value={postTitle}
                onChange={(e) => setPostTitle(e.target.value)}
                className="form-control"
                placeholder="Log Titel!"
              />
            </div>

            <div className="form-group">
              <label htmlFor="content">Content</label>
              <textarea
                id="content"
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                className="form-control"
                rows="4"
                placeholder="Log Content!"
              />
            </div>

            <div
              className={`file-drop-zone ${isDragging ? 'drag-active' : ''}`}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
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
              <label htmlFor="file-input" className="button secondary">
                Choose Files
              </label>
            </div>

            {previewImages.length > 0 && (
              <div className="preview-images">
                {previewImages.map((preview, index) => (
                  <div key={index} className="preview-image-container">
                    {preview.type === 'video' ? (
                      <video 
                        src={preview.preview} 
                        className="preview-image"
                        controls
                      />
                    ) : (
                      <img 
                        src={preview.preview} 
                        alt={`Preview ${index + 1}`} 
                        className="preview-image" 
                      />
                    )}
                    <button
                      type="button"
                      className="remove-preview"
                      onClick={() => removePreview(index)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button
              type="button"
              className="button"
              onClick={handleSubmit}
              disabled={isLoading || !selectedProject}
            >
              {isLoading ? 'Posting...' : 'Create Post'}
            </button>
          </div>

          <div className="filter-controls">
            <FilterControls
              sortBy={sortBy}
              setSortBy={setSortBy}
              filterByMedia={filterByMedia}
              setFilterByMedia={setFilterByMedia}
              filterByStreak={filterByStreak}
              setFilterByStreak={setFilterByStreak}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              dateFilter={dateFilter}
              setDateFilter={setDateFilter}
            />
          </div>
        </aside>

        <main className="feed">
          {error && <div className="error-message">{error}</div>}
          
          <div className="posts-container">
            {isLoading ? (
              <div className="loading-spinner">Loading...</div>
            ) : posts.length === 0 ? (
              <div className="no-posts">
                <h3>No posts yet</h3>
                <p>Create your first post to get started!</p>
              </div>
            ) : (
              getFilteredAndSortedPosts().map((post) => (
                <Post
                  key={post.id}
                  post={post}
                  onDelete={handleDeletePost}
                  projects={projects}
                />
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Logs;
