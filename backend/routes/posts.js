const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Post = require('../models/Post');
const Follow = require('../models/Follow');
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/posts/trending
// @desc    Get trending posts (sorted by total claps + recent views)
// @access  Public
router.get('/trending', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6;
    const posts = await Post.find({ published: true })
      .populate('author', 'name avatar headline')
      .sort({ viewCount: -1, createdAt: -1 })
      .limit(limit);

    // Sort by total claps (computed from the Map)
    const postsWithClaps = posts
      .map((p) => {
        const pObj = p.toJSON();
        return pObj;
      })
      .sort((a, b) => (b.totalClaps || 0) - (a.totalClaps || 0));

    res.json(postsWithClaps);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/posts/feed
// @desc    Get personalized feed (posts from followed authors)
// @access  Private
router.get('/feed', protect, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;

    // Get users the current user follows
    const following = await Follow.find({ follower: req.user._id }).select('following');
    const followingIds = following.map((f) => f.following);

    if (followingIds.length === 0) {
      return res.json({ posts: [], pagination: { total: 0, page, pages: 0, limit } });
    }

    const query = { published: true, author: { $in: followingIds } };
    const total = await Post.countDocuments(query);
    const posts = await Post.find(query)
      .populate('author', 'name avatar headline')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      posts,
      pagination: { total, page, pages: Math.ceil(total / limit), limit },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/posts/tag/:tag
// @desc    Get posts filtered by a specific tag
// @access  Public
router.get('/tag/:tag', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;

    const query = { published: true, tags: { $in: [req.params.tag] } };
    const total = await Post.countDocuments(query);
    const posts = await Post.find(query)
      .populate('author', 'name avatar headline')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      posts,
      pagination: { total, page, pages: Math.ceil(total / limit), limit },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/posts/user/my-posts
// @desc    Get all posts by the logged-in user
// @access  Private
router.get('/user/my-posts', protect, async (req, res) => {
  try {
    const posts = await Post.find({ author: req.user._id })
      .populate('author', 'name avatar headline')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/posts
// @desc    Get all published posts (with pagination & search/tag filter)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const tag = req.query.tag;
    const search = req.query.search;

    const query = { published: true };
    if (tag) query.tags = { $in: [tag] };
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    const total = await Post.countDocuments(query);
    const posts = await Post.find(query)
      .populate('author', 'name avatar headline')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      posts,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/posts/:id
// @desc    Get single post by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'name avatar bio headline email');
    if (!post || !post.published) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json(post);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/posts
// @desc    Create a new post
// @access  Private
router.post(
  '/',
  protect,
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('excerpt').trim().notEmpty().withMessage('Excerpt is required'),
    body('content').notEmpty().withMessage('Content is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    try {
      const { title, excerpt, content, coverImage, tags, published } = req.body;

      const post = await Post.create({
        title,
        excerpt,
        content,
        coverImage: coverImage || '',
        tags: tags || [],
        author: req.user._id,
        published: published !== undefined ? published : true,
      });

      await post.populate('author', 'name avatar headline');
      res.status(201).json(post);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error while creating post' });
    }
  }
);

// @route   PUT /api/posts/:id
// @desc    Update a post (owner only)
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this post' });
    }

    const { title, excerpt, content, coverImage, tags, published } = req.body;
    if (title) post.title = title;
    if (excerpt) post.excerpt = excerpt;
    if (content) post.content = content;
    if (coverImage !== undefined) post.coverImage = coverImage;
    if (tags) post.tags = tags;
    if (published !== undefined) post.published = published;

    await post.save();
    await post.populate('author', 'name avatar headline');
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/posts/:id
// @desc    Delete a post (owner only)
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    await post.deleteOne();
    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/posts/:id/clap
// @desc    Clap on a post (Medium-style, 1-50 claps per user)
// @access  Private
router.put('/:id/clap', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const userId = req.user._id.toString();
    const currentClaps = post.claps.get(userId) || 0;
    const addClaps = Math.min(req.body.count || 1, 50 - currentClaps);

    if (addClaps > 0) {
      post.claps.set(userId, currentClaps + addClaps);
      await post.save();
    }

    // Compute total
    let totalClaps = 0;
    for (const count of post.claps.values()) {
      totalClaps += count;
    }

    res.json({
      totalClaps,
      userClaps: post.claps.get(userId) || 0,
      clappersCount: post.claps.size,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/posts/:id/view
// @desc    Increment view count
// @access  Public
router.put('/:id/view', async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { $inc: { viewCount: 1 } },
      { new: true }
    );
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json({ viewCount: post.viewCount });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/posts/author/:authorId
// @desc    Get posts by a specific author
// @access  Public
router.get('/author/:authorId', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const query = { published: true, author: req.params.authorId };
    const total = await Post.countDocuments(query);
    const posts = await Post.find(query)
      .populate('author', 'name avatar headline')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      posts,
      pagination: { total, page, pages: Math.ceil(total / limit), limit },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
