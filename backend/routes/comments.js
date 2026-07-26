const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const Post = require('../models/Post');
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/posts/:postId/comments
// @desc    Get all comments for a post (with replies)
// @access  Public
router.get('/posts/:postId/comments', async (req, res) => {
  try {
    // Get top-level comments
    const comments = await Comment.find({
      post: req.params.postId,
      parentComment: null,
    })
      .populate('author', 'name avatar headline')
      .sort({ createdAt: -1 });

    // Get all replies for these comments
    const commentIds = comments.map((c) => c._id);
    const replies = await Comment.find({
      parentComment: { $in: commentIds },
    })
      .populate('author', 'name avatar headline')
      .sort({ createdAt: 1 });

    // Attach replies to their parent comments
    const commentsWithReplies = comments.map((comment) => {
      const commentObj = comment.toJSON();
      commentObj.replies = replies.filter(
        (r) => r.parentComment.toString() === comment._id.toString()
      );
      return commentObj;
    });

    // Total count
    const totalCount = await Comment.countDocuments({ post: req.params.postId });

    res.json({ comments: commentsWithReplies, totalCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/posts/:postId/comments
// @desc    Create a comment on a post
// @access  Private
router.post('/posts/:postId/comments', protect, async (req, res) => {
  try {
    const { content, parentComment } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'Comment content is required' });
    }

    // Verify post exists
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // If replying, verify parent comment exists and belongs to same post
    if (parentComment) {
      const parent = await Comment.findById(parentComment);
      if (!parent || parent.post.toString() !== req.params.postId) {
        return res.status(400).json({ message: 'Invalid parent comment' });
      }
      // Prevent nested replies (only 1 level deep)
      if (parent.parentComment) {
        return res.status(400).json({ message: 'Cannot reply to a reply' });
      }
    }

    const comment = await Comment.create({
      post: req.params.postId,
      author: req.user._id,
      content: content.trim(),
      parentComment: parentComment || null,
    });

    await comment.populate('author', 'name avatar headline');
    res.status(201).json(comment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/comments/:id
// @desc    Edit own comment
// @access  Private
router.put('/comments/:id', protect, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { content } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'Comment content is required' });
    }

    comment.content = content.trim();
    await comment.save();
    await comment.populate('author', 'name avatar headline');

    res.json(comment);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/comments/:id
// @desc    Delete own comment
// @access  Private
router.delete('/comments/:id', protect, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Also delete replies if this is a top-level comment
    if (!comment.parentComment) {
      await Comment.deleteMany({ parentComment: comment._id });
    }

    await comment.deleteOne();
    res.json({ message: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/comments/:id/like
// @desc    Like/unlike a comment
// @access  Private
router.put('/comments/:id/like', protect, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    const likedIndex = comment.likes.findIndex(
      (id) => id.toString() === req.user._id.toString()
    );

    if (likedIndex === -1) {
      comment.likes.push(req.user._id);
    } else {
      comment.likes.splice(likedIndex, 1);
    }

    await comment.save();
    res.json({ likes: comment.likes, likesCount: comment.likes.length });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
