const mongoose = require('mongoose');
const { User } = require('./user');
const Joi = require('joi');

const commentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

const Comment = mongoose.model('Comment', commentSchema);

function validateComment(comment) {
  const schema = {
    text: Joi.string().min(5).max(255).required()
  }; 

  return Joi.validate(comment, schema);
}

exports.Comment = Comment;
exports.validate = validateComment;