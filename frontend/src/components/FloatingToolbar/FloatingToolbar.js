import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ClapButton from '../ClapButton/ClapButton';
import ShareMenu from '../ShareMenu/ShareMenu';
import { useAuth } from '../../context/AuthContext';
import { FiMessageSquare, FiBookmark } from 'react-icons/fi';
import { FaBookmark } from 'react-icons/fa';
import toast from 'react-hot-toast';
import './FloatingToolbar.css';

const FloatingToolbar = ({ post, onOpenComments, commentCount }) => {
  const { isAuthenticated } = useAuth();
  const [bookmarked, setBookmarked] = useState(false);
  const [bookmarking, setBookmarking] = useState(false);

  useEffect(() => {
    if (isAuthenticated && post?._id) {
      axios
        .get(`/api/bookmarks/check/${post._id}`)
        .then(({ data }) => setBookmarked(data.bookmarked))
        .catch(() => {});
    }
  }, [isAuthenticated, post?._id]);

  const handleBookmarkToggle = async () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to save to your reading list');
      return;
    }
    setBookmarking(true);
    try {
      const { data } = await axios.post(`/api/bookmarks/${post._id}`);
      setBookmarked(data.bookmarked);
      toast.success(data.message);
    } catch {
      toast.error('Failed to update bookmark');
    } finally {
      setBookmarking(false);
    }
  };

  if (!post) return null;

  return (
    <div className="floating-toolbar-wrapper">
      <div className="floating-toolbar glass-card">
        {/* Medium-style Clap Button */}
        <ClapButton
          postId={post._id}
          initialTotalClaps={post.totalClaps || 0}
          initialUserClaps={0}
        />

        <div className="toolbar-divider" />

        {/* Comment Drawer Trigger */}
        <button className="toolbar-btn" onClick={onOpenComments} title="View responses">
          <FiMessageSquare />
          <span className="toolbar-count">{commentCount}</span>
        </button>

        <div className="toolbar-divider" />

        {/* Bookmark Trigger */}
        <button
          className={`toolbar-btn ${bookmarked ? 'bookmarked' : ''}`}
          onClick={handleBookmarkToggle}
          disabled={bookmarking}
          title={bookmarked ? 'Remove from reading list' : 'Save to reading list'}
        >
          {bookmarked ? <FaBookmark className="bookmark-icon active" /> : <FiBookmark className="bookmark-icon" />}
        </button>

        <div className="toolbar-divider" />

        {/* Share Menu */}
        <ShareMenu title={post.title} />
      </div>
    </div>
  );
};

export default FloatingToolbar;
