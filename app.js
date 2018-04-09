// Requiring packages
const express       = require("express");
const mongoose      = require("mongoose");
const Joi           = require("joi");
const bodyParser    = require("body-parser");
const passport      = require("passport");
const LocalStrategy = require("passport-local");
const session       = require("express-session");
const User          = require("./models/user");

// Requiring routes
const cakesRoutes       = require("./routes/cakes");
const registerRoutes    = require("./routes/register");
const loginRoutes       = require("./routes/login");

// Init app
const app = express();
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));

// Passport config
app.use(session({
    secret: "Once again I'm the best",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Connect to db
mongoose.connect("mongodb://localhost/cake-store");
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("Connected to MongoDB");
});

// Cake.create(
//     {
//         name: "Bread with milk breast", 
//         image: "./images/test-1.jpg", 
//         description: "Rich delicious milk breast on top of solf and cheesy bread",
//         price: 5.35
//     }, (err, cake) => {
//         if(err){
//             console.log(err)
//         } else {
//             console.log("Created cake db");
//             console.log(cake);
//         }
//     }
// )

app.use("/register", registerRoutes);
app.use("/login", loginRoutes);
app.use("/menu", cakesRoutes);

app.get("/", (req, res) => {
    res.redirect("/menu");
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server started on port ${port}`));