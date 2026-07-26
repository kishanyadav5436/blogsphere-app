import React from 'react';
import { Link } from 'react-router-dom';
import { FiAward } from 'react-icons/fi';
import './AuthorSpotlight.css';

const FEATURED_AUTHORS = [
  {
    _id: 'author-1',
    name: 'Dr. Elena Rostova',
    headline: 'Quantum Computing Researcher & Author',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    followersCount: 14200,
    storiesCount: 28,
    bio: 'Exploring quantum cryptography, decentralized mesh networks, and the future of computation.'
  },
  {
    _id: 'author-2',
    name: 'Marcus Vance',
    headline: 'Principal AI Architect @ Synapse Labs',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    followersCount: 9800,
    storiesCount: 19,
    bio: 'Building next-generation neural interfaces and autonomous agentic workflows.'
  },
  {
    _id: 'author-3',
    name: 'Sophia Lin',
    headline: 'Design Director & Editorial Strategist',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
    followersCount: 21500,
    storiesCount: 42,
    bio: 'Passionate about modern glassmorphism, editorial typography, and human-centered software interfaces.'
  }
];

const AuthorSpotlight = () => {
  return (
    <section className="author-spotlight-section">
      <div className="spotlight-header-row">
        <div>
          <span className="badge-editorial">
            <FiAward className="award-icon" /> Featured Authors
          </span>
          <h2 className="editorial-section-title">Cosmic Minds</h2>
          <p className="editorial-section-sub">Meet the top thinkers shaping digital discourse</p>
        </div>
      </div>

      <div className="authors-grid">
        {FEATURED_AUTHORS.map((author) => (
          <div key={author._id} className="editorial-card author-spotlight-card">
            <div className="spotlight-avatar-wrap">
              <img src={author.avatar} alt={author.name} className="spotlight-avatar-img" />
              <span className="verified-badge" title="Verified Author">✓</span>
            </div>

            <h3 className="author-spotlight-name">{author.name}</h3>
            <p className="author-spotlight-headline">{author.headline}</p>
            <p className="author-spotlight-bio">{author.bio}</p>

            <div className="author-spotlight-stats">
              <span><strong>{author.followersCount.toLocaleString()}</strong> Followers</span>
              <span>•</span>
              <span><strong>{author.storiesCount}</strong> Stories</span>
            </div>

            <div className="author-spotlight-actions">
              <Link to={`/blog`} className="btn-outline btn-spotlight">
                View Stories
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AuthorSpotlight;
