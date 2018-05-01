const express = require('express');
const mongoose = require('mongoose');
const config = require('config');
const Joi = require('joi');
const passport = require('passport');
const cakes = require('./routes/cakes');
const register = require('./routes/register');
const login = require('./routes/login');
const app = express();

if (!config.get('jwtPrivateKey')) {
  console.error('FATAL ERROR: jwtPrivateKey is not define.');
  process.exit(1);
}

mongoose.connect('mongodb://localhost/cake-store')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Failed to connect to MongoDB...', err));

require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/cakes', cakes);
app.use('/register', register);
app.use('/login', login);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server started on port ${port}`));