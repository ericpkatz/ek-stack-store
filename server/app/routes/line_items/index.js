'use strict';
var router = require('express').Router();
module.exports = router;
var mongoose = require('mongoose');
var LineItem = mongoose.model('LineItem');



router.post('/', function (req, res, next) {
  return LineItem.post(req.body)
    .then(function(lineItem){
      return LineItem.findById(lineItem._id)
        .populate('product order')
    })
    .then(function(lineItem){
      res.send(lineItem);
    })
    .then(null, next);
});

router.patch('/:id', function (req, res, next) {
  return LineItem.patch(req.params.id, req.body)
    .then(function(lineItem){
      return LineItem.findById(lineItem._id)
        .populate('product order')
    })
    .then(function(lineItem){
      res.send(lineItem);
    })
    .then(null, next);
});

router.delete('/:id', function (req, res) {
  return LineItem.findById(req.params.id)
    .then(function(lineItem){
      return lineItem.remove();
    })
    .then(function(){
      res.sendStatus(204);
    })
});
