(function () {
    'use strict';

    function config($routeProvider, $locationProvider) {
        $locationProvider.html5Mode(true);

        $routeProvider
            .when('/', {
                templateUrl: '/partials/main/home',
                controller: 'MainController'
            })
            .when('/admin/users', {
                templateUrl: '/partials/admin/users-list',
                controller: 'UserListController',
                resolve: {
                    authenticate: function (auth) {
                        return auth.isAuthorizedForRole('admin');
                    }
                }
            });
    }

    var run = function run($rootScope, $location) {
        $rootScope.$on('$routeChangeError', function (ev, current, previous, rejection) {
            if (rejection === 'not authorized') {
                $location.path('/');
            }
        })
    }

    angular.module('app.services', []);
    angular.module('app.resources', []);
    angular.module('app.controllers', ['app.services', 'app.resources']);
    angular.module('app', ['ngResource', 'ngRoute', 'app.controllers'])
        .config(['$routeProvider', '$locationProvider', config])
        .run(['$rootScope', '$location', run])
        .value('toastr', toastr);

} ());