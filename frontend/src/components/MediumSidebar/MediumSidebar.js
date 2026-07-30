import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';
import './MediumSidebar.css';

const DEFAULT_TOPICS = [
  'Data Science',
  'Self Improvement',
  'Writing',
  'Technology',
  'AI',
  'Design',
  'Business',
  'Coding',
  'Philosophy'
];

const MediumSidebar = ({ 
  staffPicks = [], 
  authors = [], 
  selectedTopic = 'For you', 
  onSelectTopic 
}) => {
  const [followingMap, setFollowingMap] = useState({});

  const toggleFollow = (authorId, name) => {
    setFollowingMap(prev => {
      const isFollowing = !prev[authorId];
      if (isFollowing) {
        toast.success(`Following ${name}`);
      } else {
        toast(`Unfollowed ${name}`, { icon: 'ℹ️' });
      }
      return { ...prev, [authorId]: isFollowing };
    });
  };

  return (
    <aside className="medium-sidebar">
      {/* 1. Staff Picks Section */}
      <div className="sidebar-block staff-picks-block">
        <h3 className="sidebar-title">Staff Picks</h3>
        
        <div className="staff-picks-list">
          {staffPicks.length > 0 ? (
            staffPicks.slice(0, 3).map((item) => (
              <article key={item._id} className="staff-pick-item">
                <div className="staff-pick-author">
                  <div className="author-avatar-xs">
                    {item.author?.avatar ? (
                      <img src={item.author.avatar} alt={item.author.name} />
                    ) : (
                      <span>{item.author?.name?.[0]?.toUpperCase() || 'A'}</span>
                    )}
                  </div>
                  <span className="staff-author-name">{item.author?.name || 'Editorial Team'}</span>
                </div>
                
                <Link to={`/blog/${item._id}`} className="staff-pick-title-link">
                  <h4 className="staff-pick-title">{item.title}</h4>
                </Link>

                <span className="staff-pick-date">
                  {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </article>
            ))
          ) : (
            /* Sample Staff Picks Fallbacks if DB has few items */
            <>
              <article className="staff-pick-item">
                <div className="staff-pick-author">
                  <div className="author-avatar-xs">
                    <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="Anna Saraiva" />
                  </div>
                  <span className="staff-author-name">Anna Saraiva</span>
                </div>
                <Link to="/blog" className="staff-pick-title-link">
                  <h4 className="staff-pick-title">Night(mare) at the museum</h4>
                </Link>
                <span className="staff-pick-date">Jan 20</span>
              </article>

              <article className="staff-pick-item">
                <div className="staff-pick-author">
                  <div className="author-avatar-xs">
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" alt="John Thorn" />
                  </div>
                  <span className="staff-author-name">In Our Game by John Thorn</span>
                </div>
                <Link to="/blog" className="staff-pick-title-link">
                  <h4 className="staff-pick-title">MLB & NYC: A Love Story</h4>
                </Link>
                <span className="staff-pick-date">Oct 7, 2025</span>
              </article>

              <article className="staff-pick-item">
                <div className="staff-pick-author">
                  <div className="author-avatar-xs">
                    <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&q=80" alt="Lydia Sohn" />
                  </div>
                  <span className="staff-author-name">In Human Parts by Lydia Sohn</span>
                </div>
                <Link to="/blog" className="staff-pick-title-link">
                  <h4 className="staff-pick-title">What Do 90-Somethings Regret Most?</h4>
                </Link>
                <span className="staff-pick-date">Jul 11, 2018</span>
              </article>
            </>
          )}
        </div>

        <Link to="/blog" className="sidebar-link-more">
          See the full list
        </Link>
      </div>

      {/* 2. Recommended Topics Section */}
      <div className="sidebar-block recommended-topics-block">
        <h3 className="sidebar-title">Recommended topics</h3>

        <div className="recommended-chips-grid">
          {DEFAULT_TOPICS.map((topic) => {
            const isActive = selectedTopic === topic;
            return (
              <button
                key={topic}
                className={`topic-pill-btn ${isActive ? 'active' : ''}`}
                onClick={() => onSelectTopic && onSelectTopic(topic)}
              >
                {topic} {isActive ? '' : '+'}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Who to follow Section */}
      <div className="sidebar-block who-to-follow-block">
        <h3 className="sidebar-title">Who to follow</h3>

        <div className="who-to-follow-list">
          {authors.slice(0, 3).map((author) => {
            const isFollowing = followingMap[author._id];
            return (
              <div key={author._id} className="follow-user-item">
                <Link to={`/profile/${author._id}`} className="follow-user-avatar">
                  <div className="author-avatar-sm">
                    {author.avatar ? (
                      <img src={author.avatar} alt={author.name} />
                    ) : (
                      <span>{author.name?.[0]?.toUpperCase() || 'A'}</span>
                    )}
                  </div>
                </Link>

                <div className="follow-user-info">
                  <Link to={`/profile/${author._id}`} className="follow-user-name">
                    {author.name}
                  </Link>
                  <p className="follow-user-headline">{author.headline || author.bio || 'Writer & Creator'}</p>
                </div>

                <button
                  className={`follow-btn ${isFollowing ? 'following' : ''}`}
                  onClick={() => toggleFollow(author._id, author.name)}
                >
                  {isFollowing ? (
                    <>
                      <FiCheck className="btn-icon" /> Following
                    </>
                  ) : (
                    <>
                      <FiPlus className="btn-icon" /> Follow
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Footer Links */}
      <div className="sidebar-footer-links">
        <a href="#help">Help</a>
        <a href="#status">Status</a>
        <a href="#about">About</a>
        <a href="#careers">Careers</a>
        <a href="#press">Press</a>
        <a href="#blog">Blog</a>
        <a href="#privacy">Privacy</a>
        <a href="#terms">Terms</a>
        <a href="#teams">Teams</a>
      </div>
    </aside>
  );
};

export default MediumSidebar;
