import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiSearch,
  FiHome,
  FiBookOpen,
  FiPlusCircle,
  FiBookmark,
  FiUser,
  FiSettings,
  FiMoon,
  FiSun,
  FiArrowRight,
} from 'react-icons/fi';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import './CommandPalette.css';

const CommandPalette = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState({ posts: [], authors: [], tags: [] });
  const [selectedIndex] = useState(0);
  const { isAuthenticated, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSearchResults({ posts: [], authors: [], tags: [] });
    }
  }, [isOpen]);

  // Debounced typeahead search query
  useEffect(() => {
    if (!query.trim()) {
      setSearchResults({ posts: [], authors: [], tags: [] });
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const res = await axios.get(`/api/search?q=${encodeURIComponent(query)}`);
        setSearchResults(res.data);
      } catch (err) {
        console.error('CommandPalette search error', err);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  // Keyboard shortcut handlers inside modal
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  const defaultActions = [
    { id: 'home', title: 'Go to Home', icon: <FiHome />, action: () => navigate('/') },
    { id: 'explore', title: 'Explore Articles', icon: <FiBookOpen />, action: () => navigate('/blog') },
    ...(isAuthenticated
      ? [
          { id: 'write', title: 'Write New Post', icon: <FiPlusCircle />, action: () => navigate('/create') },
          { id: 'bookmarks', title: 'My Reading List', icon: <FiBookmark />, action: () => navigate('/reading-list') },
          { id: 'profile', title: 'View My Profile', icon: <FiUser />, action: () => navigate(`/profile/${user?._id}`) },
          { id: 'settings', title: 'Account Settings', icon: <FiSettings />, action: () => navigate('/settings') },
        ]
      : []),
    {
      id: 'theme',
      title: `Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`,
      icon: theme === 'dark' ? <FiSun /> : <FiMoon />,
      action: () => toggleTheme(),
    },
  ];

  const handleSelect = (actionFn) => {
    actionFn();
    onClose();
  };

  return (
    <div className="cmd-overlay" onClick={onClose} onKeyDown={handleKeyDown}>
      <div className="cmd-modal" onClick={(e) => e.stopPropagation()}>
        <div className="cmd-search-bar">
          <FiSearch className="cmd-search-icon" />
          <input
            ref={inputRef}
            type="text"
            className="cmd-input"
            placeholder="Type a command or search posts, tags & authors..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <span className="cmd-shortcut-hint">ESC</span>
        </div>

        <div className="cmd-results-list">
          {/* Quick Actions */}
          {!query.trim() && (
            <>
              <div className="cmd-group-title">Navigation & Quick Actions</div>
              {defaultActions.map((item, idx) => (
                <div
                  key={item.id}
                  className={`cmd-item ${idx === selectedIndex ? 'selected' : ''}`}
                  onClick={() => handleSelect(item.action)}
                >
                  <span className="cmd-item-icon">{item.icon}</span>
                  <span className="cmd-item-text">{item.title}</span>
                  <FiArrowRight style={{ opacity: 0.5 }} />
                </div>
              ))}
            </>
          )}

          {/* Search Results */}
          {query.trim() && (
            <>
              {searchResults.posts.length > 0 && (
                <>
                  <div className="cmd-group-title">Posts</div>
                  {searchResults.posts.map((post) => (
                    <div
                      key={post._id}
                      className="cmd-item"
                      onClick={() => handleSelect(() => navigate(`/blog/${post._id}`))}
                    >
                      <span className="cmd-item-icon"><FiBookOpen /></span>
                      <span className="cmd-item-text">{post.title}</span>
                    </div>
                  ))}
                </>
              )}

              {searchResults.authors.length > 0 && (
                <>
                  <div className="cmd-group-title">Authors</div>
                  {searchResults.authors.map((author) => (
                    <div
                      key={author._id}
                      className="cmd-item"
                      onClick={() => handleSelect(() => navigate(`/profile/${author._id}`))}
                    >
                      <span className="cmd-item-icon"><FiUser /></span>
                      <span className="cmd-item-text">{author.name} — {author.headline || 'Author'}</span>
                    </div>
                  ))}
                </>
              )}

              {searchResults.tags.length > 0 && (
                <>
                  <div className="cmd-group-title">Topics & Tags</div>
                  {searchResults.tags.map((tag) => (
                    <div
                      key={tag}
                      className="cmd-item"
                      onClick={() => handleSelect(() => navigate(`/blog?tag=${tag}`))}
                    >
                      <span className="cmd-item-icon">#</span>
                      <span className="cmd-item-text">{tag}</span>
                    </div>
                  ))}
                </>
              )}

              {searchResults.posts.length === 0 &&
                searchResults.authors.length === 0 &&
                searchResults.tags.length === 0 && (
                  <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No results found for "{query}"
                  </div>
                )}
            </>
          )}
        </div>

        <div className="cmd-footer">
          <div className="cmd-footer-keys">
            <span className="cmd-key-chip"><kbd>↑</kbd> <kbd>↓</kbd> Navigate</span>
            <span className="cmd-key-chip"><kbd>↵</kbd> Select</span>
            <span className="cmd-key-chip"><kbd>ESC</kbd> Close</span>
          </div>
          <div>BlogSphere Command Palette</div>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
