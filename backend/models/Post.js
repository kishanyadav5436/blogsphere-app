const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    excerpt: {
      type: String,
      required: [true, 'Excerpt is required'],
      maxlength: [300, 'Excerpt cannot exceed 300 characters'],
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    coverImage: {
      type: String,
      default: '',
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    // Medium-style claps: Map of userId -> clapCount (each user can give 1-50 claps)
    claps: {
      type: Map,
      of: Number,
      default: {},
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    readTime: {
      type: Number,
      default: 1,
    },
    published: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Auto-calculate read time before saving
PostSchema.pre('save', function (next) {
  const wordsPerMinute = 200;
  const wordCount = this.content.replace(/<[^>]*>/g, '').split(/\s+/).length;
  this.readTime = Math.ceil(wordCount / wordsPerMinute) || 1;
  next();
});

// Virtual for total claps count
PostSchema.virtual('totalClaps').get(function () {
  if (!this.claps) return 0;
  let total = 0;
  for (const count of this.claps.values()) {
    total += count;
  }
  return total;
});

// Virtual for unique clappers count
PostSchema.virtual('clappersCount').get(function () {
  if (!this.claps) return 0;
  return this.claps.size;
});

PostSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Post', PostSchema);
