const { Review, validate } = require('../models/review');
const { Cake } = require('../models/cake');
const { User } = require('../models/user');
const mongoose = require('mongoose');
const express = require('express');
const _ = require('lodash');
const { isLoggedIn, isAuthor } = require('../middleware/auth');
const router = express.Router({ mergeParams: true });

router.get('/', async (req, res) => {
  const cake = await Cake.findById(req.params.id);
  res.render('reviews/index', {
    title: 'Reviews',
    cake: cake
  });
});

router.post('/', isLoggedIn, async (req, res) => {
  const { error } = validate(req.body)
  if (error) return res.status(400).send(error.details[0].message);

  const cake = await Cake.findById(req.params.id);
  if (!cake) return res.status(404).send('The cake with the given ID was not found.');

  const review = new Review({
    review: req.body.review,
    "author.id": req.user._id,
    "author.username": req.user.username
  });

  cake.reviews.push(review);
  await cake.save();

  res.redirect(`/cakes/${cake._id}/reviews`);
});

router.put('/:review_id/edit', async (req, res) => {
  const { error } = validate(req.body)
  if (error) return res.status(400).send(error.details[0].message);

  const cake = await Cake.update({ 'reviews._id' : req.params.review_id }, {
    $set: {
      'reviews.$.review': req.body.review // $ get the first matched reviews._id in reviews array
    }
  });
  
  res.redirect(`/cakes/${req.params.id}/reviews`);
});

router.delete('/:review_id', async (req, res) => {
  const cake = await Cake.findById(req.params.id);
  if (!cake) return res.status(404).send('The cake with the given ID was not found.');

  const review = cake.reviews.id(req.params.review_id);
  await review.remove();
  await cake.save();

  res.redirect(`/cakes/${cake._id}/reviews`);
});

module.exports = router;