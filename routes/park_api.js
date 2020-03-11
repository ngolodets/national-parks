const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Park = require('../models/park');
const Trip = require('../models/trip');

//TEST
router.get('/', (req, res) => {
  res.json({type: 'success', message: "You accessed the protected park_api routes"});
});

//GET --> display all user's parks
router.get('/parks', (req, res) => {
  User.findById(req.user._id)
    .populate('parks')
      .exec((err, user) => {
        if (err) res.json(err);
        res.json(user);
      })
    
})




module.exports = router;