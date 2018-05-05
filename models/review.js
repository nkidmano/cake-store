const mongoose = require('mongoose');
const { User } = require('./user');
const Joi = require('joi');

const reviewSchema = new mongoose.Schema({
  review: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255
  }
});

const Review = mongoose.model('Review', reviewSchema);

function validateReview(review) {
  const schema = {
    review: Joi.string().min(5).max(255).required()
  }; 

  return Joi.validate(review, schema);
}

exports.reviewSchema = reviewSchema;
exports.Review = Review;
exports.validate = validateReview;