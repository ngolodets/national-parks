const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  state: String,
  campground: String,
  event: String,
  parks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Park'
  }],
  isFave: Boolean
});

module.exports = mongoose.model('Trip', tripSchema);