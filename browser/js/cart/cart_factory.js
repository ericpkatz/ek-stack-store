app.factory('CartFactory', function($http){
  var _cart = {};
  _cart.empty = function(){
    if(!this.lineItems)
      return;
    return this.lineItems.length == 0;
  
  }
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
      })
      .then(function(results){
        return cart();
      })
      .then(function(){
        //record the transaction
        ga('require', 'ecommerce');
        ga('ecommerce:addTransaction', {
          'id': '1234',                     // Transaction ID. Required.
          'affiliation': 'Acme Clothing',   // Affiliation or store name.
          'revenue': '11.99',               // Grand Total.
          'shipping': '5',                  // Shipping.
          'tax': '1.29'                     // Tax.
        });
        ga('ecommerce:addItem', {
          'id': '1234',                     // Transaction ID. Required.
          'name': 'Fluffy Pink Bunnies',    // Product name. Required.
          'sku': 'DD23444',                 // SKU/code.
          'category': 'Party Toys',         // Category or variation.
          'price': '11.99',                 // Unit price.
          'quantity': '1'                   // Quantity.
        });
        ga('ecommerce:send');
        return order;
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
