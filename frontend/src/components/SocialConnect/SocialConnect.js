import React from 'react';
import { FiGithub, FiTwitter, FiLinkedin, FiInstagram } from 'react-icons/fi';
import './SocialConnect.css';

const SocialConnect = () => {
  return (
    <section className="social-connect-section">
      <div className="page-wrapper text-center">
        <h2 className="connect-title">FIND US ON</h2>
        <p className="connect-subtitle">
          Feel free to <span className="gradient-text">connect</span> with us across social platforms
        </p>

        <div className="social-icon-row">
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="social-icon-btn"
            aria-label="GitHub"
          >
            <FiGithub />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noreferrer"
            className="social-icon-btn"
            aria-label="Twitter"
          >
            <FiTwitter />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noreferrer"
            className="social-icon-btn"
            aria-label="LinkedIn"
          >
            <FiLinkedin />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="social-icon-btn"
            aria-label="Instagram"
          >
            <FiInstagram />
          </a>
        </div>
      </div>
    </section>
  );
};

export default SocialConnect;
