// Require packages
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const passportLocalMongoose = require('passport-local-mongoose');
const methodOverride = require('method-override');
const { User } = require('./models/user');

// Require routes
const cakes = require('./routes/cakes');
const users = require('./routes/users');
const orders = require('./routes/orders');
const reviews = require('./routes/reviews');

// Init app
const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost/cake-store')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Failed to connect to MongoDB...', err));

// Set middlewares
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static('public'));

// Passport setup
app.use(passport.initialize());
app.use(passport.session());
app.use(session({
  secret: 'nodejs',
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get('*', function(req, res, next){
  res.locals.user = req.user || false;
  next();
});

// Set routes
app.use('/cakes', cakes);
app.use('/users', users);
app.use('/orders', orders);
app.use('/cakes/:id/reviews', reviews);

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server started on port ${port}`));