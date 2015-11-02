app.config(function($stateProvider){
  $stateProvider
    .state('admin.users', {
      url: '/users',
      templateUrl: '/js/admin/users/users.html'
    });
});
