app.config(function($stateProvider){
  $stateProvider
    .state('admin.products', {
      url: '/products',
      templateUrl: '/js/admin/products/products.html',
      resolve: {
        products: function($http){
          return $http.get('/api/products')
            .then(function(results){
              return results.data;
            });
        }
      },
      controller: function($scope, $http, products){
        products.unshift({ name: 'insert a product', price: 0});
        $scope.products = products;

        function reset(){
          return $http.get('/api/products')
            .then(function(results){
              return results.data;
            })
            .then(function(products){
              products.unshift({ name: 'insert a product', price: 0});
              return products;
            })
            .then(function(products){
              $scope.products = products;
              $scope.editIndex = null;
              $scope.editing = null;
            });
        }

        $scope.edit = function(index){
          $scope.editIndex = index;
          $scope.editing = angular.copy($scope.products[index]);
        };

        $scope.update = function(){
          var verb = $scope.editing._id ? 'put' : 'post';
          var url = '/api/products/';
          if($scope.editing._id)
            url+= $scope.editing._id;
          $http[verb](url, $scope.editing)
            .then(function(result){
              reset();
            });
        };

        $scope.remove = function(){
          var verb = 'delete'; 
          var url = '/api/products/';
          url+= $scope.editing._id;
          $http[verb](url, $scope.editing)
            .then(function(result){
              reset();
            });
        };
      }
    });
});
