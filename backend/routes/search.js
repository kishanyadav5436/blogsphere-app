const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');

// @route   GET /api/search?q=
// @desc    Unified typeahead search across posts, authors, and tags
// @access  Public
router.get('/', async (req, res) => {
  try {
    const query = req.query.q ? req.query.q.trim() : '';

    if (!query) {
      return res.json({ posts: [], authors: [], tags: [] });
    }

    const regex = new RegExp(query, 'i');

    // 1. Search posts by title, excerpt, or tags
    const posts = await Post.find({
      published: true,
      $or: [{ title: regex }, { excerpt: regex }, { tags: regex }],
    })
      .select('title excerpt coverImage tags author readTime createdAt')
      .populate('author', 'name avatar')
      .limit(6);

    // 2. Search users/authors by name or headline
    const authors = await User.find({
      $or: [{ name: regex }, { headline: regex }],
    })
      .select('name avatar headline bio')
      .limit(5);

    // 3. Search matching tags across published posts
    const allTags = await Post.distinct('tags', { published: true, tags: regex });
    const tags = allTags.filter((tag) => tag.toLowerCase().includes(query.toLowerCase())).slice(0, 8);

    res.json({
      posts,
      authors,
      tags,
    });
  } catch (err) {
    console.error('Error during search query:', err);
    res.status(500).json({ message: 'Server Error during search', error: err.message });
  }
});

module.exports = router;
