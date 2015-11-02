app.config(function($stateProvider){
  $stateProvider
    .state('admin.products', {
      url: '/products',
      templateUrl: '/js/admin/products/products.html'
    });
});
