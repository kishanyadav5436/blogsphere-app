const express = require('express');
const router = express.Router();
const Follow = require('../models/Follow');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/follow/:userId
// @desc    Follow/unfollow a user (toggle)
// @access  Private
router.post('/:userId', protect, async (req, res) => {
  try {
    if (req.params.userId === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot follow yourself' });
    }

    // Verify target user exists
    const targetUser = await User.findById(req.params.userId);
    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const existing = await Follow.findOne({
      follower: req.user._id,
      following: req.params.userId,
    });

    if (existing) {
      await existing.deleteOne();
      const followersCount = await Follow.countDocuments({ following: req.params.userId });
      return res.json({ following: false, followersCount });
    }

    await Follow.create({
      follower: req.user._id,
      following: req.params.userId,
    });

    // Create notification for target user
    try {
      await Notification.create({
        recipient: req.params.userId,
        actor: req.user._id,
        type: 'follow',
      });
    } catch (notifErr) {
      console.error('Failed to create follow notification:', notifErr.message);
    }

    const followersCount = await Follow.countDocuments({ following: req.params.userId });
    res.status(201).json({ following: true, followersCount });
  } catch (err) {
    if (err.code === 11000) {
      // Already following — unfollow
      await Follow.findOneAndDelete({
        follower: req.user._id,
        following: req.params.userId,
      });
      const followersCount = await Follow.countDocuments({ following: req.params.userId });
      return res.json({ following: false, followersCount });
    }
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/follow/:userId/followers
// @desc    Get a user's followers
// @access  Public
router.get('/:userId/followers', async (req, res) => {
  try {
    const followers = await Follow.find({ following: req.params.userId })
      .populate('follower', 'name avatar headline bio')
      .sort({ createdAt: -1 });

    res.json({
      followers: followers.map((f) => f.follower),
      count: followers.length,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/follow/:userId/following
// @desc    Get who a user is following
// @access  Public
router.get('/:userId/following', async (req, res) => {
  try {
    const following = await Follow.find({ follower: req.params.userId })
      .populate('following', 'name avatar headline bio')
      .sort({ createdAt: -1 });

    res.json({
      following: following.map((f) => f.following),
      count: following.length,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/follow/check/:userId
// @desc    Check if current user follows a specific user
// @access  Private
router.get('/check/:userId', protect, async (req, res) => {
  try {
    const follow = await Follow.findOne({
      follower: req.user._id,
      following: req.params.userId,
    });
    res.json({ following: !!follow });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
