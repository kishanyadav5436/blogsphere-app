import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { FiX, FiSend, FiCornerDownRight, FiHeart, FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';
import './CommentSection.css';

const CommentSection = ({ postId, isOpen, onClose, onCommentCountChange }) => {
  const { user, isAuthenticated } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('');
  const [replyTo, setReplyTo] = useState(null); // parent comment object
  const [submitting, setSubmitting] = useState(false);

  const fetchComments = useCallback(async () => {
    if (!postId) return;
    setLoading(true);
    try {
      const { data } = await axios.get(`/api/posts/${postId}/comments`);
      setComments(data.comments || []);
      if (onCommentCountChange) onCommentCountChange(data.totalCount || 0);
    } catch {
      toast.error('Failed to load responses');
    } finally {
      setLoading(false);
    }
  }, [postId, onCommentCountChange]);

  useEffect(() => {
    if (isOpen) {
      fetchComments();
    }
  }, [isOpen, fetchComments]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please log in to leave a comment');
      return;
    }
    if (!text.trim()) return;

    setSubmitting(true);
    try {
      await axios.post(`/api/posts/${postId}/comments`, {
        content: text.trim(),
        parentComment: replyTo ? replyTo._id : null,
      });
      setText('');
      setReplyTo(null);
      toast.success(replyTo ? 'Reply posted!' : 'Response published!');
      fetchComments();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      await axios.delete(`/api/comments/${commentId}`);
      toast.success('Comment deleted');
      fetchComments();
    } catch {
      toast.error('Failed to delete comment');
    }
  };

  const handleLikeComment = async (commentId) => {
    if (!isAuthenticated) {
      toast.error('Log in to like comments');
      return;
    }
    try {
      await axios.put(`/api/comments/${commentId}/like`);
      fetchComments();
    } catch {
      toast.error('Failed to update like');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="comment-overlay" onClick={onClose}>
      <div className="comment-drawer glass-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="comment-header">
          <h3>Responses ({comments.reduce((acc, c) => acc + 1 + (c.replies?.length || 0), 0)})</h3>
          <button className="close-drawer-btn" onClick={onClose}>
            <FiX />
          </button>
        </div>

        {/* New Comment Input */}
        <div className="comment-form-container">
          {isAuthenticated ? (
            <form onSubmit={handleSubmit} className="comment-form">
              {replyTo && (
                <div className="reply-indicator">
                  <span>Replying to <strong>{replyTo.author?.name}</strong></span>
                  <button type="button" onClick={() => setReplyTo(null)}>Cancel</button>
                </div>
              )}
              <div className="input-row">
                <div className="author-avatar-sm">
                  {user?.avatar ? <img src={user.avatar} alt={user.name} /> : <span>{user?.name?.[0]?.toUpperCase()}</span>}
                </div>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={replyTo ? 'Write a reply...' : 'What are your thoughts?'}
                  rows={3}
                  className="comment-textarea"
                />
              </div>
              <div className="form-submit-row">
                <button type="submit" className="btn-primary comment-submit-btn" disabled={submitting || !text.trim()}>
                  {submitting ? 'Posting...' : <><FiSend /> Publish</>}
                </button>
              </div>
            </form>
          ) : (
            <div className="comment-login-prompt">
              <p>Join the conversation</p>
              <a href="/login" className="btn-outline">Sign In to Respond</a>
            </div>
          )}
        </div>

        {/* Comment List */}
        <div className="comment-list">
          {loading ? (
            <div className="spinner-container" style={{ minHeight: '150px' }}>
              <div className="spinner" />
            </div>
          ) : comments.length === 0 ? (
            <div className="empty-comments">
              <p>No responses yet. Be the first to share your thoughts!</p>
            </div>
          ) : (
            comments.map((comment) => {
              const isCommentLiked = user && comment.likes?.some((l) => l === user._id || l?._id === user._id);
              const isOwner = user && comment.author?._id === user._id;

              return (
                <div key={comment._id} className="comment-item">
                  <div className="comment-main">
                    <div className="comment-author-bar">
                      <div className="author-avatar-sm">
                        {comment.author?.avatar ? (
                          <img src={comment.author.avatar} alt={comment.author.name} />
                        ) : (
                          <span>{comment.author?.name?.[0]?.toUpperCase() || 'A'}</span>
                        )}
                      </div>
                      <div className="author-info">
                        <span className="author-name">{comment.author?.name || 'Anonymous'}</span>
                        {comment.author?.headline && <span className="author-headline">{comment.author.headline}</span>}
                        <span className="comment-date">{new Date(comment.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                      </div>
                    </div>

                    <p className="comment-body">{comment.content}</p>

                    <div className="comment-actions">
                      <button className={`comment-like-btn ${isCommentLiked ? 'liked' : ''}`} onClick={() => handleLikeComment(comment._id)}>
                        <FiHeart /> <span>{comment.likes?.length || 0}</span>
                      </button>

                      {isAuthenticated && (
                        <button className="reply-btn" onClick={() => setReplyTo(comment)}>
                          <FiCornerDownRight /> Reply
                        </button>
                      )}

                      {isOwner && (
                        <button className="delete-comment-btn" onClick={() => handleDelete(comment._id)}>
                          <FiTrash2 />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Replies */}
                  {comment.replies?.length > 0 && (
                    <div className="comment-replies">
                      {comment.replies.map((reply) => {
                        const isReplyLiked = user && reply.likes?.some((l) => l === user._id || l?._id === user._id);
                        const isReplyOwner = user && reply.author?._id === user._id;

                        return (
                          <div key={reply._id} className="reply-item">
                            <div className="comment-author-bar">
                              <div className="author-avatar-xs">
                                {reply.author?.avatar ? (
                                  <img src={reply.author.avatar} alt={reply.author.name} />
                                ) : (
                                  <span>{reply.author?.name?.[0]?.toUpperCase() || 'A'}</span>
                                )}
                              </div>
                              <div className="author-info">
                                <span className="author-name">{reply.author?.name}</span>
                                <span className="comment-date">{new Date(reply.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                              </div>
                            </div>
                            <p className="comment-body">{reply.content}</p>
                            <div className="comment-actions">
                              <button className={`comment-like-btn ${isReplyLiked ? 'liked' : ''}`} onClick={() => handleLikeComment(reply._id)}>
                                <FiHeart /> <span>{reply.likes?.length || 0}</span>
                              </button>
                              {isReplyOwner && (
                                <button className="delete-comment-btn" onClick={() => handleDelete(reply._id)}>
                                  <FiTrash2 />
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentSection;
