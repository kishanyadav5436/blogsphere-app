import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import Particle from '../../components/Particle/Particle';
import FloatingToolbar from '../../components/FloatingToolbar/FloatingToolbar';
import CommentSection from '../../components/CommentSection/CommentSection';
import BlogCard from '../../components/BlogCard/BlogCard';
import AudioReader from '../../components/AudioReader/AudioReader';
import { FiClock, FiCalendar, FiArrowLeft, FiEdit3, FiTrash2, FiTag, FiUserCheck, FiUserPlus, FiEye } from 'react-icons/fi';
import toast from 'react-hot-toast';
import './BlogDetail.css';

const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [post, setPost]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState(false);
  const [moreFromAuthor, setMoreFromAuthor] = useState([]);
  const [commentDrawerOpen, setCommentDrawerOpen] = useState(false);
  const [commentCount, setCommentCount] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Track Reading Scroll Progress Bar
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Increment view count on mount
  useEffect(() => {
    if (id) {
      axios.put(`/api/posts/${id}/view`).catch(() => {});
    }
  }, [id]);

  // Fetch post details & author posts
  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`/api/posts/${id}`);
        setPost(data);

        // Fetch follow status if logged in and not author
        if (user && data.author?._id && data.author._id !== user._id) {
          axios.get(`/api/follow/check/${data.author._id}`)
            .then(({ data: fData }) => setFollowing(fData.following))
            .catch(() => {});
        }

        // Fetch more stories by same author
        if (data.author?._id) {
          axios.get(`/api/posts/author/${data.author._id}?limit=3`)
            .then(({ data: aData }) => {
              const filtered = (aData.posts || []).filter(p => p._id !== id);
              setMoreFromAuthor(filtered.slice(0, 3));
            })
            .catch(() => {});
        }

        // Fetch comment count for floating toolbar
        axios.get(`/api/posts/${id}/comments`)
          .then(({ data: cData }) => setCommentCount(cData.totalCount || 0))
          .catch(() => {});
      } catch {
        toast.error('Story not found');
        navigate('/blog');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id, user, navigate]);

  const handleFollowToggle = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in to follow authors');
      return;
    }
    if (!post?.author?._id) return;

    try {
      const { data } = await axios.post(`/api/follow/${post.author._id}`);
      setFollowing(data.following);
      toast.success(data.following ? `Following ${post.author.name}` : `Unfollowed ${post.author.name}`);
    } catch {
      toast.error('Failed to update follow state');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this story?')) return;
    try {
      await axios.delete(`/api/posts/${id}`);
      toast.success('Story deleted');
      navigate('/blog');
    } catch {
      toast.error('Failed to delete story');
    }
  };

  const isOwner = user && post && post.author?._id === user._id;

  if (loading) return (
    <div className="detail-page">
      <div className="spinner-container" style={{ minHeight: '80vh' }}>
        <div className="spinner" />
        <p>Loading story...</p>
      </div>
    </div>
  );

  if (!post) return null;

  return (
    <div className="detail-page">
      <Particle />

      {/* Reading Progress Line */}
      <div className="reading-progress-bar" style={{ width: `${scrollProgress}%` }} />

      {/* Back & Owner Action Row */}
      <div className="detail-back page-wrapper">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <FiArrowLeft /> Back
        </button>
        {isOwner && (
          <div className="owner-actions">
            <Link to={`/edit/${post._id}`} className="btn-outline" style={{ padding: '8px 18px', fontSize: '0.85rem' }}>
              <FiEdit3 /> Edit
            </Link>
            <button className="btn-danger" onClick={handleDelete} style={{ padding: '8px 18px', fontSize: '0.85rem' }}>
              <FiTrash2 /> Delete
            </button>
          </div>
        )}
      </div>

      {/* Hero Cover */}
      {post.coverImage && (
        <div className="detail-cover animate-fadeIn">
          <img src={post.coverImage} alt={post.title} />
          <div className="cover-overlay" />
        </div>
      )}

      {/* Main Article Container */}
      <div className="page-wrapper">
        <article className="detail-article glass-card animate-fadeInUp">
          {/* Tags */}
          {post.tags?.length > 0 && (
            <div className="detail-tags">
              {post.tags.map(tag => (
                <Link to={`/blog?tag=${encodeURIComponent(tag)}`} key={tag} className="tag-chip">
                  <FiTag style={{ marginRight: 4, fontSize: '0.7rem' }} />{tag}
                </Link>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="detail-title">{post.title}</h1>

          {/* Excerpt Subtitle */}
          {post.excerpt && <p className="detail-excerpt">{post.excerpt}</p>}

          {/* Author Header Bar */}
          <div className="detail-meta">
            <div className="detail-author">
              <Link to={`/profile/${post.author?._id}`}>
                <div className="author-avatar-lg">
                  {post.author?.avatar
                    ? <img src={post.author.avatar} alt={post.author.name} />
                    : <span>{post.author?.name?.[0]?.toUpperCase() || 'A'}</span>
                  }
                </div>
              </Link>
              <div>
                <div className="author-name-row">
                  <Link to={`/profile/${post.author?._id}`} className="author-name-lg">
                    {post.author?.name || 'Anonymous'}
                  </Link>
                  {!isOwner && (
                    <button
                      className={`btn-follow-sm ${following ? 'following' : ''}`}
                      onClick={handleFollowToggle}
                    >
                      {following ? <><FiUserCheck /> Following</> : <><FiUserPlus /> Follow</>}
                    </button>
                  )}
                </div>
                {post.author?.headline && <p className="author-bio-sm">{post.author.headline}</p>}
              </div>
            </div>

            <div className="detail-meta-right">
              <span className="meta-item"><FiCalendar /> {formatDate(post.createdAt)}</span>
              <span className="meta-item"><FiClock /> {post.readTime} min read</span>
              <span className="meta-item"><FiEye /> {post.viewCount || 1} views</span>
            </div>
          </div>

          <div className="detail-divider" />

          {/* Audio Speech Synthesis Reader */}
          <AudioReader title={post.title} content={post.content} />

          {/* Article Body (Medium Serif Reading Typography) */}
          <div
            className="detail-content article-serif-body"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className="detail-divider" />
        </article>

        {/* More from Author Section */}
        {moreFromAuthor.length > 0 && (
          <section className="more-author-section animate-fadeInUp">
            <h3 className="more-author-title">
              More from <span className="gradient-text">{post.author?.name}</span>
            </h3>
            <div className="posts-grid">
              {moreFromAuthor.map((p, idx) => (
                <BlogCard key={p._id} post={p} index={idx} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Medium-style Floating Bottom Toolbar */}
      <FloatingToolbar
        post={post}
        onOpenComments={() => setCommentDrawerOpen(true)}
        commentCount={commentCount}
      />

      {/* Slide-out Comment Drawer */}
      <CommentSection
        postId={post._id}
        isOpen={commentDrawerOpen}
        onClose={() => setCommentDrawerOpen(false)}
        onCommentCountChange={(count) => setCommentCount(count)}
      />
    </div>
  );
};

export default BlogDetail;
