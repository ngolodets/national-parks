const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({type: 'success', message: "You are on the home page"});
  
})

module.exports = router;