// Requiring packages
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const session = require('express-session');
const passport = require('passport');
const Joi = require('joi');

// Init app
const app = express();

// View engine setup
app.set('view engine', 'ejs');

// Set static public folder
app.use(express.static('public'));

// Express middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(helmet());

// Express Session middleware
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}));



// Connect to db
mongoose.connect('mongodb://localhost/cake-store');
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('Connected to MongoDB');
});

// Seed db
// seedDB();

// Requiring routes
const cakesRoutes       = require('./routes/cakes');
const registerRoutes    = require('./routes/register');
const loginRoutes       = require('./routes/login');

// Set routes
app.use('/register', registerRoutes);
app.use('/login', loginRoutes);
app.use('/cakes', cakesRoutes);

app.get('/', (req, res) => {
    res.redirect('/cakes');
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server started on port ${port}`));