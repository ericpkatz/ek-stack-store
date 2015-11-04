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
        $scope.products = products;

        $scope.edit = function(index){
          $scope.editIndex = index;
          $scope.editing = angular.copy($scope.products[index]);
        };

        $scope.update = function(){
          $http.put('/api/products/' + $scope.editing._id, $scope.editing)
            .then(function(result){
              $scope.products[$scope.editIndex] = result.data;
              $scope.editIndex = null;
              $scope.editing = null;
            });
        };
      }
    });
});
