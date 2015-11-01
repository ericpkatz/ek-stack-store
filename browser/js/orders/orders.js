app.config(function ($stateProvider) {

    // Register our *about* state.
    $stateProvider
      .state('orders', {
        url: '/orders',
        templateUrl: 'js/orders/orders.html',
        controller: 'OrdersController',
        resolve: {
          orders: function($http){
            return $http.get('/api/orders')
              .then(function(result){
                return result.data;
              });
          }
        }
    })
    .state('orders.detail', {
      url: ':id',
      templateUrl: 'js/orders/order.html',
      controller: 'OrderController',
      resolve: {
        order: function($http, $stateParams){ 
            return $http.get('/api/orders/' + $stateParams.id)
              .then(function(result){
                return result.data;
              });
        }
      }
  });

});

app.controller('OrdersController', function ($scope, orders) {
  $scope.orders = orders;
});

app.controller('OrderController', function ($scope, order) {
  $scope.order = order;
});
