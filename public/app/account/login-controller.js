(function() {
    'use strict';

    function LoginController($scope, $location, auth, identity, notifier) {
        $scope.identity = identity;

        $scope.login = function(user) {
            auth.login(user)
                .then(function(res) {
                    if (res) {
                        notifier.success('Successful login!');
                    }
                    else {
                        notifier.error('Username/Passord combination is not valid');
                    }

                    $location.path('/');
                },
                function(err) {
                    notifier.error('Username/Passord combination is not valid');
                    $location.path('/');
                });
        }

        $scope.logout = function() {
            auth.logout()
                .then(function(res) {
                    if (res) {
                        if ($scope.user) {
                            $scope.user.username = '';
                            $scope.user.password = '';
                        }
                        $location.path('/');
                        notifier.success('Successful logout!');
                    }
                    else {
                        notifier.error('Logout error!');
                    }
                });
        }
    }

    angular.module('app.controllers')
        .controller('LoginController', ['$scope', '$location', 'auth', 'identity', 'notifier', LoginController]);
} ());