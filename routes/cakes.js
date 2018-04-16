const express = require('express');
const Cake = require('../models/cake');
const router = express.Router();

// GET: INDEX - All cakes page
router.get('/', (req, res) => {
  Cake.find({}, (err, allCakes) => {
    if (err) {
      res.status(404).send('Website are downed');
      console.log(err);
    } else {
      res.render('cakes/index', { cakes: allCakes });
    }
  });
});

module.exports = router;
