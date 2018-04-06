const express       = require("express");
const mongoose      = require("mongoose");
const bodyParser    = require("body-parser");
const passport      = require("passport");
const LocalStrategy = require("passport-local");
const session       = require("express-session");
const Cake          = require("./models/cake");
const User          = require("./models/user");

// Init app
const app = express();
app.set("view engine", "ejs");
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
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("Connected to MongoDB");
});




// Cake.create(
//     {
//         name: "Creampie bread", 
//         image: "/test-1.jpg", 
//         description: "Bread and cummie, simple but delicous and rich af",
//         price: 2.35
//     }, function(err, cake){
//         if(err){
//             console.log(err)
//         } else {
//             console.log("Created cake db");
//             console.log(cake);
//         }
//     }
// )

app.get("/menu", function(req, res){
    Cake.find({}, function(err, allCakes){
        if(err){
            console.log(err)
        } else {
            res.render("menu",{cakes:allCakes});
        }
    });
});

app.get("/login", function(req, res){
    res.render("login");
});

app.get("/register", function(req, res){
    res.render("register");
});

app.post("/register", function(req, res){
    var newUser = new User({name: req.body.email});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err)
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/menu");
        });
    });
});

app.get("/", function(req, res){
    res.redirect("/menu");
});



app.listen(3000, function(){
    console.log("SERVER STARTED");
});