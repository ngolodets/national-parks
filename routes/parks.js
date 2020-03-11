const express = require('express');
const router = express.Router();
const {Trip, Park} = require('../models/trip');

//GET --> display parks on the trip
router.get('/parks', (req, res) => {
  
  Trip.findById(req.trips._id)
    .populate('parks')
      .exec((err, trip) => {
        if (err) res.json(err);
        res.json(trip);
      })
})


//POST /api/parks --> add part to the trip
router.post('trips/:tripid/parks', (req, res) => {
  Trip.findById(req.params.tripid,
    (err, trip) => {
      if (err) res.json(err);
      Park.create({
        name: req.body.name,
        state: req.body.state,
        coordinates: req.body.coordinates,
        code: req.body.code
      },
      (err, park) => {
        if (err) res.json(err);
        trip.parks.push(park);
        trip.save((err, trip) => {
          if (err) res.json(err);
          res.json(trip);
        })
      })
    })
});

module.exports = router;