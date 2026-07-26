import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import Particle from '../../components/Particle/Particle';
import { FiUser, FiImage, FiGlobe, FiTwitter, FiSave, FiArrowLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';
import './Settings.css';

const Settings = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    headline: '',
    bio: '',
    avatar: '',
    website: '',
    twitter: '',
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        headline: user.headline || '',
        bio: user.bio || '',
        avatar: user.avatar || '',
        website: user.website || '',
        twitter: user.twitter || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error('Name is required');
      return;
    }

    setSaving(true);
    try {
      const { data } = await axios.put('/api/auth/profile', form);
      setUser((prev) => ({ ...prev, ...data }));
      toast.success('Profile updated successfully! ✨');
      navigate(`/profile/${user._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="settings-page">
      <Particle />

      <div className="page-wrapper">
        <div className="settings-header animate-fadeInUp">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <FiArrowLeft /> Back
          </button>
          <h1 className="settings-title">
            Profile <span className="gradient-text">Settings</span>
          </h1>
          <p className="settings-subtitle">Manage your public bio, social links, and avatar</p>
        </div>

        <form onSubmit={handleSubmit} className="settings-form glass-card animate-fadeInUp delay-1">
          {/* Avatar Preview & URL */}
          <div className="form-group avatar-form-group">
            <label className="form-label">Avatar Preview &amp; URL</label>
            <div className="avatar-input-row">
              <div className="avatar-preview-lg">
                {form.avatar ? (
                  <img src={form.avatar} alt="Avatar preview" onError={(e) => { e.target.style.display = 'none'; }} />
                ) : (
                  <span>{form.name?.[0]?.toUpperCase() || 'U'}</span>
                )}
              </div>
              <div className="input-with-icon flex-1">
                <FiImage className="input-icon" />
                <input
                  type="url"
                  name="avatar"
                  value={form.avatar}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>
            </div>
          </div>

          {/* Full Name */}
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <div className="input-with-icon">
              <FiUser className="input-icon" />
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="form-input"
                placeholder="John Doe"
                required
                maxLength={50}
              />
            </div>
          </div>

          {/* Short Headline */}
          <div className="form-group">
            <label className="form-label">Short Headline</label>
            <input
              type="text"
              name="headline"
              value={form.headline}
              onChange={handleChange}
              className="form-input"
              placeholder="e.g. Software Engineer | Tech Enthusiast"
              maxLength={100}
            />
            <p className="field-hint">A short line that appears next to your name on stories</p>
          </div>

          {/* Bio */}
          <div className="form-group">
            <label className="form-label">Bio</label>
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              className="form-input"
              placeholder="Tell readers about yourself..."
              rows={4}
              maxLength={200}
            />
            <span className="char-count">{form.bio.length}/200</span>
          </div>

          {/* Website & Twitter */}
          <div className="form-row">
            <div className="form-group flex-1">
              <label className="form-label">Website URL</label>
              <div className="input-with-icon">
                <FiGlobe className="input-icon" />
                <input
                  type="url"
                  name="website"
                  value={form.website}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>

            <div className="form-group flex-1">
              <label className="form-label">Twitter / X URL</label>
              <div className="input-with-icon">
                <FiTwitter className="input-icon" />
                <input
                  type="url"
                  name="twitter"
                  value={form.twitter}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="https://twitter.com/username"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="form-actions">
            <button type="button" className="btn-outline" onClick={() => navigate(-1)}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Saving...' : <><FiSave /> Save Changes</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
