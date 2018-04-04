const express = require("express");
const mongoose = require("mongoose");

// Connect to db
mongoose.connect("mongodb://localhost/cake-store");
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("Connected to MongoDB");
});

// Init app
const app = express();

app.set("view engine", "ejs");

// Set folder path
app.use(express.static(__dirname + "/css"));
app.use(express.static(__dirname + "/img"));

app.get("/menu", function(req, res){
    var cakes = [
        {
            name: "Honey lasfe bread", 
            image: "/test-1.jpg", 
            description: "Baked with honey and sorcery powder, made for diet people.",
            price: 1.5
        },
        {
            name: "Eltobido cheese bread", 
            image: "/test-1.jpg", 
            description: "Delicous german cheesy bread that was made with extra love.",
            price: 2.5
        }
    ];

    res.render("menu",{cakes:cakes});
});

app.get("/login", function(req, res){
    res.render("login");
});

app.get("/register", function(req, res){
    res.render("register");
});

app.get("/", function(req, res){
    res.render("menu");
});

app.listen(3000, function(){
    console.log("SERVER STARTED");
});