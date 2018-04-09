const mongoose = require("mongoose");

// User Schema
const UserSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: true 
    },
    email: {
        type: String, 
        required: true 
    },
    password: {
        type: String, 
        required: true
    },
    admin: {
        type: Boolean
    }
});

module.exports = mongoose.model("User", UserSchema);