const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Follow = require('../models/Follow');
const Post = require('../models/Post');
const { protect } = require('../middleware/authMiddleware');

// Helper: generate token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    try {
      const { name, email, password, bio, headline, website, twitter } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists with this email' });
      }

      const user = await User.create({ name, email, password, bio, headline, website, twitter });

      const token = generateToken(user._id);

      res.status(201).json({
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          bio: user.bio,
          headline: user.headline,
          website: user.website,
          twitter: user.twitter,
          createdAt: user.createdAt,
        },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error during registration' });
    }
  }
);

// @route   POST /api/auth/login
// @desc    Login user and return token
// @access  Public
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const token = generateToken(user._id);

      res.json({
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          bio: user.bio,
          headline: user.headline,
          website: user.website,
          twitter: user.twitter,
          createdAt: user.createdAt,
        },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error during login' });
    }
  }
);

// @route   GET /api/auth/me
// @desc    Get current logged-in user
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      bio: user.bio,
      headline: user.headline,
      website: user.website,
      twitter: user.twitter,
      createdAt: user.createdAt,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/auth/user/:id
// @desc    Get public user profile with stats
// @access  Public
router.get('/user/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const followersCount = await Follow.countDocuments({ following: user._id });
    const followingCount = await Follow.countDocuments({ follower: user._id });
    const postsCount = await Post.countDocuments({ author: user._id, published: true });

    res.json({
      _id: user._id,
      name: user.name,
      avatar: user.avatar,
      bio: user.bio,
      headline: user.headline,
      website: user.website,
      twitter: user.twitter,
      createdAt: user.createdAt,
      followersCount,
      followingCount,
      postsCount,
    });
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, bio, avatar, headline, website, twitter } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, bio, avatar, headline, website, twitter },
      { new: true, runValidators: true }
    );
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      bio: user.bio,
      headline: user.headline,
      website: user.website,
      twitter: user.twitter,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
