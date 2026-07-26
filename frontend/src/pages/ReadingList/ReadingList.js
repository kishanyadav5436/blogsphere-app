import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import BlogCard from '../../components/BlogCard/BlogCard';
import Particle from '../../components/Particle/Particle';
import { FiBookmark } from 'react-icons/fi';
import toast from 'react-hot-toast';
import './ReadingList.css';

const ReadingList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/api/bookmarks');
      setPosts(data || []);
    } catch {
      toast.error('Failed to load reading list');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reading-list-page">
      <Particle />

      <div className="page-wrapper">
        <div className="reading-list-header animate-fadeInUp">
          <div className="header-title-row">
            <FiBookmark className="header-icon" />
            <h1 className="section-title" style={{ textAlign: 'left', marginBottom: 0 }}>
              Your <span className="gradient-text">Reading List</span>
            </h1>
          </div>
          <p className="section-subtitle" style={{ textAlign: 'left', marginTop: 6, marginBottom: 0 }}>
            Stories you have saved for later reading
          </p>
        </div>

        {loading ? (
          <div className="spinner-container" style={{ minHeight: '50vh' }}>
            <div className="spinner" />
            <p>Loading saved stories...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="empty-state glass-card animate-fadeInUp">
            <div className="empty-icon">🔖</div>
            <h3>Your reading list is empty</h3>
            <p>Click the bookmark icon on any story to save it for later.</p>
            <Link to="/blog" className="btn-primary" style={{ marginTop: 20 }}>
              Explore Stories
            </Link>
          </div>
        ) : (
          <div className="posts-grid animate-fadeInUp delay-1">
            {posts.map((post, idx) => (
              <BlogCard key={post._id} post={post} index={idx} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReadingList;
