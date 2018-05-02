const { Comment, validate } = require('../models/comment');
const { Cake } = require('../models/cake');
const mongoose = require('mongoose');
const express = require('express');
const _ = require('lodash');
const router = express.Router();

router.post('/', async (req, res) => {
  const { error } = validate(req.body)
  if (error) res.status(400).send(error.details[0].message);

  const cake = await Cake.findById(req.params.id);
  if (!cake) return res.status(404).send('The cake with the given ID was not found.');

  const comment = new Comment({
    text: req.body.text,
    author
  });
  await comment.save();

  const cake = new Cake(_.pick(req.body, ['name', 'image', 'description', 'price']));
  await cake.save();
});


module.exports = router;