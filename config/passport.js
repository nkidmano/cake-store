const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const bcrypt = require('bcryptjs');

module.exports = function(passport) {
  passport.use(new LocalStrategy(async function (username, password, done) {
    const user = await User.findOne({ username: username });

    if (!user) return done(null, false, { message: 'No user found.'});

    const validPassword = await bcrypt.compare(password, user.passport);
    if (!validPassword) return done(null, false, { message: 'Wrong password.'});

    return done(null, user);
  }));

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
}

