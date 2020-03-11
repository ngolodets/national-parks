const mongoose = require('mongoose');

const parkSchema = new mongoose.Schema({
  name: String,
  state: String,
  coordinates: String,
  code: String,
  comments: String,
  isFave: Boolean,
  // trips: [{
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Trip'
  // }]
  trip: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Park'
  }
});

module.exports = mongoose.model('Park', parkSchema);
