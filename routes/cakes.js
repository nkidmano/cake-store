// Require packages
const { Cake, validate } = require('../models/cake');
const express = require('express');
const _ = require('lodash');
const router = express.Router();

// GET: cake's menu / search cake
router.get('/', async (req, res) => {
  if (req.query.search) {
    const cakes = await Cake.find({ name: { $regex: req.query.search, $options: 'i' } });
    res.render('cakes/index', { 
      title: 'Menu',
      cakes: cakes
    });
  } else {
    const cakes = await Cake.find();
    res.render('cakes/index', { 
      title: 'Menu',
      cakes: cakes
    });
  }
  console.log(process.env);
});

// GET: top 10 cakes page
router.get('/top', async (req, res) => {
  const cakes = await Cake.find().sort('-record').limit(10);
  res.render('top/index', {
    title: 'Top 10',
    cakes: cakes
  })
});

// GET: new cake page for admin
router.get('/new', (req, res) => {
  res.render('cakes/new', {
    title: 'Add cake',
  })
});

// GET: edit cake page for admin
router.get('/:id/edit', async (req, res) => {
  const cake = await Cake.findById(req.params.id);
  res.render('cakes/edit', { 
    title: 'Edit',
    cake: cake
  });
});

// POST: ADD new cake
router.post('/new', async (req, res) => {
  const { error } = validate(req.body)
  if (error) res.status(400).send(error.details[0].message);

  const cake = new Cake(_.pick(req.body, ['name', 'image', 'description', 'price']));

  const path = '../images/'; // hard code path for image
  cake.image = `${path}${req.body.image}`; // re-assign image path, html can't get accurate path

  await cake.save();

  res.redirect('/cakes');
});

// PUT: UPDATE cake
router.put('/:id', async (req, res) => {
  const { error } = validate(req.body)
  if (error) return res.status(400).send(error.details[0].message);

  const cake = await Cake.findByIdAndUpdate(req.params.id, _.pick(req.body, [
    'name',
    'image',
    'description', 
    'price'
  ]));
  if (!cake) return res.status(404).send('The cake with given ID was not found.');

  const path = '../images/'; // hard code path for image
  cake.image = `${path}${req.body.image}`; // redefine image path, html can't get accurate path
  
  await cake.save();


  res.redirect('/cakes');
});

// DELETE: REMOVE a cake
router.delete('/:id', async (req, res) => {
  const cake = await Cake.findByIdAndRemove(req.params.id);

  if (!cake) return res.status(404).send('The cake with the given ID was not found.');

  res.redirect('/cakes');;
});

module.exports = router;