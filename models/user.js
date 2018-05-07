const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Joi = require('joi');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    trim: true
  },
  password: {
    type: String
  },
  isAdmin: { 
    type: Boolean,
    default: false
  }
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', userSchema);

function validateRegister(user) {
  const schema = {
    username: Joi.string().min(3).max(50).required(),
    email: Joi.string().min(10).max(255).required().email(),
    password: Joi.string().min(6).max(24).required(),
    passwordCheck: Joi.string().equal(user.password).required()
  }

  return Joi.validate(user, schema);
}

function validateLogin(req) {
  const schema = {
    username: Joi.string().min(3).max(50).required(),
    password: Joi.string().min(6).max(24).required()
  }

  return Joi.validate(req, schema);
}

exports.User = User;
exports.validateRegister = validateRegister;
exports.validateLogin = validateLogin;