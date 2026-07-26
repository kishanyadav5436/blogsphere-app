import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FiTrendingUp, FiClock, FiCalendar } from 'react-icons/fi';
import './TrendingPosts.css';

const TrendingPosts = ({ limit = 6 }) => {
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`/api/posts/trending?limit=${limit}`)
      .then(({ data }) => setTrending(data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [limit]);

  if (loading) {
    return (
      <div className="trending-section">
        <div className="spinner-container" style={{ minHeight: '120px' }}>
          <div className="spinner" />
        </div>
      </div>
    );
  }

  if (trending.length === 0) return null;

  return (
    <div className="trending-section">
      <div className="trending-header">
        <FiTrendingUp className="trending-icon" />
        <h3>Trending Stories</h3>
      </div>

      <div className="trending-grid">
        {trending.map((post, idx) => {
          const rankNum = String(idx + 1).padStart(2, '0');
          return (
            <article key={post._id} className="trending-card glass-card">
              <div className="trending-rank">{rankNum}</div>
              <div className="trending-content">
                {/* Author */}
                <Link to={`/profile/${post.author?._id}`} className="trending-author">
                  <div className="author-avatar-xs">
                    {post.author?.avatar ? (
                      <img src={post.author.avatar} alt={post.author.name} />
                    ) : (
                      <span>{post.author?.name?.[0]?.toUpperCase() || 'A'}</span>
                    )}
                  </div>
                  <span className="author-name-sm">{post.author?.name || 'Anonymous'}</span>
                </Link>

                {/* Title */}
                <Link to={`/blog/${post._id}`}>
                  <h4 className="trending-title">{post.title}</h4>
                </Link>

                {/* Meta */}
                <div className="trending-meta">
                  <span>
                    <FiCalendar /> {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                  <span>
                    <FiClock /> {post.readTime} min read
                  </span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default TrendingPosts;
