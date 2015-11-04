// Instantiate all models
var mongoose = require('mongoose');
require('../../../server/db/models');
var User = mongoose.model('User');
var Product = mongoose.model('Product');
var LineItem = mongoose.model('LineItem');

var expect = require('chai').expect;

var dbURI = 'mongodb://localhost:27017/testingDB';
var clearDB = require('mocha-mongoose')(dbURI);

var supertest = require('supertest');
var app = require('../../../server/app');

describe('Cart Route', function () {

	beforeEach('Establish DB connection', function (done) {
		if (mongoose.connection.db) return done();
		mongoose.connect(dbURI, done);
	});

	afterEach('Clear test database', function (done) {
		clearDB(done);
	});

	describe('Unauthenticated request', function () {

		var guestAgent;

		beforeEach('Create guest agent', function () {
			guestAgent = supertest.agent(app);
		});

		it('should get a 401 response', function (done) {
			guestAgent.get('/api/cart')
				.expect(401)
				.end(done);
		});

	});

	describe('Authenticated request', function () {

		var loggedInAgent, cart, product;

		var userInfo = {
			email: 'joe@gmail.com',
			password: 'shoopdawoop'
		};

		beforeEach('Create a user', function (done) {
			User.create(userInfo)
        .then(function(_user){
          user = _user;
          done();
        });
		});

		beforeEach('Get Users Cart', function (done) {
			user.getCart()
        .then(function(_cart){
          cart = _cart;
          done();
        });
		});

		beforeEach('Create Product', function (done) {
      product = new Product({ name: 'Foo', price: 2.99});
      product.save()
        .then(function(){
          return LineItem.post({ order: cart._id, product: product._id, quantity: 3});
        })
        .then(function(){
          done();
        })
        .then(null, done);
		});

		beforeEach('Create loggedIn user agent and authenticate', function (done) {
			loggedInAgent = supertest.agent(app);
			loggedInAgent.post('/login').send(userInfo).end(done);
		});

		it('should get with 200 response and with a cart and line items', function (done) {
			loggedInAgent.get('/api/cart')
        .expect(200)
        .end(function (err, response) {
          if (err) return done(err);
          var _cart = response.body;
          expect(cart._id.toString()).to.eq(_cart._id);
          expect(_cart.lineItems).to.be.an('array');
          expect(_cart.lineItems[0].product.name).to.eq('Foo');
				  done();
			});
		});

	});

});
