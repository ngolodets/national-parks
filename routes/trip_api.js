const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Trip = require('../models/trip');
const Park = require('../models/park');

//Testring /trip_api/ route - WORKS
router.get('/', (req, res) => {
  res.json({type: 'success', message: "You accessed the protected trip_api routes"});
});

//GET /trip_api/trips --> show all user's trips - WORKS
router.get('/trips', (req, res) => {
  User.findById(req.user._id)
    .populate('trips')
      .exec((err, user) => {
        if (err) res.json(err);
        res.json(user);
  });
});

//GET /trip_api/trips/:tripid --> show selected trip - WORKS
router.get('/trips/:tripid', (req, res) => {
  Trip.findById(
    req.params.tripid, 
    (err, trip) => {
    if (err) res.json(err);
    res.json(trip);
  });
});

//POST /trip_api/trips --> add a trip to user's list - WORKS
router.post('/trips', (req, res) => {
  User.findById(req.user._id, (err, user) => {
    if (err) res.json(err);
    Trip.findOne({name: req.body.name},
      (err, trip) => {
        if (err) res.json(err);
        if (trip === null) {
          Trip.create({
            name: req.body.name,
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
        } else {
          res.json(user);
        }
      })
  })
});

//PUT /trip_api/trips/:tripid --> update trip - WORKS
router.put('/trips/:tripid', (req, res) => {
  User.findById(
    req.user._id,
    (err, user) => {
      if (err) res.json(err);
      Trip.findByIdAndUpdate(
        req.params.tripid,
        {
          name: req.body.name,
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

//DELETE /trip_api/trips/:tripid --> delete trip from user's list - WORKS
router.delete('/trips/:tripid', (req, res) => {
  User.findById(req.user._id, (err, user) => {
    if (err) res.json(err);
    user.trips.pull(req.params.tripid);
    user.save((err) => {
      if (err) res.json(err);
      res.json(user)
    })
  })
});

//GET trip_api/trips/:tripid/parks --> show all parks added to the trip - WORKS
router.get('/trips/:tripid/parks', (req, res) => {
  Trip.findById(req.params.tripid)
    .populate('parks')
      .exec((err, trip) => {
        if (err) res.json(err);
        res.json(trip);
  })
});

//GET /trips/:tripsid/parks/:parkid --> get park info for a particular trip - WORKS
router.get('/trips/:tripid/parks/:parkid', (req, res) => {
  Park.findById(
    req.params.parkid, 
    (err, park) => {
    if (err) res.json(err)
    res.json(park)
  })
});

//POST trip_api/trips/:tripid/parks --> add park to the trip - WORKS
router.post('/trips/:tripid/parks', (req, res) => {
  //console.log(' ######## Hitting PARK POST route #######');
  Trip.findById(req.params.tripid,
    (err, trip) => {
      if (err) res.json(err);

      Park.findOne({name: req.body.name, code: req.body.code},
        (err, park) => {
          if (err) res.json(err);
          if (park === null) {
            Park.create({
              name: req.body.name,
              state: req.body.state,
              coordinates: req.body.coordinates,
              code: req.body.code,
              trip: req.params.tripid
            },
            (err, park) => {
              if (err) res.json(err);
              trip.parks.push(park);
              trip.save((err, trip) => {
                if (err) res.json(err);
                res.json(trip);
              })
            })
          } else {
            res.json(trip);
          }
        })
    })
});

//PUT trip_api/trips/:tripid/parks/:parkid --> update park info - WORKS
router.put('/trips/:tripid/parks/:parkid', (req, res) => {
  Trip.findById(
    req.params.tripid,
    (err, trip) => {
      if (err) res.json(err);
      Park.findByIdAndUpdate(
        req.params.parkid,
        {
          comments: req.body.comments
        },
        {new: true},
        (err, park) => {
          if (err) res.json(err);
          res.json(park);
        }
      )
    }
  )
});

//DELETE trip_api/trips/:tripid/parks/:parkid --> delete park from particular trip - WORKS
router.delete('/trips/:tripid/parks/:parkid', (req, res) => {
  Trip.findById(
    req.params.tripid,
    (err, trip) => {
      if (err) res.json(err);
      trip.parks.pull(req.params.parkid);
      trip.save((err, trip) => {
        if (err) res.json(err);
        Park.deleteOne({_id: req.params.parkid},
          (err) => {
            if (err) res.json(err);
            res.json(trip);
          })
      })
    }
  )
});

module.exports = router;