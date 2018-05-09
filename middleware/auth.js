const { Cake } = require('../models/cake');
const { User } = require('../models/user');

function isLoggedIn (req, res, next) {
  if (req.isAuthenticated()){
    return next();
  }
  res.redirect('/users/login');
}

async function isAuthor (req, res, next) {
  if (req.isAuthenticated()) {
    const cake = await Cake.findById(req.params.id);
    
    cake.reviews.forEach(review => {
      if(review.author.id.equals(req.user._id)) {
        return next();
      } else {
        return res.redirect('/cakes');
      }
    });

  } else {
    res.redirect('/users/login');
  }
}

exports.isLoggedIn = isLoggedIn;
exports.isAuthor = isAuthor;