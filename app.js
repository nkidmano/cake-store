// Require packages
const express = require('express');
const mongoose = require('mongoose');
const config = require('config');
const methodOverride = require('method-override');

// Require routes
const cakes = require('./routes/cakes');
const users = require('./routes/users');
const reviews = require('./routes/reviews');

// Init app
const app = express();

// Check private key
if (!config.get('jwtPrivateKey')) {
  console.error('FATAL ERROR: jwtPrivateKey is not define.');
  process.exit(1);
}

// Connect to MongoDB
mongoose.connect('mongodb://localhost/cake-store')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Failed to connect to MongoDB...', err));

// Set middlewares
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set routes
app.use('/cakes', cakes);
app.use('/users', users);
app.use('/cakes/:id/reviews', reviews);

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server started on port ${port}`));