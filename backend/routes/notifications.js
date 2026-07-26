const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Notification = require('../models/Notification');

// @route   GET /api/notifications
// @desc    Get current user's notifications & unread count
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const notifications = await Notification.find({ recipient: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('actor', 'name avatar headline')
      .populate('post', 'title coverImage');

    const total = await Notification.countDocuments({ recipient: req.user._id });
    const unreadCount = await Notification.countDocuments({ recipient: req.user._id, read: false });

    res.json({
      notifications,
      unreadCount,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error('Error fetching notifications:', err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// @route   PUT /api/notifications/:id/read
// @desc    Mark a single notification as read
// @access  Private
router.put('/:id/read', protect, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    if (notification.recipient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    notification.read = true;
    await notification.save();

    res.json({ message: 'Notification marked as read', notification });
  } catch (err) {
    console.error('Error updating notification:', err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// @route   PUT /api/notifications/read-all
// @desc    Mark all notifications for current user as read
// @access  Private
router.put('/read-all', protect, async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user._id, read: false },
      { $set: { read: true } }
    );

    res.json({ message: 'All notifications marked as read' });
  } catch (err) {
    console.error('Error marking all notifications read:', err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

module.exports = router;
