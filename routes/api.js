const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Trip = require('../models/trip');
const Park = require('../models/park');

//Testring /api/ route - WORKS
router.get('/', (req, res) => {
  res.json({type: 'success', message: "You accessed the protected api routes"})
});

//GET /api/trips --> show all user's trips - WORKS
router.get('/trips', (req, res) => {
  User.findById(req.user._id)
    .populate('trips')
      .exec((err, user) => {
        if (err) res.json(err);
        res.json(user);
  });
});

//GET /api/trips/:tripid --> show selected trip - WORKS
router.get('/trips/:tripid', (req, res) => {
  Trip.findById(req.params.tripid, (err, trip) => {
    if (err) res.json(err);
    res.json(trip);
  });
});

//POST /api/trips --> add a trip to user's list - WORKS
router.post('/trips', (req, res) => {
  User.findById(req.user._id, (err, user) => {
    Trip.create({
      state: req.body.state,
      campground: req.body.campground,
      event: req.body.event,
      parks: req.body.parks,
      user: req.params._id
    },
    (err, trip) => {
      if (err) res.json(err);
      user.trips.push(trip);
      user.save((err, user) => {
        if (err) res.json(err);
        res.json(user);
      })
    })
  })
});

//PUT /api/trips/:tripid --> update trip - WORKS
router.put('/trips/:tripid', (req, res) => {
  User.findById(
    req.user._id,
    (err, user) => {
      Trip.findByIdAndUpdate(
        req.params.tripid,
        {
          comments: req.body.comments
        },
        {new: true},
        (err, trip) => {
          if (err) res.json(err)
          res.json(trip)
        }
      )
    }
  )
});

//DELETE /api/trips/:tripid --> delete trip from user's list - WORKS
router.delete('/trips/:tripid', (req, res) => {
  User.findById(req.user._id, (err, user) => {
    user.trips.pull(req.params.tripid);
    user.save((err) => {
      if (err) res.json(err);
      res.json(user)
    })
  })
});

module.exports = router;