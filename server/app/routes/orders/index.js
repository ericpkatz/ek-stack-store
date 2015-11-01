'use strict';
var router = require('express').Router();
module.exports = router;
var mongoose = require('mongoose');
var Order = mongoose.model('Order');
var LineItem = mongoose.model('LineItem');


router.get('/', function (req, res) {
  return req.user.getOrders()
    .then(function(orders){
      res.send(orders);
    });
});

router.get('/:id', function (req, res) {
  return Order.findById(req.params.id)
    .then(function(order){
      LineItem.find({order: order._id})
        .populate('product')
          .then(function(lineItems){
            order.lineItems = lineItems;
            res.send(order);
          });
    });
});
