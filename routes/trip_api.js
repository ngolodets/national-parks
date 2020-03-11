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
  Trip.findById(
    req.params.tripid, 
    (err, trip) => {
    if (err) res.json(err);
    res.json(trip);
  });
});

//POST /api/trips --> add a trip to user's list - WORKS
router.post('/trips', (req, res) => {
  User.findById(req.user._id, (err, user) => {
    if (err) res.json(err);
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
      if (err) res.json(err);
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
    if (err) res.json(err);
    user.trips.pull(req.params.tripid);
    user.save((err) => {
      if (err) res.json(err);
      res.json(user)
    })
  })
});

//GET api/trips/:tripid/parks --> show all parks added to the trip - WORKS
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
})

//POST api/trips/:tripid/parks --> add park to the trip
router.post('trips/:tripid/parks', (req, res) => {
  console.log(' ######## Hitting PARK POST route #######');
  Trip.findById(req.params.tripid,
    (err, trip) => {
      if (err) res.json(err);
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
    })
});

/*

app.post('/artists/:id/albums', (req, res) =>{
  Artist.findById(req.params.id, function(err, artist) {
    Album.create({
      name: req.body.name, 
      released: req.body.released,
      length: req.body.length,
      genre: req.body.genre,
      producer: req.body.producer,
      artist: req.params.id
      }, function(err,album){
          artist.albums.push(album)
          artist.save(function(err, artist){
            if (err) res.json(err)
            res.json(artist)
      })
    })
  })
})
*/

module.exports = router;