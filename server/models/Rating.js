const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  songId: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  songName: {
    type: String,
    required: true
  },
  artistName: {
    type: String,
    required: true
  },
  albumImage: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Create a compound index to ensure unique ratings per user and song
ratingSchema.index({ userId: 1, songId: 1 }, { unique: true });

const Rating = mongoose.model('Rating', ratingSchema);

module.exports = Rating; 