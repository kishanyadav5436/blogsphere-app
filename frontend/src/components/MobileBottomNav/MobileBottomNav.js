import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiHome, FiBookOpen, FiPlusCircle, FiBookmark, FiUser } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import './MobileBottomNav.css';

const MobileBottomNav = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <nav className="mobile-bottom-nav">
      <NavLink to="/" end className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}>
        <FiHome className="mobile-nav-icon" />
        <span>Home</span>
      </NavLink>

      <NavLink to="/blog" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}>
        <FiBookOpen className="mobile-nav-icon" />
        <span>Explore</span>
      </NavLink>

      {isAuthenticated ? (
        <>
          <NavLink to="/create" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}>
            <FiPlusCircle className="mobile-nav-icon" style={{ color: 'var(--accent-primary)' }} />
            <span>Write</span>
          </NavLink>

          <NavLink to="/reading-list" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}>
            <FiBookmark className="mobile-nav-icon" />
            <span>Saved</span>
          </NavLink>

          <NavLink to={`/profile/${user?._id}`} className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}>
            <FiUser className="mobile-nav-icon" />
            <span>Profile</span>
          </NavLink>
        </>
      ) : (
        <NavLink to="/login" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}>
          <FiUser className="mobile-nav-icon" />
          <span>Sign In</span>
        </NavLink>
      )}
    </nav>
  );
};

export default MobileBottomNav;
