var dbURI = 'mongodb://localhost:27017/testingDB';
var clearDB = require('mocha-mongoose')(dbURI);

var sinon = require('sinon');
var expect = require('chai').expect;
var mongoose = require('mongoose');

// Require in all models.
require('../../../server/db/models');

var User = mongoose.model('User');
var Product = mongoose.model('Product');

describe('Product model', function () {

    beforeEach('Establish DB connection', function (done) {
        if (mongoose.connection.db) return done();
        mongoose.connect(dbURI, done);
    });

    afterEach('Clear test database', function (done) {
        clearDB(done);
    });

    it('should exist', function () {
        expect(Product).to.be.a('function');
    });

    describe('creating a product with a unique name', function(){
      var product;

      beforeEach(function(done){
        product = new Product({ name: 'foo', price: 4.99, imageURL: 'foobar.jpg' });
        product.save(done);
      });

      it('succeeds', function(){
        expect(product).to.be.ok;
      });

      it('product name is set', function(){
        expect(product.name).to.eq('foo');
      });

      it('price is set', function(){
        expect(product.price).to.eq(4.99);
      });

      it('imageURL is set', function(){
        expect(product.imageURL).to.eq('foobar.jpg');
      });

    });

    describe('creating a product with a duplicate unique name', function(){
      var product, err;

      beforeEach(function(done){
        new Product({ name: 'foo' }).save()
          .then(function(){
            return new Product({name: 'foo'}).save();
          })
          .then(
              function(_product){
                product = _product;
              },
              function(_err){
                err = _err;
              }
          )
          .then(done)
          .then(null, done);
      });

      it('does not succeed', function(){
        expect(product).not.to.be.ok;
      });

      it('throws an exception', function(){
        expect(err).to.be.ok;
      });
    });

    describe('url_name', function(){
      describe('name has a space', function(){
        var product;
        beforeEach(function(){
          product = new Product({name: 'Foo Bar!'});
        });
        it('gets replaced with an underscore', function(){
          expect(product.url_name).to.eq('Foo_Bar_');
        });
      
      });

    });

});
