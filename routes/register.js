const express = require('express');
const Joi = require('joi');
const User = require('../models/user');
const router = express.Router();

// GET: Register page
router.get('/', (req, res) => {
  res.render('register');
});

// POST: Register logic
router.post('/', (req, res) => {
  const { error } = validateRegister(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const newUser = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  };

  User.create(newUser, (err, user) => {
    if (err) {
      console.log(err);
    } else {
      console.log(user);
      res.redirect('/cakes');
    }
  });
});

function validateRegister(register) {
  const validateRegister = {
    name: Joi.string().required(),
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string()
      .min(6)
      .required(),
    passwordCheck: Joi.string()
      .equal(register.password)
      .required()
  };

  return Joi.validate(register, validateRegister);
}

module.exports = router;
