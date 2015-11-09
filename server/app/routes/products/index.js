'use strict';
var router = require('express').Router();
module.exports = router;
var mongoose = require('mongoose');
var Product = mongoose.model('Product');
var multiparty = require('connect-multiparty');
var path = require('path');
var fs = require('fs');
var _ = require('lodash');

router.use(multiparty());

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
  var update = function(params){
    return Product.post(params)
      .then(function(product){
        res.send(product);
      });
  };
  if(req.files.imageURL){
    var source = req.files.imageURL.path;
    var fileName = path.basename(req.files.imageURL.path);
    var dest = path.join(__dirname, '../../../../', 'public/images', fileName);   
    fs.rename(source, dest, function(err){
      if(err)
        return next(err);
      var params = _.extend(req.body, { imageURL: fileName});
      return update(params);
    });
  }
  else {
    return update(req.body);
  }
});

router.put('/:id', function (req, res, next) {
  var update = function(params){
    return Product.put(req.params.id, params)
      .then(function(product){
        res.send(product);
      });
  };
  if(req.files.imageURL){
    var source = req.files.imageURL.path;
    var fileName = path.basename(req.files.imageURL.path);
    var dest = path.join(__dirname, '../../../../', 'public/images', fileName);   
    fs.rename(source, dest, function(err){
      if(err)
        return next(err);
      var params = _.extend(req.body, { imageURL: fileName});
      return update(params);
    });
  }
  else {
    return update(req.body);
  }

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
