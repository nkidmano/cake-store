const express = require('express');
const { Cake } = require('../models/cake');
const { Order } = require('../models/order');
const router = express.Router();

// /orders => show all order
// /orders/:cakeid => have a form to send post request that have cakeId and Quantity that you want to order

router.get('/', async (req, res) => {
  res.render('cakes/order', {
    title: 'Orders'
  });
});

router.post('/:cake_id', async (req, res) => {
  const cake = Cake.findById(req.params.cake_id);
  if (!cake) return res.status(404).send('Bad request.');

  const order = new Order({
    cake: req.params.cake_id,
    quantity: req.body.quantity
  });

  await order.save();

  res.send(order);
});

module.exports = router;