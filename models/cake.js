const mongoose = require('mongoose');
const { Comment } = require('./comment'); 
const Joi = require('joi');

const cakeSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50
    },
    image: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 255
    },
    price: {
      type: Number,
      required: true,
      min: 1,
      max: 50
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
      }
    ]
});

const Cake = mongoose.model('Cake', cakeSchema);

function validateCake(cake) {
  const schema = {
    name: Joi.string().min(5).max(50).required(),
    image: Joi.string().required(),
    description: Joi.string().min(5).max(255).required(),
    price: Joi.number().min(1).max(50).required()
  };

  return Joi.validate(cake, schema);
}

exports.Cake = Cake;
exports.validate = validateCake;