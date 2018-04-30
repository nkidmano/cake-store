const { Cake, validate } = require('../models/cake');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const cakes = await Cake.find().sort('name');
  res.render('cakes/index', { cakes: cakes });
});

module.exports = router;