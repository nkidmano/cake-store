const express = require('express');
const { Cake } = require('../models/cake');
const { Order } = require('../models/order');
const { isLoggedIn } = require('../middleware/auth');
const router = express.Router();

// Show all orders
router.get('/', async (req, res) => {
  res.render('orders/index', {
    title: 'Orders',
    orders: req.session.orders
  });
});

// Add an item to a the cart
router.get('/:cake_id', isLoggedIn, async (req, res) => {
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

// Add remove clear cart action
router.get('/:cake_id/update', (req, res) => {
  const orders = req.session.orders;
  const action = req.query.action;

  for (let i = 0; i < orders.length; i++) {
    if (orders[i].id == req.params.cake_id) {
      switch(action) {
        case "add":
          orders[i].quantity++;
          break;
        case "remove":
          orders[i].quantity--;
          if (orders[i].quantity == 0) orders.splice(i, 1);
          if (orders.length == 0) delete req.session.orders;
          break;
        case "clear":
          orders.splice(i, 1);
          if (orders.length == 0) delete req.session.orders;
          break;
        default:
          console.log('update problem');
          break;
      }
      break;
    }
  }
  res.redirect('back');
});

module.exports = router;