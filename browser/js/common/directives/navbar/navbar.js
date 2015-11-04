app.directive('navbar', function ($rootScope, AuthService, AUTH_EVENTS, $state, CartFactory) {

    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'js/common/directives/navbar/navbar.html',
        link: function (scope) {
          scope.showTab = function(item){
            if(item.admin)
              return scope.isAdmin();
            if(item.auth)
              return scope.isLoggedIn();
            return true;
          };
          CartFactory.cart()
            .then(function(cart){
              scope.cart = cart;
            
            });

            scope.items = [
                { label: 'Home', state: 'home' },
                { label: 'Products', state: 'products', auth: true },
                { label: 'Orders', state: 'orders', auth: true },
                { label: 'Admin', state: 'admin.products', admin: true }
            ];

            scope.user = null;

            scope.isLoggedIn = function () {
                return AuthService.isAuthenticated();
            };

            scope.isAdmin = function () {
                return AuthService.isAdmin();
            };

            scope.logout = function () {
                AuthService.logout().then(function () {
                   $state.go('home');
                });
            };

            var setUser = function () {
                AuthService.getLoggedInUser().then(function (user) {
                    scope.user = user;
                });
            };

            var removeUser = function () {
                scope.user = null;
            };

            setUser();

            $rootScope.$on(AUTH_EVENTS.loginSuccess, setUser);
            $rootScope.$on(AUTH_EVENTS.logoutSuccess, removeUser);
            $rootScope.$on(AUTH_EVENTS.sessionTimeout, removeUser);

        }

    };

});
