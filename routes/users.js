const config = require('config');
const { User, validateRegister, validateLogin } = require('../models/user');
const mongoose = require('mongoose');
const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.get('/register', (req, res) => {
  res.render('users/register');
});

router.get('/login', (req, res) => {
  res.render('users/login');
});

router.post('/register', async (req, res) => {
  const { error } = validateRegister(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send('User already registered.');

  user = new User(_.pick(req.body, ['name', 'email', 'password']));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  res.redirect('/cakes');
});

router.post('/login',  passport.authenticate('local'), async (req, res) => {
  const { error } = validateLogin(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send('Invalid email or password.');

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send('Invalid email or password.');
  
  // const token = jwt.sign({ _id: user._id }, config.get('jwtPrivateKey'));

  // res.send(token);

});

module.exports = router;