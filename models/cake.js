const mongoose = require("mongoose");

let cakeSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    price: Number
});

module.exports = mongoose.model("Cake", cakeSchema);