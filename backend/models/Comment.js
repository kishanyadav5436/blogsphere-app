const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
      index: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: [true, 'Comment content is required'],
      trim: true,
      maxlength: [2000, 'Comment cannot exceed 2000 characters'],
    },
    parentComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
      default: null,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true }
);

// Index for efficient queries
CommentSchema.index({ post: 1, createdAt: -1 });
CommentSchema.index({ parentComment: 1 });

// Virtual for likes count
CommentSchema.virtual('likesCount').get(function () {
  return this.likes.length;
});

CommentSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Comment', CommentSchema);
