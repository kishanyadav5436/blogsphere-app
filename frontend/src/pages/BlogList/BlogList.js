import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import BlogCard from '../../components/BlogCard/BlogCard';
import TopicChips from '../../components/TopicChips/TopicChips';
import TrendingPosts from '../../components/TrendingPosts/TrendingPosts';
import Particle from '../../components/Particle/Particle';
import { FiSearch, FiX } from 'react-icons/fi';
import './BlogList.css';

const BlogList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const initialTag = searchParams.get('tag') || '';

  const [posts, setPosts]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState(initialSearch);
  const [activeTag, setActiveTag] = useState(initialTag);
  const [page, setPage]           = useState(1);
  const [pagination, setPagination] = useState({});

  // Sync search state with URL params
  useEffect(() => {
    setSearch(searchParams.get('search') || '');
    setActiveTag(searchParams.get('tag') || '');
  }, [searchParams]);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 9 };
      if (search)    params.search = search;
      if (activeTag) params.tag    = activeTag;
      const { data } = await axios.get('/api/posts', { params });
      setPosts(data.posts || []);
      setPagination(data.pagination || {});
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, search, activeTag]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    const newParams = {};
    if (search) newParams.search = search;
    if (activeTag) newParams.tag = activeTag;
    setSearchParams(newParams);
  };

  const handleSelectTopic = (topic) => {
    setActiveTag(topic);
    setPage(1);
    const newParams = {};
    if (search) newParams.search = search;
    if (topic) newParams.tag = topic;
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearch('');
    setActiveTag('');
    setPage(1);
    setSearchParams({});
  };

  return (
    <div className="bloglist-page">
      <Particle />

      {/* Header */}
      <div className="bloglist-header">
        <div className="page-wrapper">
          <h1 className="section-title animate-fadeInUp">
            Explore <span className="gradient-text">Stories</span>
          </h1>
          <p className="section-subtitle animate-fadeInUp delay-1">
            Discover ideas, tutorials, and deep dives from our writer community
          </p>

          {/* Search */}
          <form onSubmit={handleSearchSubmit} className="search-bar animate-fadeInUp delay-2">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search posts by title, keyword, or topic..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="search-input"
            />
            {search && (
              <button type="button" className="clear-btn" onClick={() => { setSearch(''); setSearchParams({}); setPage(1); }}>
                <FiX />
              </button>
            )}
            <button type="submit" className="btn-primary search-submit">Search</button>
          </form>

          {/* Topic Chips */}
          <div style={{ marginTop: 24 }}>
            <TopicChips activeTopic={activeTag || 'All'} onSelectTopic={handleSelectTopic} />
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="page-wrapper">
        <div className="bloglist-layout">
          {/* Main Feed Column */}
          <div className="main-feed-column">
            {(search || activeTag) && (
              <div className="active-filter-bar">
                <span>
                  Filtering by: {search && <strong>"{search}"</strong>} {activeTag && <strong>Topic: {activeTag}</strong>}
                </span>
                <button className="clear-filters-btn" onClick={clearFilters}>
                  <FiX /> Clear Filters
                </button>
              </div>
            )}

            {loading ? (
              <div className="spinner-container">
                <div className="spinner" />
                <p>Loading stories...</p>
              </div>
            ) : posts.length === 0 ? (
              <div className="empty-state glass-card">
                <div className="empty-icon">📝</div>
                <h3>No stories found</h3>
                <p>Try searching for a different keyword or topic</p>
                {(search || activeTag) && (
                  <button className="btn-outline" style={{ marginTop: 20 }} onClick={clearFilters}>
                    Clear Filters
                  </button>
                )}
              </div>
            ) : (
              <div className="posts-grid-list">
                {posts.map((post, i) => (
                  <BlogCard key={post._id} post={post} index={i} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="pagination animate-fadeInUp">
                <button
                  className="page-btn"
                  disabled={page <= 1}
                  onClick={() => setPage(p => p - 1)}
                >← Prev</button>
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    className={`page-btn ${p === page ? 'active' : ''}`}
                    onClick={() => setPage(p)}
                  >{p}</button>
                ))}
                <button
                  className="page-btn"
                  disabled={page >= pagination.pages}
                  onClick={() => setPage(p => p + 1)}
                >Next →</button>
              </div>
            )}
          </div>

          {/* Sidebar Column */}
          <aside className="bloglist-sidebar">
            <TrendingPosts limit={4} />
          </aside>
        </div>
      </div>
    </div>
  );
};

export default BlogList;
