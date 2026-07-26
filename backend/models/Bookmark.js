const mongoose = require('mongoose');

const BookmarkSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
  },
  { timestamps: true }
);

// Prevent duplicate bookmarks
BookmarkSchema.index({ user: 1, post: 1 }, { unique: true });
// Efficient lookup of user's reading list
BookmarkSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Bookmark', BookmarkSchema);
