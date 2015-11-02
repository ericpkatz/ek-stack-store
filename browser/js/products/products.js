app.config(function ($stateProvider) {

    // Register our *about* state.
    $stateProvider
      .state('products', {
        url: '/products',
        templateUrl: 'js/products/products.html',
        controller: 'ProductsController',
        resolve: {
          cart: function(CartFactory){
            return CartFactory.cart();
          },
          products: function($http){
            return $http.get('/api/products')
              .then(function(results){
                return results.data;
              });
          }
        }
    })
    .state('product', {
      url: '/product/:id',
      templateUrl: 'js/products/product.html',
      controller: 'ProductController',
      resolve: {
        cart: function(CartFactory){
          return CartFactory.cart();
        },
        product: function($http, $stateParams){
          return $http.get('/api/products/' + $stateParams.id)
            .then(function(results){
              return results.data;
            });
        }
      }
  });

});

app.controller('ProductsController', function ($scope, products, cart) {
  $scope.cart = cart;
  $scope.products = products;
});

app.controller('ProductController', function ($scope, $http, $state, product, cart) {
  //find the lineitem with that product
  $scope.product = product;

  var lineItem = _.find(cart.lineItems, function(lineItem){
    return lineItem.product._id == product._id;
  });

  if(lineItem){
    $scope.lineItem = {
      _id: lineItem._id,
      order: cart._id,
      product: product._id,
      count: lineItem.count 
    };
  }
  else {
    $scope.lineItem = {
      order: cart._id,
      product: product._id,
      count: 1
    };
  }

  $scope.purchase = function(){
    if($scope.lineItem._id)
      $http.patch('/api/line_items/' + $scope.lineItem._id, $scope.lineItem)
        .then(function(results){
          $state.go('cart');
        });
    else
      $http.post('/api/line_items', $scope.lineItem)
        .then(function(results){
          $state.go('cart');
        });
  }
});
