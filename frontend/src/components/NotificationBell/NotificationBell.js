import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FiBell, FiHeart, FiMessageSquare, FiUserPlus } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import './NotificationBell.css';

const NotificationBell = () => {
  const { isAuthenticated, token } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated || !token) return;
    try {
      setLoading(true);
      const res = await axios.get('/api/notifications', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(res.data.notifications || []);
      setUnreadCount(res.data.unreadCount || 0);
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, token]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
      // Poll every 30s as fallback
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, fetchNotifications]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await axios.put(
        '/api/notifications/read-all',
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error('Failed to mark notifications read', err);
    }
  };

  const handleNotificationClick = async (notif) => {
    if (!notif.read) {
      try {
        await axios.put(
          `/api/notifications/${notif._id}/read`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
        setNotifications((prev) =>
          prev.map((n) => (n._id === notif._id ? { ...n, read: true } : n))
        );
      } catch (err) {
        console.error('Failed to mark notification read', err);
      }
    }
    setOpen(false);
  };

  if (!isAuthenticated) return null;

  const getTypeIcon = (type) => {
    switch (type) {
      case 'clap':
        return <FiHeart style={{ color: '#c770f0' }} />;
      case 'comment':
      case 'reply':
        return <FiMessageSquare style={{ color: '#4facfe' }} />;
      case 'follow':
        return <FiUserPlus style={{ color: '#00f2fe' }} />;
      default:
        return <FiBell style={{ color: '#c770f0' }} />;
    }
  };

  const getNotificationText = (notif) => {
    const name = notif.actor ? notif.actor.name : 'Someone';
    switch (notif.type) {
      case 'clap':
        return <span><strong>{name}</strong> clapped for your story</span>;
      case 'comment':
        return <span><strong>{name}</strong> commented on your story</span>;
      case 'reply':
        return <span><strong>{name}</strong> replied to your comment</span>;
      case 'follow':
        return <span><strong>{name}</strong> started following you</span>;
      default:
        return <span><strong>{name}</strong> interacted with your profile</span>;
    }
  };

  return (
    <div className="notification-bell-container" ref={dropdownRef}>
      <button
        className="bell-btn"
        onClick={() => setOpen(!open)}
        title="Notifications"
        aria-label="Notifications"
      >
        <FiBell size={18} />
        {unreadCount > 0 && <span className="unread-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>}
      </button>

      {open && (
        <div className="notifications-dropdown">
          <div className="notif-header">
            <h4>Notifications</h4>
            {unreadCount > 0 && (
              <button className="mark-read-btn" onClick={handleMarkAllRead}>
                Mark all as read
              </button>
            )}
          </div>

          <div className="notif-list">
            {loading && notifications.length === 0 ? (
              <div className="notif-empty">Loading notifications...</div>
            ) : notifications.length === 0 ? (
              <div className="notif-empty">No notifications yet</div>
            ) : (
              notifications.map((notif) => (
                <Link
                  key={notif._id}
                  to={
                    notif.post
                      ? `/blog/${notif.post._id || notif.post}`
                      : `/profile/${notif.actor?._id}`
                  }
                  className={`notif-item ${!notif.read ? 'unread' : ''}`}
                  onClick={() => handleNotificationClick(notif)}
                >
                  {notif.actor?.avatar ? (
                    <img src={notif.actor.avatar} alt={notif.actor.name} className="notif-avatar" />
                  ) : (
                    <div className="notif-avatar-fallback">
                      {notif.actor?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )}

                  <div className="notif-content">
                    <div className="notif-text">{getNotificationText(notif)}</div>
                    {notif.post?.title && (
                      <div className="notif-post-title">{notif.post.title}</div>
                    )}
                    <div className="notif-time">
                      {new Date(notif.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>

                  <div className="notif-type-icon">{getTypeIcon(notif.type)}</div>
                </Link>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
