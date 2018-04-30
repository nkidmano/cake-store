const { Cake, validate } = require('../models/cake');
const mongoose = require('mongoose');
const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', async (req, res) => {
  const cakes = await Cake.find().sort('name');
  res.render('cakes/index', { cakes: cakes });
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body)
  if (error) res.status(400).send(error.details[0].message);

  const cake = new Cakes({
    name: req.body.name,
    image: req.body.image,
    description: req.body.description,
    price: req.body.price
  });
  await cake.save();

  res.send(cake);
});

// router.put('/:id', async (req, res) => {
//   const { error } = validate(req.body)
//   if (error) res.status(400).send(error.details[0].message);

//   Cake.findByIdAndUpdate(req.params.id, )
// });

router.delete('/:id', auth, async (req, res) => {
  const cake = await Cake.findByIdAndRemove(req.params.id);

  if (!cake) res.status(404).send('The cake with the given ID was not found.');

  res.redirect('/cakes');;
});

module.exports = router;