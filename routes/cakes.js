const { Cake, validate } = require('../models/cake');
const mongoose = require('mongoose');
const express = require('express');
const _ = require('lodash');
const router = express.Router();

router.get('/', async (req, res) => {
  const cakes = await Cake.find().sort('name');
  res.render('cakes/index', { cakes: cakes });
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body)
  if (error) res.status(400).send(error.details[0].message);

  const cake = new Cake(_.pick(req.body, ['name', 'image', 'description', 'price']));
  await cake.save();

  res.send(cake);
});

router.put('/:id', async (req, res) => {
  const { error } = validate(req.body)
  if (error) return res.status(400).send(error.details[0].message);

  const cake = await Cake.findByIdAndUpdate(req.params.id, _.pick(req.body, [
    'name',
    'image',
    'description', 
    'price'
  ]), { new: true });
  if (!cake) return res.status(404).send('The cake with given ID was not found.');

  res.send(cake);
});

router.delete('/:id', async (req, res) => {
  const cake = await Cake.findByIdAndRemove(req.params.id);

  if (!cake) res.status(404).send('The cake with the given ID was not found.');

  res.redirect('/cakes');;
});

router.get('/:id', async (req, res) => {
  const cake = await Cake.findById(req.params.id);

  if (!cake) return res.status(404).send('The cake with the given ID was not found.');

  res.send(cake);
});

module.exports = router;