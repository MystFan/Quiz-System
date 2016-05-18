(function() {
    'use strict';

    function RegisterController($scope, auth, notifier, validator, $location) {
        var allowedSymbols = 'abcdefghijklmnopqrstuvwxyz0123456789';
        $scope.CONSTANTS = {
            USERNAME_MIN_LENGTH: 6,
            USERNAME_MAX_LENGTH: 20,
            PASSWORD_MIN_LENGTH: 6,
            PASSWORD_MAX_LENGTH: 20,
            FIRST_NAME_MIN_LENGTH: 2,
            FIRST_NAME_MAX_LENGTH: 50,
            LAST_NAME_MIN_LENGTH: 2,
            LAST_NAME_MAX_LENGTH: 50
        }

        $scope.register = function register(user, form) {

            if (user.password !== user.confirmPassword) {
                notifier.error('Username/Password combination is not valid');
                return;
            }
            
            if(!validator.validateStringCharacters(user.username, allowedSymbols)){
                notifier.error('Username contain invalid characters!');
                return;
            }
            if(!validator.validateStringCharacters(user.password, allowedSymbols)){
                notifier.error('Password contain invalid characters!');
                return;
            }
            if(!validator.validateStringCharacters(user.firstName, allowedSymbols)){
                notifier.error('First name contain invalid characters!');
                return;
            }
            if(!validator.validateStringCharacters(user.lastName, allowedSymbols)){
                notifier.error('Last name contain invalid characters!');
                return;
            }

            auth.register(user)
                .then(function(res) {
                    if (res.success) {
                        notifier.success('Successful register!');
                        $location.path('/');
                    }
                    else {
                        notifier.error(res.errorMessage);
                    }
                })
        }
    }

    angular.module("app.controllers")
        .controller("RegisterController", ['$scope', 'auth', 'notifier', 'validator', '$location', RegisterController])
} ())