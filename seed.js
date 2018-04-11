const express = require('express');
const Cake = require('./models/cake');;
const User = require('./models/user');

Cake.create(
    {
        name: 'Bread with milk breast', 
        image: './images/test-1.jpg', 
        description: 'Rich delicious milk breast on top of solf and cheesy bread',
        price: 5.35
    }, (err, cake) => {
        if(err){
            console.log(err)
        } else {
            console.log('Created cake db');
            console.log(cake);
        }
    }
)

module.exports = seedDB;