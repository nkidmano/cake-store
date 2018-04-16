const express = require('express');
const Cake = require('./models/cake');
const User = require('./models/user');

async function createCake() {
  const cake = await new Cake({
    name: 'Bread with breast milk',
    image: './images/test-1.jpg',
    description: 'Rich delicious milk breast on top of solf and cheesy bread',
    price: 5.35
  });

  const result = cake.save();
  console.log(result);
}