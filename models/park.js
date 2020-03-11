const mongoose = require('mongoose');

const parkSchema = new mongoose.Schema({
  name: String,
  state: String,
  coordinates: String,
  code: String,
  comments: String,
  isFave: Boolean,
  user: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User'
  },
  trip: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip'
  }
});

module.exports = mongoose.model('Park', parkSchema);
