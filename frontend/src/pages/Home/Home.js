import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import MediumPostRow from '../../components/MediumPostRow/MediumPostRow';
import MediumSidebar from '../../components/MediumSidebar/MediumSidebar';
import { FiPlus, FiX } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import './Home.css';

const HOME_TABS = [
  'For you',
  'Featured',
  'Technology',
  'AI',
  'Design',
  'Business',
  'Coding',
  'Philosophy'
];

const FEATURED_AUTHORS_DATA = [
  {
    _id: 'author-1',
    name: 'Dr. Elena Rostova',
    headline: 'Lead AI Scientist @ DeepMind Research',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    bio: 'Writing on machine cognition, AI ethics, and neural representations.'
  },
  {
    _id: 'author-2',
    name: 'Marcus Vance',
    headline: 'VP of Product Design @ PixelCraft',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    bio: 'Building next-generation design systems and glassmorphic UI.'
  },
  {
    _id: 'author-3',
    name: 'Alex Nova',
    headline: 'Senior Technology Analyst @ Cosmic Labs',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    bio: 'Quantum networks researcher, tech columnist & digital minimalist.'
  }
];

const Home = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('For you');
  const [showPromo, setShowPromo] = useState(true);
  const [posts, setPosts] = useState([]);
  const [staffPicks, setStaffPicks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hiddenPostIds, setHiddenPostIds] = useState([]);

  // Fetch feed posts when activeTab changes
  useEffect(() => {
    setLoading(true);
    let endpoint = '/api/posts?limit=12';
    if (activeTab === 'Featured') {
      endpoint = '/api/posts/trending?limit=10';
    } else if (activeTab !== 'For you') {
      endpoint = `/api/posts?tag=${encodeURIComponent(activeTab)}&limit=10`;
    }

    axios.get(endpoint)
      .then(({ data }) => {
        const fetchedPosts = Array.isArray(data) ? data : (data.posts || []);
        setPosts(fetchedPosts);
      })
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, [activeTab]);

  // Fetch staff picks (trending posts) once
  useEffect(() => {
    axios.get('/api/posts/trending?limit=4')
      .then(({ data }) => {
        setStaffPicks(Array.isArray(data) ? data : []);
      })
      .catch(() => {});
  }, []);

  const handleHidePost = (postId) => {
    setHiddenPostIds((prev) => [...prev, postId]);
  };

  const visiblePosts = posts.filter((p) => !hiddenPostIds.includes(p._id));

  return (
    <div className="medium-home-container">
      {/* 1. Top Promo Banner (Medium Style) */}
      {showPromo && (
        <div className="medium-promo-banner">
          <div className="promo-banner-content">
            <span className="promo-icon">✦</span>
            <span className="promo-text">
              Get unlimited access to the best of BlogSphere for less than $1/week.{' '}
              <Link to={isAuthenticated ? '/create' : '/register'} className="promo-link">
                Become a member
              </Link>
            </span>
          </div>
          <button 
            className="promo-close-btn" 
            onClick={() => setShowPromo(false)} 
            title="Dismiss notification"
          >
            <FiX />
          </button>
        </div>
      )}

      {/* 2. Main 2-Column Responsive Layout */}
      <div className="medium-home-wrapper">
        {/* Left Column: Feed & Tabs */}
        <main className="medium-feed-column">
          {/* Medium Header Tabs */}
          <nav className="medium-tabs-nav">
            <button className="tabs-scroll-btn plus-btn" title="Add topic filter">
              <FiPlus />
            </button>

            <div className="tabs-scroll-container">
              {HOME_TABS.map((tab) => (
                <button
                  key={tab}
                  className={`medium-tab-item ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                  {activeTab === tab && <div className="tab-active-indicator" />}
                </button>
              ))}
            </div>
          </nav>

          {/* Feed Content */}
          {loading ? (
            <div className="medium-feed-loading">
              <div className="spinner-container">
                <div className="spinner" />
                <p>Loading stories...</p>
              </div>
            </div>
          ) : visiblePosts.length > 0 ? (
            <div className="medium-feed-list">
              {visiblePosts.map((post, idx) => (
                <MediumPostRow 
                  key={post._id} 
                  post={post} 
                  index={idx}
                  onHidePost={handleHidePost}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state medium-empty-state">
              <div className="empty-icon">📖</div>
              <h3>No stories found in "{activeTab}"</h3>
              <p>Be the first to publish an article in this topic topic!</p>
              <button 
                onClick={() => navigate('/create')}
                className="btn-primary"
                style={{ marginTop: '16px' }}
              >
                Write a Story
              </button>
            </div>
          )}
        </main>

        {/* Right Column: Medium Sidebar */}
        <MediumSidebar 
          staffPicks={staffPicks}
          topics={HOME_TABS.slice(2)}
          selectedTopic={activeTab}
          onSelectTopic={(topic) => setActiveTab(topic)}
          authors={FEATURED_AUTHORS_DATA}
        />
      </div>
    </div>
  );
};

export default Home;
