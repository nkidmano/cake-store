const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Joi = require('joi');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    minlength: 5,
    maxlength: 255,
    trim: true
  },
  password: {
    type: String,
    minlength: 5,
    maxlength: 1024
  },
  isAdmin: Boolean
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', userSchema);

function validateRegister(user) {
  const schema = {
    username: Joi.string().min(2).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
    passwordCheck: Joi.string().equal(user.password).required()
  }

  return Joi.validate(user, schema);
}

function validateLogin(req) {
  const schema = {
    username: Joi.string().min(2).max(50).required(),
    password: Joi.string().min(5).max(255).required()
  }

  return Joi.validate(req, schema);
}

exports.User = User;
exports.validateRegister = validateRegister;
exports.validateLogin = validateLogin;