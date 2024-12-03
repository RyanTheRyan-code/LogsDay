// all the filter stuff for posts
import React from 'react';
import './FilterControls.css';

function FilterControls({ 
  sortBy, 
  setSortBy, 
  filterByMedia,
  setFilterByMedia,
  filterByStreak,
  setFilterByStreak,
  searchQuery,
  setSearchQuery,
  dateFilter,
  setDateFilter
}) {
  return (
    <div className="filter-controls">
      { /* search box */ }
      <div className="filter-section">
        <input
          type="text"
          placeholder="Search posts, authors..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      { /* date picker */ }
      <div className="filter-section">
        <label>Date:</label>
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="date-input"
        />
        {dateFilter && (
          <button 
            onClick={() => setDateFilter('')}
            className="clear-date-btn"
            title="Clear date filter"
          >
            ×
          </button>
        )}
      </div>

      { /* sorting options */ }
      <div className="filter-section">
        <label>Sort by:</label>
        <select 
          value={sortBy} 
          onChange={(e) => setSortBy(e.target.value)}
          className="sort-select"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="streak">Highest Streak</option>
        </select>
      </div>

      { /* media filters */ }
      <div className="filter-section">
        <label>Filter by Media:</label>
        <select
          value={filterByMedia}
          onChange={(e) => setFilterByMedia(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Posts</option>
          <option value="images">With Images</option>
          <option value="videos">With Videos</option>
          <option value="media">With Any Media</option>
          <option value="none">No Media</option>
        </select>
      </div>

      { /* streak filters */ }
      <div className="filter-section">
        <label>Streak Status:</label>
        <select
          value={filterByStreak}
          onChange={(e) => setFilterByStreak(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Posts</option>
          <option value="active">Active Streaks</option>
          <option value="high">High Streaks (5+)</option>
        </select>
      </div>
    </div>
  );
}

export default FilterControls;
