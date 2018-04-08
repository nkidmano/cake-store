const express       = require("express");
const mongoose      = require("mongoose");
const Joi           = require("joi");
const bodyParser    = require("body-parser");
const passport      = require("passport");
const LocalStrategy = require("passport-local");
const session       = require("express-session");
const Cake          = require("./models/cake");
const User          = require("./models/user");

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
//         name: "Creampie bread", 
//         image: "/test-1.jpg", 
//         description: "Bread and cummie, simple but delicous and rich af",
//         price: 2.35
//     }, (err, cake) => {
//         if(err){
//             console.log(err)
//         } else {
//             console.log("Created cake db");
//             console.log(cake);
//         }
//     }
// )

app.get("/menu", (req, res) => {
    Cake.find({}, (err, allCakes) => {
        if(err){
            res.status(404).send("Website are downed");
            console.log(err)
        } else {
            res.render("menu", {cakes:allCakes});
        }
    });
});

// app.get("/menu/:_id", (req, res) => {
//     Cake.find(c => c.id === parseInt(req.params.id), (err, cake) => {
//         if(err) {
//             res.status(404).send("Cannot find the cake with the given ID");
//         } else {
//             res.render()
//         }
//     });
// });

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.post("/register", (req, res) => {
    const schema = {
        name: Joi.string().required(),
        email: Joi.string().required(),
        password: Joi.string().min(6).required()
    };

    const validateResult = Joi.validate(req.body, schema);
    if(validateResult.error) {
        res.status(400).send(validateResult.error);
        return;
    }

    const newUser = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    };

    User.create(newUser, (err, user) => {
        if(err){
            console.log(err)
        } else {
            console.log(user);
            res.redirect("/menu");
        }
    });
});

app.get("/", (req, res) => {
    res.redirect("/menu");
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server started on port ${port}`));