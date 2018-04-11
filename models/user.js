const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

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

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);