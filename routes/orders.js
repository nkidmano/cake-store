const express = require('express');
const { Cake } = require('../models/cake');
const { Order } = require('../models/order');
const router = express.Router();

// /orders => show all order
// /orders/:cakeid => have a form to send post request that have cakeId and Quantity that you want to order

router.get('/', async (req, res) => {
  res.render('orders/index', {
    title: 'Orders',
    orders: req.session.orders
  });
});

// GET add a cake to cart
router.get('/:cake_id', async (req, res) => {
  const cake = await Cake.findById(req.params.cake_id);
  if (!cake) return res.status(400).send('Bad request');

  if (typeof req.session.orders == 'undefined') { // check if its the first cake add to cart
    req.session.orders = [];
    req.session.orders.push({
      id: cake._id,
      name: cake.name,
      quantity: 1,
      price: parseFloat(cake.price).toFixed(2),
      image: ''
    });
    } else { // if its not
    const orders = req.session.orders;
    let newItem = true;

    for (let i = 0; i < orders.length; i++) {
      if (orders[i].id == cake._id) {
        orders[i].quantity++;
        newItem = false;
        break;
      }
    }

    if (newItem) {
      orders.push({
        id: cake._id,
        name: cake.name,
        quantity: 1,
        price: parseFloat(cake.price).toFixed(2),
        image: ''
      });
    }
  }
  res.redirect('back');
});

module.exports = router;