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
