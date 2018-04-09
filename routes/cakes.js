const express       = require("express");
const Cake          = require("../models/cake");
const router        = express.Router();

// GET: INDEX - All cakes page
router.get("/", (req, res) => {
    Cake.find({}, (err, allCakes) => {
        if(err){
            res.status(404).send("Website are downed");
            console.log(err)
        } else {
            res.render("cakes/index", {cakes:allCakes});
        }
    });
});

// router.get("/menu/:_id", (req, res) => {
//     Cake.find(c => c.id === parseInt(req.params.id), (err, cake) => {
//         if(err) {
//             res.status(404).send("Cannot find the cake with the given ID");
//         } else {
//             res.render()
//         }
//     });
// });

module.exports = router;