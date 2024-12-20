import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Logs.css';
import Post from './Post';
import FilterControls from './FilterControls';
import barkTexture from '../assets/bark-texture.jpg';
import woodGrain from '../assets/wood-grain.png';

const styles = {
  wood: {
    backgroundImage: `url(${barkTexture})`
  },
  woodGrain: {
    backgroundImage: `url(${woodGrain})`
  }
};

function Logs() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('newest');
  const [filterByMedia, setFilterByMedia] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [streakDay, setStreakDay] = useState(1);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterByStreak, setFilterByStreak] = useState('all');
  const [token, setToken] = useState(localStorage.getItem('token'));

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

  useEffect(() => {
    const updateWoodHeight = () => {
      const contentContainer = document.querySelector('.content-container');
      const wood = document.querySelector('.wood');
      if (contentContainer && wood) {
        wood.style.height = `${contentContainer.scrollHeight}px`;
      }
    };

    updateWoodHeight();
    window.addEventListener('resize', updateWoodHeight);

    return () => window.removeEventListener('resize', updateWoodHeight);
  }, [posts]);

  const fetchPosts = async () => {
    try {
      let url = `${process.env.REACT_APP_BACKEND_URL}/posts`;
      
      // slap on the date filter if we got one
      if (dateFilter) {
        url += `?date=${dateFilter}`;
      }
      
      console.log('Fetching posts from:', url);
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token || ''}`
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
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/projects`, {
        headers: {
          'Authorization': `Bearer ${token || ''}`
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
      fetchPosts();
    }
  };

  
  const getFilteredAndSortedPosts = () => {
    let filteredPosts = [...posts];
    console.log('Initial posts:', filteredPosts.length);

    
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

    
    if (dateFilter) {
      const filterDate = new Date(dateFilter + 'T00:00:00-08:00');
      const filterStart = filterDate.toISOString().split('T')[0];
      const nextDay = new Date(filterDate);
      nextDay.setDate(filterDate.getDate() + 1);
      const filterEnd = nextDay.toISOString().split('T')[0];
      
      console.log('Filtering by date:', {
        dateFilter,
        filterStart,
        filterEnd,
        filterDate: filterDate.toString()
      });
      
      filteredPosts = filteredPosts.filter(post => {
        const postDate = post.created_at.split('T')[0];
        const isInRange = postDate >= filterStart && postDate < filterEnd;
        
        console.log('Checking post:', {
          title: post.title,
          created_at: post.created_at,
          postDate,
          isInRange
        });
        return isInRange;
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
      <div className="wood" style={styles.wood}></div>
      <div className="content-container">
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
        
        <button 
          className="create-post-button" 
          onClick={() => navigate('/create-post')}
        >
          Create New Log
        </button>

        <div className="posts-container">
          {error && <div className="error-message">{error}</div>}
          {isLoading ? (
            <div>Loading...</div>
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
      </div>
    </div>
  );
}

export default Logs;
