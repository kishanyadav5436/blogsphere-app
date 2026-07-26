import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import BlogCard from '../../components/BlogCard/BlogCard';
import Particle from '../../components/Particle/Particle';
import { useAuth } from '../../context/AuthContext';
import { FiUserCheck, FiUserPlus, FiGlobe, FiTwitter, FiBookOpen, FiUsers } from 'react-icons/fi';
import toast from 'react-hot-toast';
import './Profile.css';

const Profile = () => {
  const { id } = useParams();
  const { user: currentUser, isAuthenticated } = useAuth();

  const [author, setAuthor] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [activeTab, setActiveTab] = useState('posts');

  const isOwnProfile = currentUser && currentUser._id === id;

  useEffect(() => {
    const fetchAuthorData = async () => {
      setLoading(true);
      try {
        // Fetch user profile stats
        const { data: userData } = await axios.get(`/api/auth/user/${id}`);
        setAuthor(userData);
        setFollowersCount(userData.followersCount || 0);

        // Check if current user is following this author
        if (isAuthenticated && !isOwnProfile) {
          const { data: followCheck } = await axios.get(`/api/follow/check/${id}`);
          setFollowing(followCheck.following);
        }

        // Fetch author's posts
        const { data: postsData } = await axios.get(`/api/posts/author/${id}`);
        setPosts(postsData.posts || []);
      } catch {
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchAuthorData();
  }, [id, isAuthenticated, isOwnProfile]);

  const handleFollowToggle = async () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to follow authors');
      return;
    }

    try {
      const { data } = await axios.post(`/api/follow/${id}`);
      setFollowing(data.following);
      setFollowersCount(data.followersCount);
      toast.success(data.following ? `Following ${author.name}` : `Unfollowed ${author.name}`);
    } catch {
      toast.error('Failed to update follow state');
    }
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="spinner-container" style={{ minHeight: '80vh' }}>
          <div className="spinner" />
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!author) {
    return (
      <div className="profile-page">
        <div className="empty-state">
          <h3>User not found</h3>
          <Link to="/" className="btn-outline">Return Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <Particle />

      <div className="page-wrapper">
        {/* Profile Banner / Header */}
        <div className="profile-header glass-card animate-fadeInUp">
          <div className="profile-main-info">
            <div className="profile-avatar">
              {author.avatar ? (
                <img src={author.avatar} alt={author.name} />
              ) : (
                <span>{author.name?.[0]?.toUpperCase() || 'A'}</span>
              )}
            </div>

            <div className="profile-details">
              <h1 className="profile-name">{author.name}</h1>
              {author.headline && <p className="profile-headline">{author.headline}</p>}
              {author.bio && <p className="profile-bio">{author.bio}</p>}

              {/* Social Links */}
              <div className="profile-socials">
                {author.website && (
                  <a href={author.website} target="_blank" rel="noreferrer" className="social-chip">
                    <FiGlobe /> Website
                  </a>
                )}
                {author.twitter && (
                  <a href={author.twitter} target="_blank" rel="noreferrer" className="social-chip">
                    <FiTwitter /> Twitter
                  </a>
                )}
              </div>

              {/* Follow Stats */}
              <div className="profile-stats-row">
                <span className="stat-item">
                  <FiUsers className="stat-icon" /> <strong>{followersCount}</strong> Followers
                </span>
                <span className="stat-item">
                  <FiUsers className="stat-icon" /> <strong>{author.followingCount || 0}</strong> Following
                </span>
                <span className="stat-item">
                  <FiBookOpen className="stat-icon" /> <strong>{posts.length}</strong> Stories
                </span>
              </div>
            </div>
          </div>

          {/* Action button */}
          <div className="profile-actions">
            {isOwnProfile ? (
              <Link to="/settings" className="btn-outline">Edit Profile</Link>
            ) : (
              <button
                className={`btn-primary ${following ? 'btn-following' : ''}`}
                onClick={handleFollowToggle}
              >
                {following ? (
                  <><FiUserCheck /> Following</>
                ) : (
                  <><FiUserPlus /> Follow</>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="profile-tabs animate-fadeInUp delay-1">
          <button
            className={`tab-btn ${activeTab === 'posts' ? 'active' : ''}`}
            onClick={() => setActiveTab('posts')}
          >
            Published Stories ({posts.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'about' ? 'active' : ''}`}
            onClick={() => setActiveTab('about')}
          >
            About
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'posts' ? (
          posts.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📝</div>
              <h3>No stories published yet</h3>
            </div>
          ) : (
            <div className="posts-grid animate-fadeInUp delay-2">
              {posts.map((post, idx) => (
                <BlogCard key={post._id} post={post} index={idx} />
              ))}
            </div>
          )
        ) : (
          <div className="about-card glass-card animate-fadeInUp delay-2">
            <h3>About {author.name}</h3>
            <p>{author.bio || 'No bio provided yet.'}</p>
            <div className="about-meta">
              <p>Member since {new Date(author.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
