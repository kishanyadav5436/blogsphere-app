import { useEffect, useRef, useState } from 'react';
import { FiBookmark, FiLogIn, FiLogOut, FiSettings, FiUser, FiUserPlus, FiMoon, FiSun, FiSearch } from 'react-icons/fi';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import NotificationBell from '../NotificationBell/NotificationBell';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navbarRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    setMenuOpen(false);
    navigate('/');
  };

  const closeMenu = () => {
    setMenuOpen(false);
    setUserDropdownOpen(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/blog?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setSearchOpen(false);
      closeMenu();
    }
  };

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`} ref={navbarRef}>
      <div className="navbar-container">
        {/* Logo */}
        <div className="nav-brand-group">
          <Link to="/" className="navbar-logo" onClick={closeMenu}>
            BlogSphere
          </Link>
        </div>

        {/* Desktop Nav Links */}
        <div className="nav-desktop-links">
          <NavLink to="/" className="nav-link" onClick={closeMenu} end>Home</NavLink>
          <NavLink to="/blog" className="nav-link" onClick={closeMenu}>Explore</NavLink>
        </div>

        {/* Desktop Right Actions */}
        <div className="nav-desktop-actions">
          {/* Theme Switcher Toggle */}
          <button
            className="nav-icon-btn"
            onClick={toggleTheme}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <FiMoon style={{ fontSize: '1.2rem' }} /> : <FiSun style={{ fontSize: '1.2rem' }} />}
          </button>

          {/* Search Toggle (Ctrl + K) */}
          <button className="nav-icon-btn" onClick={() => setSearchOpen(!searchOpen)} title="Search (Ctrl + K)">
            <FiSearch style={{ fontSize: '1.2rem' }} />
          </button>

          {/* Notification Bell */}
          <NotificationBell />

          {isAuthenticated ? (
            <div className="nav-user-wrapper" ref={dropdownRef}>
              <button
                className="nav-user-btn"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              >
                <div className="user-avatar">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} />
                  ) : (
                    <span>{user?.name?.[0]?.toUpperCase() || 'U'}</span>
                  )}
                </div>
              </button>

              {userDropdownOpen && (
                <div className="user-dropdown-menu">
                  <div className="dropdown-user-info">
                    <p className="dropdown-name">{user?.name}</p>
                    <p className="dropdown-email">{user?.email}</p>
                  </div>
                  <div className="dropdown-divider" />
                  <Link to={`/profile/${user?._id}`} className="dropdown-item" onClick={closeMenu}>
                    <FiUser /> Profile
                  </Link>
                  <Link to="/reading-list" className="dropdown-item" onClick={closeMenu}>
                    <FiBookmark /> Reading List
                  </Link>
                  <Link to="/settings" className="dropdown-item" onClick={closeMenu}>
                    <FiSettings /> Settings
                  </Link>
                  <div className="dropdown-divider" />
                  <button className="dropdown-item logout" onClick={handleLogout}>
                    <FiLogOut /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="nav-auth-btns">
              <Link to="/login" className="nav-btn-outline" onClick={closeMenu}>
                <FiLogIn /> Login
              </Link>
              <Link to="/register" className="nav-btn-primary" onClick={closeMenu}>
                <FiUserPlus /> Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Hamburger Mobile Button */}
        <button
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <span className="material-symbols-outlined">close</span> : <span className="material-symbols-outlined">menu</span>}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="mobile-menu">
          <NavLink to="/" className="mobile-nav-link" onClick={closeMenu} end>Home</NavLink>
          <NavLink to="/blog" className="mobile-nav-link" onClick={closeMenu}>Explore</NavLink>
          {isAuthenticated ? (
            <>
              <NavLink to="/create" className="mobile-nav-link" onClick={closeMenu}>Write</NavLink>
              <NavLink to="/reading-list" className="mobile-nav-link" onClick={closeMenu}>Reading List</NavLink>
              <NavLink to={`/profile/${user?._id}`} className="mobile-nav-link" onClick={closeMenu}>Profile</NavLink>
              <NavLink to="/settings" className="mobile-nav-link" onClick={closeMenu}>Settings</NavLink>
              <button className="mobile-nav-link mobile-logout" onClick={handleLogout}>
                <FiLogOut /> Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="mobile-nav-link" onClick={closeMenu}>Login</Link>
              <Link to="/register" className="mobile-nav-link" onClick={closeMenu}>Sign Up</Link>
            </>
          )}
        </div>
      )}

      {/* Search Overlay */}
      {searchOpen && (
        <div className="search-overlay">
          <div className="search-overlay-content">
            <form onSubmit={handleSearchSubmit} className="search-overlay-form">
              <span className="material-symbols-outlined search-overlay-icon">search</span>
              <input
                type="text"
                placeholder="Search BlogSphere..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-overlay-input"
                autoFocus
              />
              <button type="button" className="search-overlay-close" onClick={() => setSearchOpen(false)}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </nav>
    </>
  );
};

export default Navbar;
