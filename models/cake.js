const mongoose = require("mongoose");

// Cake Schema
const CakeSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: true 
    },
    image: {
        type: String,
        required: true 
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model("Cake", CakeSchema);