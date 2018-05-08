const { Cake, validate } = require('../models/cake');
const mongoose = require('mongoose');
const express = require('express');
const _ = require('lodash');
const router = express.Router();

router.get('/', async (req, res) => {
  const cakes = await Cake.find();
  res.render('cakes/index', { 
    title: 'Menu',
    cakes: cakes
  });
});

router.get('/new', (req, res) => {
  res.render('cakes/new', {
    title: 'Add cake',
  })
});

router.get('/:id/edit', async (req, res) => {
  const cake = await Cake.findById(req.params.id);
  res.render('cakes/edit', { 
    title: 'Edit',
    cake: cake
  });
});

router.post('/new', async (req, res) => {
  const { error } = validate(req.body)
  if (error) res.status(400).send(error.details[0].message);

  const cake = new Cake(_.pick(req.body, ['name', 'image', 'description', 'price']));

  const path = './images/'; // hard code path for image
  cake.image = `${path}${req.body.image}`; // redefine image path, html can't get accurate path

  await cake.save();

  res.redirect('/cakes');
});

router.put('/:id', async (req, res) => {
  const { error } = validate(req.body)
  if (error) return res.status(400).send(error.details[0].message);

  const cake = await Cake.findByIdAndUpdate(req.params.id, _.pick(req.body, [
    'name',
    'image',
    'description', 
    'price'
  ]));

  const path = './images/'; // hard code path for image
  cake.image = `${path}${req.body.image}`; // redefine image path, html can't get accurate path
  
  await cake.save();

  if (!cake) return res.status(404).send('The cake with given ID was not found.');

  res.redirect('/cakes');
});

router.delete('/:id', async (req, res) => {
  const cake = await Cake.findByIdAndRemove(req.params.id);

  if (!cake) return res.status(404).send('The cake with the given ID was not found.');

  res.redirect('/cakes');;
});

router.get('/:id', async (req, res) => {
  const cake = await Cake.findById(req.params.id);

  if (!cake) return res.status(404).send('The cake with the given ID was not found.');

  res.send(cake);
});

module.exports = router;