app.factory('CartFactory', function($http){
  var _cart = {};
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

  function cart(){
    return $http.get('/api/cart')
      .then(function(results){
        _.extend(_cart, results.data);
        return _cart;
      });
  }


  return {
    cart: cart 
  }

});
