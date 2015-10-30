var dbURI = 'mongodb://localhost:27017/testingDB';
var clearDB = require('mocha-mongoose')(dbURI);

var sinon = require('sinon');
var expect = require('chai').expect;
var mongoose = require('mongoose');

// Require in all models.
require('../../../server/db/models');

var User = mongoose.model('User');
var Product = mongoose.model('Product');
var Order = mongoose.model('Order');
var LineItem = mongoose.model('LineItem');

describe('LineItem model', function () {

    beforeEach('Establish DB connection', function (done) {
        if (mongoose.connection.db) return done();
        mongoose.connect(dbURI, done);
    });

    afterEach('Clear test database', function (done) {
        clearDB(done);
    });

    it('should exist', function () {
        expect(LineItem).to.be.a('function');
    });

   var product, order;

    beforeEach(function(done){
        product = new Product({name: 'foo' + Math.random(), price: 3.99});
        product.save()
          .then(function(){
            done();
          });
    
    });

    beforeEach(function(done){
        order = new Order();
        order.save()
          .then(function(){
            done();
          });
    
    });

    describe('relations', function(){
      var lineItem;

      beforeEach(function(done){

          lineItem = new LineItem({product: product._id, order: order._id});
          lineItem.save()
          .then(function(){
            return LineItem.findById(lineItem._id).populate('product order'); 
          })
          .then(function(_lineItem){
            lineItem = _lineItem;
            done();
          })
          .then(null, done);
      });

      it('should have a product', function(){
        expect(lineItem.product.equals(product)).to.be.ok;
      });

      it('should have an order', function(){
        expect(lineItem.order.equals(order)).to.be.ok;
      });

      it('should have a price equal to the price of the product', function(){
        expect(lineItem.price).to.eq(product.price);
      });

    
    });


});
