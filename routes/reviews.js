const { Review, validate } = require('../models/review');
const { Cake } = require('../models/cake');
const mongoose = require('mongoose');
const express = require('express');
const _ = require('lodash');
const router = express.Router({mergeParams: true});

router.get('/', async (req, res) => {
  const cake = await Cake.findById(req.params.id);
  res.render('reviews/index', {
    title: 'Reviews',
    cake: cake
  });
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body)
  if (error) return res.status(400).send(error.details[0].message);

  const cake = await Cake.findById(req.params.id);
  if (!cake) return res.status(404).send('The cake with the given ID was not found.');

  const review = new Review(_.pick(req.body, 'review'));
  await review.save();

  cake.reviews.push(review);
  await cake.save();

  res.redirect(`/cakes/${cake._id}/reviews`);
});

// router.put('/edit', async (req, res) => {
//   const { error } = validate(req.body)
//   if (error) return res.status(400).send(error.details[0].message);

//   const cake = await Cake.findById(req.params.id);
//   if (!cake) return res.status(404).send('The cake with the given ID was not found.');

//   const review = new Review(_.pick(req.body, 'review'));
// });

router.delete('/:review_id', async(req, res) => {
  const cake = await Cake.findById(req.params.id);
  if (!cake) return res.status(404).send('The cake with the given ID was not found.');

  const review = cake.reviews.id(req.params.review_id);
  await review.remove();
  await cake.save();

  res.redirect(`/cakes/${cake._id}/reviews`);
});


module.exports = router;