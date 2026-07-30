import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { 
  FiBookmark, 
  FiMinusCircle, 
  FiMessageSquare, 
  FiShare2 
} from 'react-icons/fi';
import { FaBookmark } from 'react-icons/fa';
import { PiHandsClappingFill, PiHandsClapping } from 'react-icons/pi';
import toast from 'react-hot-toast';
import './MediumPostRow.css';

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
};

const MediumPostRow = ({ post, index = 0, onHidePost }) => {
  const { isAuthenticated } = useAuth();
  const [bookmarked, setBookmarked] = useState(false);
  const [claps, setClaps] = useState(post?.totalClaps || 0);
  const [userClapped, setUserClapped] = useState(false);

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

  const handleClap = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error('Sign in to clap for stories');
      return;
    }
    try {
      const { data } = await axios.put(`/api/posts/${post._id}/clap`, { count: 1 });
      setClaps(data.totalClaps);
      setUserClapped(true);
      toast.success('Clapped! 👏', { duration: 1500 });
    } catch {
      toast.error('Failed to clap');
    }
  };

  const handleShare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/blog/${post._id}`;
    if (navigator.share) {
      navigator.share({ title: post.title, url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleNotInterested = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onHidePost) onHidePost(post._id);
    toast('We will show fewer stories like this', { icon: '👁️' });
  };

  const mainTag = post?.tags?.[0] || 'Technology';
  const authorName = post?.author?.name || 'Anonymous';
  const authorAvatar = post?.author?.avatar;
  const authorId = post?.author?._id;

  return (
    <article className="medium-post-row animate-fadeInUp" style={{ animationDelay: `${(index % 5) * 0.06}s` }}>
      {/* Feed Context Header */}
      <div className="medium-row-context">
        <span className="context-icon">📄</span>
        <span className="context-text">Because you follow <strong>{mainTag}</strong></span>
      </div>

      {/* Main Row Grid Layout */}
      <div className="medium-row-body">
        {/* Left Column: Author, Title, Snippet, Actions */}
        <div className="medium-row-content">
          {/* Author Header */}
          <div className="medium-row-author">
            <Link to={authorId ? `/profile/${authorId}` : '#'} className="author-avatar-link">
              <div className="author-avatar-xs">
                {authorAvatar ? (
                  <img src={authorAvatar} alt={authorName} />
                ) : (
                  <span>{authorName[0]?.toUpperCase() || 'A'}</span>
                )}
              </div>
            </Link>
            <div className="author-info-line">
              <Link to={authorId ? `/profile/${authorId}` : '#'} className="author-name-link">
                {authorName}
              </Link>
              <span className="author-separator">in</span>
              <span className="author-publication">{mainTag}</span>
              <span className="author-separator">·</span>
              <span className="post-date-text">{formatDate(post.createdAt)}</span>
            </div>
          </div>

          {/* Title */}
          <Link to={`/blog/${post._id}`} className="medium-row-title-link">
            <h2 className="medium-row-title">{post.title}</h2>
          </Link>

          {/* Subtitle / Excerpt */}
          <p className="medium-row-excerpt">{post.excerpt}</p>

          {/* Footer Meta & Interaction Bar */}
          <div className="medium-row-footer">
            <div className="footer-left-meta">
              <span className="member-sparkle-badge" title="Member-only story">✦</span>
              <span className="read-time-text">{post.readTime || 5} min read</span>
              <span className="meta-tag-pill">{mainTag}</span>
            </div>

            <div className="footer-right-actions">
              {/* Clap button */}
              <button 
                className={`medium-action-btn clap-btn ${userClapped ? 'clapped' : ''}`}
                onClick={handleClap}
                title="Clap for story"
              >
                {userClapped ? <PiHandsClappingFill className="action-icon clap-active" /> : <PiHandsClapping className="action-icon" />}
                <span className="action-count">{claps > 0 ? claps : ''}</span>
              </button>

              {/* Comments link */}
              <Link to={`/blog/${post._id}#comments`} className="medium-action-btn" title="View comments">
                <FiMessageSquare className="action-icon" />
              </Link>

              {/* Not interested button */}
              <button 
                className="medium-action-btn" 
                onClick={handleNotInterested}
                title="Show less like this"
              >
                <FiMinusCircle className="action-icon" />
              </button>

              {/* Bookmark button */}
              <button 
                className={`medium-action-btn bookmark-btn ${bookmarked ? 'active' : ''}`}
                onClick={handleBookmark}
                title={bookmarked ? 'Remove bookmark' : 'Save story'}
              >
                {bookmarked ? <FaBookmark className="action-icon bookmarked-active" /> : <FiBookmark className="action-icon" />}
              </button>

              {/* Share button */}
              <button className="medium-action-btn" onClick={handleShare} title="Share story">
                <FiShare2 className="action-icon" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Thumbnail Preview Image */}
        <Link to={`/blog/${post._id}`} className="medium-row-thumb-link">
          <div className="medium-row-thumb-wrapper">
            <img 
              src={post.coverImage || [
                'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80',
                'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=400&q=80',
                'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=400&q=80',
                'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=400&q=80',
                'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=400&q=80'
              ][index % 5]} 
              alt={post.title} 
              loading="lazy"
              className="medium-row-thumb-img"
            />
          </div>
        </Link>
      </div>
    </article>
  );
};

export default MediumPostRow;
