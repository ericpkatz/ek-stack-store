// Instantiate all models
var mongoose = require('mongoose');
require('../../../server/db/models');
var Product = mongoose.model('Product');

var expect = require('chai').expect;

var dbURI = 'mongodb://localhost:27017/testingDB';
var clearDB = require('mocha-mongoose')(dbURI);

var supertest = require('supertest');
var app = require('../../../server/app');

describe('Products Route', function () {

	beforeEach('Establish DB connection', function (done) {
		if (mongoose.connection.db) return done();
		mongoose.connect(dbURI, done);
	});

	afterEach('Clear test database', function (done) {
		clearDB(done);
	});

	describe('get /', function () {

		var agent;

		beforeEach('create an agent', function () {
			agent = supertest.agent(app);
		});

		beforeEach('create an agent', function (done) {
      Product.create([
          { name: 'foo' },
          { name: 'bar' }
      ])
        .then(function(){
          done();
        
        })
        .then(null, done);
		});

		it('returns products in alpha order', function (done) {
			agent.get('/api/products')
				.expect(200)
        .expect(function(results){
          var products = results.body;
          expect(products.length).to.eq(2);
          expect(products[0].name).to.eq('bar');
        })
				.end(done);
		});

	});
	describe('post /', function () {

		var agent, product;

		beforeEach('create an agent', function () {
			agent = supertest.agent(app);
		});

		it('can insert a product', function (done) {
			agent.post('/api/products')
        .send({ name: 'foo' })
				.expect(200)
        .expect(function(results){
          var product = results.body;
          expect(product.name).to.eq('foo');
        })
				.end(done);
		});

	});

	describe('put /:id', function () {

		var agent, product;

		beforeEach('create an agent', function (done) {
      product = new Product({ name: 'FOO' });
      product.save(done);
		});

		beforeEach('create an agent', function () {
			agent = supertest.agent(app);
		});

		it('can update a product', function (done) {
			agent.put('/api/products/' + product._id )
        .send({ name: 'bar', price: 99 })
				.expect(200)
        .expect(function(results){
          var product = results.body;
          expect(product.name).to.eq('bar');
          expect(product.price).to.eq(99);
        })
				.end(done);
		});
	});

	describe('GET /:id', function () {

		var agent, product;

		beforeEach('create an agent', function (done) {
      product = new Product({ name: 'FOO' });
      product.save(done);
		});

		beforeEach('create an agent', function () {
			agent = supertest.agent(app);
		});

		it('can get a product', function (done) {
			agent.get('/api/products/' + product._id )
				.expect(200)
        .expect(function(results){
          var product = results.body;
          expect(product.name).to.eq('FOO');
        })
				.end(done);
		});
	});

	describe('delete /', function () {

		var agent, product;

		beforeEach('create an agent', function (done) {
      product = new Product({ name: 'FOO' });
      product.save(done);
		});

		beforeEach('create an agent', function () {
			agent = supertest.agent(app);
		});

		it('can delete a product', function (done) {
			agent.delete('/api/products/' + product._id )
				.expect(204)
        .expect(function(results){
        })
				.end(done);
		});
	});

});
