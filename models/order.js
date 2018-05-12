const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  cake: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cake',
    required: true
  },
  quantity: {
    type: Number,
    default: 1
  }
});

const Order = mongoose.model('Order', orderSchema);

exports.Order = Order;