const express = require("express");
const mongoose = require("mongoose");
const Cake = require("./models/cake");
// const Comment = require("./models/comment");
// const User = require("./models/user");

// Init app
const app = express();

// Connect to db
mongoose.connect("mongodb://localhost/cake-store");
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("Connected to MongoDB");
});

app.set("view engine", "ejs");

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

// Set folder path
app.use(express.static(__dirname + "/css"));
app.use(express.static(__dirname + "/img"));

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

app.get("/", function(req, res){
    res.redirect("/menu");
});

app.listen(3000, function(){
    console.log("SERVER STARTED");
});