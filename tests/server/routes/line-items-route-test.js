// Instantiate all models
var mongoose = require('mongoose');
require('../../../server/db/models');
var Product = mongoose.model('Product');
var User = mongoose.model('User');
var Order = mongoose.model('Order');
var Promise = require('bluebird');

var expect = require('chai').expect;

var dbURI = 'mongodb://localhost:27017/testingDB';
var clearDB = require('mocha-mongoose')(dbURI);

var supertest = require('supertest');
var app = require('../../../server/app');

describe('LineItems Route', function () {

	beforeEach('Establish DB connection', function (done) {
		if (mongoose.connection.db){
      return clearDB(done);
    }
		mongoose.connect(dbURI, done);
	});

	afterEach('Clear test database', function (done) {
		clearDB(done);
	});

  describe('adding, editing, removing list items from an order', function(){
      var agent, order, product, user;

      beforeEach(function(done){
        user = new User({email: 'foo@bar.com', password: 'password'});
        var p1 = user.save()
          .then(function(){
            order = new Order({ user: user._id }); 
            return order.save();
          });
        product = new Product({ name: 'Foo ' + Math.random(), price: 5.22 });
        var p2 = product.save();

        Promise.all([p1, p2])
          .then(function(){
            done();
          });
      });


      beforeEach('create an agent', function () {
        agent = supertest.agent(app);
      });

      beforeEach(function(done){
        agent.post('/api/line_items')
          .send({ order: order._id, product: product._id, count: 3 })
          .expect(200)
          .expect(function(results){
            lineItem = results.body;
          })
          .end(done);
      });

    describe('post / adding a list item to an order', function () {

      it('count is inserted correctly', function () {
        expect(lineItem.count).to.eq(3);
      });

      it('price is inserted correctly', function () {
        expect(lineItem.price).to.eq(5.22);
      });

      it('product is inserted correctly', function () {
        expect(lineItem.product.name).to.eq(product.name);
      });

      it('order is inserted correctly', function () {
        expect(order._id.equals(lineItem.order._id)).to.be.true
      });

    });

    describe('patching / editing a line item', function () {
      beforeEach(function(done){
        product.price = 10.99;
        product.save()
          .then(function(){
            done();
          });
      });
      beforeEach(function(done){
        agent.patch('/api/line_items/' + lineItem._id)
          .send({ count: 2, product: product._id })
          .expect(200)
          .expect(function(results){
            lineItem = results.body;
          })
          .end(done);
      });

      it('count is inserted correctly', function () {
        expect(lineItem.count).to.eq(2);
      });

      it('price is inserted correctly', function () {
        expect(lineItem.price).to.eq(10.99);
      });

      it('product is inserted correctly', function () {
        expect(lineItem.product.name).to.eq(product.name);
      });

      it('order is inserted correctly', function () {
        expect(order._id.equals(lineItem.order._id)).to.be.true
      });

    });

    describe('deleting / deleting a line item', function () {
      it('line items can be deleted', function (done) {
        agent.delete('/api/line_items/' + lineItem._id)
          .send({ count: 2, product: product._id })
          .expect(204)
          .end(done);
      });

    });

  });


});
