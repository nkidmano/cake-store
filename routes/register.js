const express   = require("express");
const Joi       = require("joi");
const User      = require("../models/user");
const router    = express.Router();

// GET: Register page
router.get("/", (req, res) => {
    res.render("register");
});

// POST: Register logic
router.post("/", (req, res) => {
    const validateSchema = {
        name: Joi.string().required(),
        email: Joi.string().required(),
        password: Joi.string().min(6).required()
    };

    const validateResult = Joi.validate(req.body, validateSchema);
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

module.exports = router;