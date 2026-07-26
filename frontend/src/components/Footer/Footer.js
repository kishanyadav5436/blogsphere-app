import React from 'react';
import { Link } from 'react-router-dom';
import { FiGithub, FiTwitter, FiLinkedin, FiHeart } from 'react-icons/fi';
import './Footer.css';

const TOPICS = ['Technology', 'Coding', 'AI', 'Web Development', 'Design', 'Productivity'];

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              BlogSphere
            </Link>
            <p className="footer-tagline">
              Discover stories, ideas, and expertise from writers on every topic. Join a global ecosystem of thinkers, creators, and storytellers.
            </p>
          </div>

          <div className="footer-links-group">
            <h4>Discover</h4>
            {TOPICS.map((t) => (
              <Link key={t} to={`/blog?tag=${encodeURIComponent(t)}`}>{t}</Link>
            ))}
          </div>

          <div className="footer-links-group">
            <h4>Navigate</h4>
            <Link to="/">Home</Link>
            <Link to="/blog">Explore Stories</Link>
            <Link to="/reading-list">Reading List</Link>
            <Link to="/create">Write a Story</Link>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copy">
            Made with <FiHeart className="heart-icon" /> — BlogSphere
          </p>
          <div className="footer-socials">
            <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub">
              <FiGithub />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter">
              <FiTwitter />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <FiLinkedin />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
