import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { FiClock, FiCalendar, FiTag, FiBookmark } from 'react-icons/fi';
import { FaBookmark } from 'react-icons/fa';
import { PiHandsClappingFill } from 'react-icons/pi';
import toast from 'react-hot-toast';
import './BlogCard.css';

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
};

const BlogCard = ({ post, index = 0 }) => {
  const { isAuthenticated } = useAuth();
  const [bookmarked, setBookmarked] = useState(false);
  const delay = `${(index % 6) * 0.08}s`;

  useEffect(() => {
    if (isAuthenticated && post?._id) {
      axios.get(`/api/bookmarks/check/${post._id}`)
        .then(({ data }) => setBookmarked(data.bookmarked))
        .catch(() => {});
    }
  }, [isAuthenticated, post?._id]);

  const handleBookmark = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error('Sign in to save stories');
      return;
    }
    try {
      const { data } = await axios.post(`/api/bookmarks/${post._id}`);
      setBookmarked(data.bookmarked);
      toast.success(data.message);
    } catch {
      toast.error('Failed to bookmark');
    }
  };

  return (
    <article
      className="blog-card animate-fadeInUp"
      style={{ animationDelay: delay, opacity: 0 }}
    >
      {/* Cover Image */}
      {post.coverImage ? (
        <Link to={`/blog/${post._id}`} className="card-image-link">
          <div className="card-image">
            <img src={post.coverImage} alt={post.title} loading="lazy" />
            <div className="card-image-overlay" />
          </div>
        </Link>
      ) : (
        <Link to={`/blog/${post._id}`} className="card-image-link">
          <div className="card-image card-image-placeholder">
            <div className="placeholder-pattern">
              <span>{post.title?.[0]?.toUpperCase() || 'B'}</span>
            </div>
          </div>
        </Link>
      )}

      {/* Card Body */}
      <div className="card-body">
        {/* Author row & Bookmark icon */}
        <div className="card-header-row">
          <Link to={`/profile/${post.author?._id}`} className="card-author">
            <div className="author-avatar">
              {post.author?.avatar ? (
                <img src={post.author.avatar} alt={post.author.name} />
              ) : (
                <span>{post.author?.name?.[0]?.toUpperCase() || 'A'}</span>
              )}
            </div>
            <div className="author-name-group">
              <span className="author-name">{post.author?.name || 'Anonymous'}</span>
              {post.author?.headline && <span className="author-headline-xs">{post.author.headline}</span>}
            </div>
          </Link>

          <button
            className={`card-bookmark-btn ${bookmarked ? 'active' : ''}`}
            onClick={handleBookmark}
            title={bookmarked ? 'Remove bookmark' : 'Bookmark story'}
          >
            {bookmarked ? <FaBookmark /> : <FiBookmark />}
          </button>
        </div>

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="card-tags">
            {post.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="tag-chip">
                <FiTag style={{ marginRight: 3, fontSize: '0.7rem' }} />
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <Link to={`/blog/${post._id}`}>
          <h2 className="card-title">{post.title}</h2>
        </Link>

        {/* Excerpt */}
        <p className="card-excerpt">{post.excerpt}</p>

        {/* Footer */}
        <div className="card-footer">
          {/* Meta */}
          <div className="card-meta">
            <span className="meta-item">
              <FiCalendar /> {formatDate(post.createdAt)}
            </span>
            <span className="meta-item">
              <FiClock /> {post.readTime} min read
            </span>
            <span className="meta-item claps">
              <PiHandsClappingFill /> {post.totalClaps || 0}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
