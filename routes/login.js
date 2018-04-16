const express = require('express');
const User = require('../models/user');
const router = express.Router();

// GET: Login page
router.get('/', (req, res) => {
  res.render('login');
});

module.exports = router;
