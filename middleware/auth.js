const { Cake } = require('../models/cake');
const { User } = require('../models/user');

function isLoggedIn (req, res, next) {
  if (req.isAuthenticated()){
    return next();
  }
  res.redirect('/users/login');
}

exports.isLoggedIn = isLoggedIn;