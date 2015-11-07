app.factory('CartFactory', function($http, ReportingFactory){
  var _cart = {};
  _cart.empty = function(){
    if(!this.lineItems)
      return;
    return this.lineItems.length == 0;
  
  };

  _cart.total = function(){
    if(!this.lineItems)
      return;
    return this.lineItems.reduce(function(sum, curr){
      sum+= curr.subTotal();
      return sum;
    }, 0);
  };

  _cart.itemCount = function(){
    if(!this.lineItems)
      return;
    return this.lineItems.reduce(function(sum, lineItem){
      sum += lineItem.count;
      return sum;
    }, 0);
  };

  _cart.hasProduct = function(product){
    if(!this.lineItems)
      return;
    return _.some(this.lineItems, function(lineItem){
      return lineItem.product._id == product._id;
    });
  }

  _cart.checkout = function(product){
    var order;
    return $http.post('/api/cart/checkout')
      .then(function(results){
        order = results.data;
        ReportingFactory.reportTransaction(order);
      })
      .then(function(results){
        //reset the cart
        return cart();
      })
      .then(function(){
        return order;
      });
  }

  function cart(){
    return $http.get('/api/cart')
      .then(function(results){
        _.extend(_cart, results.data);
        _cart.lineItems.forEach(function(lineItem){
          lineItem.subTotal = function(){
            return this.price * this.count;
          }
        });
        return _cart;
      });
  }

  return {
    cart: cart 
  }

});
