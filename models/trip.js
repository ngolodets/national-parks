const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  name: String,
  state: String,
  campground: String,
  event: String,
  user: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User'
  },
  parks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Park'
  }],
  isFave: Boolean,
  comments: String
});

module.exports = mongoose.model('Trip', tripSchema);