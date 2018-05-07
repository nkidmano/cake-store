const { User, validateRegister, validateLogin } = require('../models/user');
const mongoose = require('mongoose');
const express = require('express');
const passport = require('passport');
const _ = require('lodash');
const router = express.Router();

router.get('/register', (req, res) => {
  res.render('users/register', {
    title: 'Sign up'
  });
});

router.get('/login', (req, res) => {
  res.render('users/login', {
    title: 'Login' 
  });
});

router.post('/register', async (req, res) => {
  const { error } = validateRegister(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findOne({ username: req.body.username });
  if (user) return res.status(400).send('User already registered.');

  User.register(new User(_.pick(req.body, ['username', 'email'])), req.body.password, function(err, user) {
    if (err) {
      console.log(err);
      return res.redirect('/users/register');
    }
    passport.authenticate('local')(req, res, () => {
      res.redirect('/cakes');
    });
  });
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/cakes',
  failureRedirect: '/users/login'
  }) ,(req, res) => {
});

router.get('/logout', async (req, res) => {
  await req.logout();
  res.redirect('/cakes');
});

module.exports = router;