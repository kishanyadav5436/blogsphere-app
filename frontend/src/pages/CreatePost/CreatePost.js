import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import toast from 'react-hot-toast';
import { FiSend, FiImage, FiTag, FiArrowLeft, FiX } from 'react-icons/fi';
import './CreatePost.css';

const QUILL_MODULES = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link', 'image', 'code-block'],
    ['clean'],
  ],
};

const QUILL_FORMATS = [
  'header', 'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'link', 'image', 'code-block',
];

const CreatePost = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '', excerpt: '', coverImage: '', tags: '',
  });
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [tagList, setTagList]   = useState([]);
  const [tagInput, setTagInput] = useState('');

  const handleChange = e =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const addTag = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault();
      const tag = tagInput.trim().toLowerCase().replace(/,/g, '');
      if (!tagList.includes(tag) && tagList.length < 8) {
        setTagList(prev => [...prev, tag]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tag) => setTagList(prev => prev.filter(t => t !== tag));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim())   { toast.error('Title is required'); return; }
    if (!form.excerpt.trim()) { toast.error('Excerpt is required'); return; }
    if (!content.trim() || content === '<p><br></p>') {
      toast.error('Content is required'); return;
    }
    setLoading(true);
    try {
      const { data } = await axios.post('/api/posts', {
        ...form,
        content,
        tags: tagList,
      });
      toast.success('Post published! 🎉');
      navigate(`/blog/${data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-page">
      <div className="page-wrapper">
        <div className="create-header animate-fadeInUp">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <FiArrowLeft /> Back
          </button>
          <h1 className="create-title">
            Create a New <span className="gradient-text">Story</span>
          </h1>
          <p className="create-subtitle">Share your knowledge and ideas with the world</p>
        </div>

        <form onSubmit={handleSubmit} className="create-form glass-card animate-fadeInUp delay-1">
          {/* Title */}
          <div className="form-group">
            <label className="form-label">Post Title *</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="form-input title-input"
              placeholder="Write a compelling title..."
              maxLength={150}
            />
            <span className="char-count">{form.title.length}/150</span>
          </div>

          {/* Excerpt */}
          <div className="form-group">
            <label className="form-label">Short Excerpt *</label>
            <textarea
              name="excerpt"
              value={form.excerpt}
              onChange={handleChange}
              className="form-input"
              placeholder="Brief description of your post (shown in cards)..."
              rows={3}
              maxLength={300}
            />
            <span className="char-count">{form.excerpt.length}/300</span>
          </div>

          {/* Cover Image */}
          <div className="form-group">
            <label className="form-label">
              <FiImage style={{ marginRight: 6 }} /> Cover Image URL
            </label>
            <input
              type="url"
              name="coverImage"
              value={form.coverImage}
              onChange={handleChange}
              className="form-input"
              placeholder="https://example.com/image.jpg"
            />
            <div className="preset-covers-row" style={{ marginTop: 8, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', width: '100%' }}>Or pick a quick cover image preset:</span>
              {[
                { label: 'Quantum Tech', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80' },
                { label: 'Deep Space', url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80' },
                { label: 'Minimal Design', url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80' },
                { label: 'Cyberpunk Code', url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80' },
                { label: 'Philosophy', url: 'https://images.unsplash.com/photo-1507499739999-097706ad8914?auto=format&fit=crop&w=800&q=80' }
              ].map(p => (
                <button
                  key={p.label}
                  type="button"
                  className="tag-chip"
                  onClick={() => setForm(prev => ({ ...prev, coverImage: p.url }))}
                >
                  📷 {p.label}
                </button>
              ))}
            </div>
            {form.coverImage && (
              <div className="cover-preview">
                <img src={form.coverImage} alt="Cover preview" onError={e => { e.target.style.display='none'; }} />
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="form-group">
            <label className="form-label">
              <FiTag style={{ marginRight: 6 }} /> Tags
            </label>
            <div className="tags-input-container">
              {tagList.map(tag => (
                <span key={tag} className="tag-chip">
                  {tag}
                  <button type="button" className="tag-remove" onClick={() => removeTag(tag)}>
                    <FiX />
                  </button>
                </span>
              ))}
              {tagList.length < 8 && (
                <input
                  type="text"
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  onKeyDown={addTag}
                  className="tag-inline-input"
                  placeholder="Add tag + Enter..."
                />
              )}
            </div>
            <p className="field-hint">Press Enter or comma to add a tag (max 8)</p>
          </div>

          {/* Rich Text Editor */}
          <div className="form-group">
            <label className="form-label">Content *</label>
            <div className="editor-wrapper">
              <ReactQuill
                theme="snow"
                value={content}
                onChange={setContent}
                modules={QUILL_MODULES}
                formats={QUILL_FORMATS}
                placeholder="Write your story here..."
              />
            </div>
          </div>

          {/* Submit */}
          <div className="form-actions">
            <button type="button" className="btn-outline" onClick={() => navigate(-1)}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <span className="btn-spinner" />
                  Publishing...
                </>
              ) : (
                <><FiSend /> Publish Post</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
