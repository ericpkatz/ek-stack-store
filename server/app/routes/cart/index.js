'use strict';
var router = require('express').Router();
module.exports = router;
var _ = require('lodash');

var ensureAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(401).end();
    }
};

router.get('/', ensureAuthenticated, function (req, res) {
  req.user
    .getCart()
      .then(function(cart){
        res.send(cart);
      });
});

router.post('/checkout', ensureAuthenticated, function (req, res) {
  req.user
    .getCart()
      .then(function(cart){
        cart.status = 'processed';
        cart.orderDate = new Date();
        return cart.save();
      })
      .then(function(cart){
        res.send(cart);
      });
});
