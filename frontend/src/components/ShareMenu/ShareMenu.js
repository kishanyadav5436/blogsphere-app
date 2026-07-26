import React, { useState, useRef, useEffect } from 'react';
import { FiShare2, FiTwitter, FiLinkedin, FiFacebook, FiCopy, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';
import './ShareMenu.css';

const ShareMenu = ({ title, url }) => {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef(null);

  const shareUrl = url || window.location.href;
  const shareTitle = title || 'Check out this post on BlogSphere';

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success('Link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const shareTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`,
      '_blank'
    );
  };

  const shareLinkedin = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      '_blank'
    );
  };

  const shareFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      '_blank'
    );
  };

  return (
    <div className="share-menu-container" ref={menuRef}>
      <button
        className={`share-trigger-btn ${open ? 'active' : ''}`}
        onClick={() => setOpen(!open)}
        title="Share this story"
      >
        <FiShare2 />
      </button>

      {open && (
        <div className="share-dropdown glass-card">
          <button className="share-option" onClick={handleCopy}>
            {copied ? <FiCheck style={{ color: '#2ed573' }} /> : <FiCopy />}
            <span>{copied ? 'Copied!' : 'Copy Link'}</span>
          </button>
          <button className="share-option" onClick={shareTwitter}>
            <FiTwitter style={{ color: '#1da1f2' }} />
            <span>Share on X</span>
          </button>
          <button className="share-option" onClick={shareLinkedin}>
            <FiLinkedin style={{ color: '#0a66c2' }} />
            <span>LinkedIn</span>
          </button>
          <button className="share-option" onClick={shareFacebook}>
            <FiFacebook style={{ color: '#1877f2' }} />
            <span>Facebook</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ShareMenu;
