import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiMail, FiLock, FiLogIn, FiArrowLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter email and password');
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back! 👋');
      navigate('/blog');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="page-wrapper">
        <div className="auth-header animate-fadeInUp">
          <button className="back-btn" onClick={() => navigate('/')}>
            <FiArrowLeft /> Home
          </button>
          <h1 className="auth-title">
            Welcome <span className="gradient-text">Back</span>
          </h1>
          <p className="auth-subtitle">Sign in to your account to write and manage posts</p>
        </div>

        <div className="auth-card glass-card animate-fadeInUp delay-1">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-with-icon">
                <FiMail className="input-icon" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-with-icon">
                <FiLock className="input-icon" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn-primary auth-btn" disabled={loading}>
              {loading ? (
                <>
                  <span className="btn-spinner" />
                  Signing In...
                </>
              ) : (
                <>
                  <FiLogIn /> Sign In
                </>
              )}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Don't have an account?{' '}
              <Link to="/register" className="auth-link">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
