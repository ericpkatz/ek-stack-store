'use strict';
var router = require('express').Router();
module.exports = router;
var mongoose = require('mongoose');
var Product = mongoose.model('Product');


router.get('/', function (req, res) {
  return Product.find()
    .sort('name')
    .then(function(products){
      res.send(products);
    });
});

router.get('/:id', function (req, res) {
  return Product.findById(req.params.id)
    .then(function(product){
      res.send(product);
    });
});

router.post('/', function (req, res, next) {
  return Product.post(req.body)
    .then(function(product){
      res.send(product);
    }, next);
});

router.put('/:id', function (req, res) {
  return Product.put(req.params.id, req.body)
    .then(function(product){
      res.send(product);
    });
});

router.delete('/:id', function (req, res) {
  return Product.findById(req.params.id)
    .then(function(product){
      return product.remove();
    })
    .then(function(){
      res.sendStatus(204);
    })
});
