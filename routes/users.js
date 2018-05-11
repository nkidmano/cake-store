const { User, validateRegister, validateLogin } = require('../models/user');
const mongoose = require('mongoose');
const express = require('express');
const passport = require('passport');
const _ = require('lodash');
const crypto = require('crypto');
const async = require('async');
const nodemailer = require('nodemailer');
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

router.get('/reset/:token', async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() }
  });

  if (!user) return res.redirect('/login'); // reset token invalid or expired

  res.render('users/reset', { 
    title: 'Reset password',
    token: req.params.token 
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

router.post('/forgot', (req, res) => {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        const token = buf.toString('hex');
        done(err, token);
      });
    }, 
    function(token, done) {
      User.findOne({ email: req.body.email }, function(err, user) {
        if (!user) {
          return res.status(404).send('Email not exists.');
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour expires

        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
      const smtpTransport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'duongthanhtan96@gmail.com',
          pass: process.env.gmail_password
        }
      });
      const mailOptions = {
        to: user.email,
        from: 'duongthanhtan96@gmail.com',
        subject: 'Molino cake store password reset',
        text: `Your password reset link http://${req.headers.host}/users/reset/${token}`
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        console.log('mail sent');
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) return res.send('Something wrong');
    res.send('A password reset link has been sent to your email adress.');
  });
});

router.post('/reset/:token', (req, res) => {
  async.waterfall(
    [
      function(done) {
        User.findOne(
          {
            resetPasswordToken: req.params.token,
            resetPasswordExpires: { $gt: Date.now() }
          },
          function(err, user) {
            if (!user) {
              return res.status(400).send('Password reset token is invalid or has expired.');
            }
            if (req.body.password === req.body.passwordCheck) {
              user.setPassword(req.body.password, function(err) {
                user.resetPasswordToken = undefined;
                user.resetPasswordExpires = undefined;

                user.save(function(err) {
                  req.logIn(user, function(err) {
                    done(err, user);
                  });
                });
              });
            } else {
              return res.status(400).send('Passwords do not match.');
            }
          }
        );
      },
      function(user, done) {
        const smtpTransport = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
            user: 'duongthanhtan96@gmail.com',
            pass: process.env.gmail_password
          }
        });
        const mailOptions = {
          to: user.email,
          from: 'duongthanhtan96@gmail.com',
          subject: 'Your password has been changed',
          text:
            'Hello,\n\n' +
            'This is a confirmation that the password for your account ' +
            user.email +
            ' has just been changed.\n'
        };
        smtpTransport.sendMail(mailOptions, function(err) {
          console.log('mail sent');
          done(err, 'done');
        });
      }
    ],
    function(err) {
      res.redirect('/cakes');
    }
  );
});

module.exports = router;