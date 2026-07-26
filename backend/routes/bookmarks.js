const express = require('express');
const router = express.Router();
const Bookmark = require('../models/Bookmark');
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/bookmarks
// @desc    Get user's reading list (bookmarked posts)
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ user: req.user._id })
      .populate({
        path: 'post',
        populate: { path: 'author', select: 'name avatar headline' },
      })
      .sort({ createdAt: -1 });

    // Filter out bookmarks where the post has been deleted
    const validBookmarks = bookmarks.filter((b) => b.post !== null);
    const posts = validBookmarks.map((b) => ({
      ...b.post.toJSON(),
      bookmarkedAt: b.createdAt,
      bookmarkId: b._id,
    }));

    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/bookmarks/:postId
// @desc    Toggle bookmark on/off for a post
// @access  Private
router.post('/:postId', protect, async (req, res) => {
  try {
    const existing = await Bookmark.findOne({
      user: req.user._id,
      post: req.params.postId,
    });

    if (existing) {
      await existing.deleteOne();
      return res.json({ bookmarked: false, message: 'Bookmark removed' });
    }

    await Bookmark.create({
      user: req.user._id,
      post: req.params.postId,
    });

    res.status(201).json({ bookmarked: true, message: 'Post bookmarked' });
  } catch (err) {
    if (err.code === 11000) {
      // Duplicate key — already bookmarked, remove it
      await Bookmark.findOneAndDelete({
        user: req.user._id,
        post: req.params.postId,
      });
      return res.json({ bookmarked: false, message: 'Bookmark removed' });
    }
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/bookmarks/check/:postId
// @desc    Check if current user has bookmarked a specific post
// @access  Private
router.get('/check/:postId', protect, async (req, res) => {
  try {
    const bookmark = await Bookmark.findOne({
      user: req.user._id,
      post: req.params.postId,
    });
    res.json({ bookmarked: !!bookmark });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
