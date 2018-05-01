const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const config = require('config');
const Joi = require('joi');
const passport = require('passport');
const cakes = require('./routes/cakes');
const users = require('./routes/users');
const app = express();

if (!config.get('jwtPrivateKey')) {
  console.error('FATAL ERROR: jwtPrivateKey is not define.');
  process.exit(1);
}

mongoose.connect('mongodb://localhost/cake-store')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Failed to connect to MongoDB...', err));

app.set('view engine', 'ejs');
app.use(methodOverride('_method'));
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/cakes', cakes);
app.use('/users', users);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server started on port ${port}`));