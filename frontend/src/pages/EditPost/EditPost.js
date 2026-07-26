import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import toast from 'react-hot-toast';
import { FiSave, FiImage, FiTag, FiArrowLeft, FiX } from 'react-icons/fi';
import '../CreatePost/CreatePost.css';

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

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', excerpt: '', coverImage: '' });
  const [content, setContent] = useState('');
  const [tagList, setTagList] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await axios.get(`/api/posts/${id}`);
        setForm({
          title: data.title || '',
          excerpt: data.excerpt || '',
          coverImage: data.coverImage || '',
        });
        setContent(data.content || '');
        setTagList(data.tags || []);
      } catch (err) {
        toast.error('Failed to load post for editing');
        navigate('/blog');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id, navigate]);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const addTag = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault();
      const tag = tagInput.trim().toLowerCase().replace(/,/g, '');
      if (!tagList.includes(tag) && tagList.length < 8) {
        setTagList((prev) => [...prev, tag]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tag) => setTagList((prev) => prev.filter((t) => t !== tag));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { toast.error('Title is required'); return; }
    if (!form.excerpt.trim()) { toast.error('Excerpt is required'); return; }
    if (!content.trim() || content === '<p><br></p>') {
      toast.error('Content is required'); return;
    }
    setSaving(true);
    try {
      await axios.put(`/api/posts/${id}`, {
        ...form,
        content,
        tags: tagList,
      });
      toast.success('Post updated successfully! ✨');
      navigate(`/blog/${id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update post');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="create-page">
        <div className="spinner-container" style={{ minHeight: '80vh' }}>
          <div className="spinner" />
          <p>Loading post data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="create-page">
      <div className="page-wrapper">
        <div className="create-header animate-fadeInUp">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <FiArrowLeft /> Back
          </button>
          <h1 className="create-title">
            Edit Your <span className="gradient-text">Story</span>
          </h1>
          <p className="create-subtitle">Make updates and refine your published post</p>
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
              placeholder="Brief description of your post..."
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
            {form.coverImage && (
              <div className="cover-preview">
                <img src={form.coverImage} alt="Cover preview" onError={(e) => { e.target.style.display = 'none'; }} />
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="form-group">
            <label className="form-label">
              <FiTag style={{ marginRight: 6 }} /> Tags
            </label>
            <div className="tags-input-container">
              {tagList.map((tag) => (
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
                  onChange={(e) => setTagInput(e.target.value)}
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
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? (
                <>
                  <span className="btn-spinner" />
                  Saving...
                </>
              ) : (
                <><FiSave /> Save Changes</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPost;
