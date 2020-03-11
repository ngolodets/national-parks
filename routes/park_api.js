const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Park = require('../models/park');
const Trip = require('../models/trip');

//TEST
router.get('/', (req, res) => {
  res.json({type: 'success', message: "You accessed the protected park_api routes"});
});

//GET --> display all user's parks - WORKS
router.get('/parks', (req, res) => {
  User.findById(req.user._id)
    .populate('parks')
      .exec((err, user) => {
        if (err) res.json(err);
        res.json(user);
  })
});

//GET /park_api/parks/:parkid --> show selected park - WORKS
router.get('/parks/:parkid', (req, res) => {
  Park.findById(
    req.params.parkid, 
    (err, park) => {
    if (err) res.json(err);
    res.json(park);
  });
});

//POST /park_api/parks --> add a park to user's list - WORKS
router.post('/parks', (req, res) => {
  User.findById(req.user._id, (err, user) => {
    if (err) res.json(err);
    Park.create({
      name: req.body.name,
      state: req.body.state,
      coordinates: req.body.coordinates,
      code: req.code,
      user: req.params._id
    },
    (err, park) => {
      if (err) res.json(err);
      user.parks.push(park);
      user.save((err, user) => {
        if (err) res.json(err);
        res.json(user);
      })
    })
  })
});

//PUT /park_api/parks/:parkid --> update park - WORKS
router.put('/parks/:parkid', (req, res) => {
  User.findById(
    req.user._id,
    (err, user) => {
      if (err) res.json(err);
      Park.findByIdAndUpdate(
        req.params.parkid,
        {
          comments: req.body.comments
        },
        {new: true},
        (err, park) => {
          if (err) res.json(err)
          res.json(park)
        }
      )
    }
  )
});

//DELETE /park_api/parks/:parkid --> delete park from user's list - WORKS
router.delete('/parks/:parkid', (req, res) => {
  User.findById(req.user._id, (err, user) => {
    if (err) res.json(err);
    user.parks.pull(req.params.parkid);
    user.save((err) => {
      if (err) res.json(err);
      res.json(user)
    })
  })
});

module.exports = router;