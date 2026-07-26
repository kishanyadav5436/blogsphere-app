import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import BlogCard from '../../components/BlogCard/BlogCard';
import TopicChips from '../../components/TopicChips/TopicChips';
import AuthorSpotlight from '../../components/AuthorSpotlight/AuthorSpotlight';
import SocialConnect from '../../components/SocialConnect/SocialConnect';
import { FiArrowRight } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import './Home.css';

const TYPEWRITER_PHRASES = [
  'Explore the Universe of Thoughts',
  'Share Your Unique Story',
  'Connect with Global Creators'
];

const Home = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex]     = useState(0);
  const [isDeleting, setIsDeleting]   = useState(false);
  const [recentPosts, setRecentPosts] = useState([]);
  const [stats, setStats]             = useState({ posts: 0 });

  // Typewriter Effect
  useEffect(() => {
    const currentPhrase = TYPEWRITER_PHRASES[phraseIndex];
    let speed = isDeleting ? 50 : 120;

    if (!isDeleting && charIndex === currentPhrase.length) {
      speed = 2200; // Pause at end of phrase
    } else if (isDeleting && charIndex === 0) {
      setIsDeleting(false);
      setPhraseIndex((prev) => (prev + 1) % TYPEWRITER_PHRASES.length);
      speed = 400;
    }

    const timer = setTimeout(() => {
      if (!isDeleting && charIndex < currentPhrase.length) {
        setCharIndex(charIndex + 1);
      } else if (isDeleting && charIndex > 0) {
        setCharIndex(charIndex - 1);
      } else if (!isDeleting && charIndex === currentPhrase.length) {
        setIsDeleting(true);
      }
    }, speed);

    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, phraseIndex]);

  // Fetch recent posts & total count
  useEffect(() => {
    axios.get('/api/posts?limit=6')
      .then(({ data }) => {
        setRecentPosts(data.posts || []);
        setStats(s => ({ ...s, posts: data.pagination?.total || 0 }));
      })
      .catch(() => {});
  }, []);

  const mainFeature = recentPosts[0];
  const sideFeatures = recentPosts.slice(1, 3);

  return (
    <div className="home-page-container relative overflow-hidden">
      {/* Background Ambient Glow Blobs */}
      <div className="cosmic-glow-blob" style={{ top: '-100px', left: '10%' }} />
      <div className="cosmic-glow-blob" style={{ top: '500px', right: '5%', animationDelay: '-5s' }} />

      {/* ── HERO SECTION (Cosmic Editorial Centered) ── */}
      <section className="hero-editorial-section">
        <div className="hero-editorial-content">
          <h1 className="hero-typewriter-title">
            <span className="typewriter-text">
              {TYPEWRITER_PHRASES[phraseIndex].substring(0, charIndex)}
            </span>
            <span className="typewriter-cursor"></span>
          </h1>

          <p className="hero-editorial-subtitle">
            Join a global ecosystem of thinkers, creators, and storytellers. Immerse yourself in the next generation of digital expression.
          </p>

          <button
            onClick={() => navigate(isAuthenticated ? '/create' : '/register')}
            className="primary-gradient-button hero-cta-btn"
          >
            {isAuthenticated ? 'Start Writing' : 'Get Started Free'}
          </button>
        </div>
      </section>

      {/* ── STATS GRID ── */}
      <section className="stats-editorial-section page-wrapper">
        <div className="stats-grid">
          <div className="editorial-card stat-editorial-card">
            <span className="material-symbols-outlined stat-icon-material">group</span>
            <h3 className="stat-value-text">10K+</h3>
            <p className="stat-label-text">Authors</p>
          </div>

          <div className="editorial-card stat-editorial-card">
            <span className="material-symbols-outlined stat-icon-material">auto_stories</span>
            <h3 className="stat-value-text">{stats.posts > 0 ? `${stats.posts}+` : '50K+'}</h3>
            <p className="stat-label-text">Stories</p>
          </div>

          <div className="editorial-card stat-editorial-card">
            <span className="material-symbols-outlined stat-icon-material">visibility</span>
            <h3 className="stat-value-text">1M+</h3>
            <p className="stat-label-text">Readers</p>
          </div>
        </div>
      </section>

      {/* ── TOPIC BAR ── */}
      <section className="page-wrapper topics-editorial-wrap">
        <TopicChips />
      </section>

      {/* ── FEATURED CONTENT ("TRENDING REALITIES") ── */}
      <section className="page-wrapper featured-editorial-section">
        <div className="featured-header-row">
          <div>
            <h2 className="editorial-section-title">Trending Realities</h2>
            <p className="editorial-section-sub">The most captivating thoughts from the stratosphere.</p>
          </div>
          <Link to="/blog" className="view-universe-link">
            View Universe <FiArrowRight />
          </Link>
        </div>

        <div className="featured-grid">
          {/* Main Feature Card */}
          <div className="editorial-card main-feature-card group" onClick={() => mainFeature && navigate(`/blog/${mainFeature._id}`)}>
            <div className="main-feature-img-wrapper">
              <div
                className="main-feature-img"
                style={{
                  backgroundImage: `url(${mainFeature?.coverImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80'})`
                }}
              />
            </div>
            <div className="main-feature-body">
              <div className="badges-row">
                <span className="category-badge">{mainFeature?.category || 'Technology'}</span>
                <span className="read-time-badge">{mainFeature?.readTime || 5} min read</span>
              </div>
              <h4 className="main-feature-title">
                {mainFeature?.title || 'Architecting the Quantum Web: A New Era of Decentralized Connectivity'}
              </h4>
              <p className="main-feature-snippet">
                {mainFeature?.snippet || 'Discover how quantum entanglement is reshaping our understanding of global networks and what it means for digital privacy...'}
              </p>
            </div>
          </div>

          {/* Side Column Cards */}
          <div className="side-features-column">
            {sideFeatures.length > 0 ? (
              sideFeatures.map((post) => (
                <div
                  key={post._id}
                  className="editorial-card side-feature-card group"
                  onClick={() => navigate(`/blog/${post._id}`)}
                >
                  <div className="side-feature-img-wrap">
                    <img
                      src={post.coverImage || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=400&q=80'}
                      alt={post.title}
                      className="side-feature-img"
                    />
                  </div>
                  <div className="side-feature-info">
                    <span className="side-category-text">{post.category || 'Innovation'}</span>
                    <h4 className="side-feature-title">{post.title}</h4>
                    <p className="side-feature-snippet">{post.snippet}</p>
                  </div>
                </div>
              ))
            ) : (
              <>
                <div className="editorial-card side-feature-card group" onClick={() => navigate('/blog')}>
                  <div className="side-feature-img-wrap">
                    <img
                      src="https://images.unsplash.com/photo-1507499739999-097706ad8914?auto=format&fit=crop&w=400&q=80"
                      alt="Philosophy"
                      className="side-feature-img"
                    />
                  </div>
                  <div className="side-feature-info">
                    <span className="side-category-text">Philosophy</span>
                    <h4 className="side-feature-title">The Solitude of Digital Existence</h4>
                    <p className="side-feature-snippet">Exploring human connection in a world of pixels.</p>
                  </div>
                </div>

                <div className="editorial-card side-feature-card group" onClick={() => navigate('/blog')}>
                  <div className="side-feature-img-wrap">
                    <img
                      src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=400&q=80"
                      alt="Innovation"
                      className="side-feature-img"
                    />
                  </div>
                  <div className="side-feature-info">
                    <span className="side-category-text">Innovation</span>
                    <h4 className="side-feature-title">Neuro-Interfaces: The End of Typing</h4>
                    <p className="side-feature-snippet">Direct thought-to-blog technology is closer than anticipated.</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── ALL RECENT STORIES GRID ── */}
      {recentPosts.length > 3 && (
        <section className="page-wrapper recent-grid-section">
          <h2 className="editorial-section-title">Latest Articles</h2>
          <p className="editorial-section-sub">Fresh perspectives from our community</p>
          <div className="recent-posts-grid">
            {recentPosts.slice(3).map((post, i) => (
              <BlogCard key={post._id} post={post} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* ── AUTHOR SPOTLIGHT ── */}
      <section className="page-wrapper">
        <AuthorSpotlight />
      </section>

      {/* ── SOCIAL CONNECT ── */}
      <SocialConnect />
    </div>
  );
};

export default Home;
