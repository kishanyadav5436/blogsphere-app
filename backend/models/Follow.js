const mongoose = require('mongoose');

const FollowSchema = new mongoose.Schema(
  {
    follower: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    following: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

// Prevent duplicate follows
FollowSchema.index({ follower: 1, following: 1 }, { unique: true });
// Efficient lookup of followers/following lists
FollowSchema.index({ following: 1 });
FollowSchema.index({ follower: 1 });

module.exports = mongoose.model('Follow', FollowSchema);
