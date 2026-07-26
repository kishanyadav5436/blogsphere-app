import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiSearch, FiBookOpen, FiUser, FiTag } from 'react-icons/fi';
import axios from 'axios';
import './SearchTypeahead.css';

const SearchTypeahead = ({ placeholder = "Search stories, topics, authors..." }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ posts: [], authors: [], tags: [] });
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!query.trim()) {
      setResults({ posts: [], authors: [], tags: [] });
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await axios.get(`/api/search?q=${encodeURIComponent(query)}`);
        setResults(res.data);
        setIsOpen(true);
      } catch (err) {
        console.error('Typeahead search error', err);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/blog?search=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
    }
  };

  return (
    <div className="typeahead-container" ref={containerRef}>
      <form onSubmit={handleSubmit} className="typeahead-input-wrapper">
        <FiSearch className="typeahead-icon" />
        <input
          type="text"
          className="typeahead-input"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim() && setIsOpen(true)}
        />
      </form>

      {isOpen && (results.posts.length > 0 || results.authors.length > 0 || results.tags.length > 0) && (
        <div className="typeahead-popover">
          {results.posts.length > 0 && (
            <>
              <div className="typeahead-section-header">Stories</div>
              {results.posts.map((post) => (
                <Link
                  key={post._id}
                  to={`/blog/${post._id}`}
                  className="typeahead-result-item"
                  onClick={() => setIsOpen(false)}
                >
                  <FiBookOpen style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
                  <span className="typeahead-title">{post.title}</span>
                </Link>
              ))}
            </>
          )}

          {results.authors.length > 0 && (
            <>
              <div className="typeahead-section-header">Authors</div>
              {results.authors.map((author) => (
                <Link
                  key={author._id}
                  to={`/profile/${author._id}`}
                  className="typeahead-result-item"
                  onClick={() => setIsOpen(false)}
                >
                  {author.avatar ? (
                    <img src={author.avatar} alt={author.name} className="typeahead-avatar" />
                  ) : (
                    <FiUser style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
                  )}
                  <span className="typeahead-title">{author.name}</span>
                </Link>
              ))}
            </>
          )}

          {results.tags.length > 0 && (
            <>
              <div className="typeahead-section-header">Topics & Tags</div>
              <div style={{ padding: '4px 6px' }}>
                {results.tags.map((tag) => (
                  <span
                    key={tag}
                    className="typeahead-tag-chip"
                    onClick={() => {
                      navigate(`/blog?tag=${tag}`);
                      setIsOpen(false);
                    }}
                  >
                    <FiTag style={{ marginRight: 4 }} /> #{tag}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchTypeahead;
