app.config(function ($stateProvider) {
    $stateProvider
      .state('cart', {
        url: '/cart',
        templateUrl: 'js/cart/cart.html',
        controller: 'CartController',
        resolve: {
          cart: function(CartFactory){
            return CartFactory.cart();
          }
        }
    });

});

app.controller('CartController', function ($state, $scope, $http, cart, CartFactory) {
  function loadCart(){
    $scope.cart = angular.copy(cart);
  }

  function reloadCart(){
                CartFactory.cart()
                  .then(function(cart){
                    loadCart(cart);
                  });
  }

  loadCart(cart);

  $scope.update = function(lineItem){
            return $http.patch('/api/line_items/' + lineItem._id, lineItem)
              .then(function(results){
                reloadCart();
              });
  }

  $scope.checkout = function(){
    $scope.cart.checkout()
      .then(function(order){
        $state.go('orders.detail', {id: $scope.cart._id});
      });
  }



  $scope.remove = function(lineItem){
            return $http.delete('/api/line_items/' + lineItem._id)
              .then(function(results){
                reloadCart();
              });
  }
});

