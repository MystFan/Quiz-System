(function () {
    'use strict';

    function auth($http, $q, identity, UsersResource) {

        return {
            login: function (user) {
                var defered = $q.defer();

                $http.post('/login', user)
                    .success(function (res) {
                        if (res.success) {
                            var user = new UsersResource();
                            angular.extend(user, res.user);
                            identity.currentUser = user;
                            defered.resolve(true);
                        }
                        else {
                            defered.resolve(false);
                        }
                    })
                    .error(function (err) {
                        defered.reject(err);
                    });

                return defered.promise;
            },
            logout: function () {
                var defered = $q.defer();

                $http.post('/logout')
                    .success(function (res) {
                        if (res.success) {
                            identity.currentUser = undefined;
                            defered.resolve(true);
                        }
                        else {
                            defered.resolve(false);
                        }
                    })
                    .error(function (err) {
                        defered.reject(err);
                    });

                return defered.promise;
            },
            isAuthorizedForRole: function(role){
                if(identity.isAuthorizedForRole(role)){ //
                    return true;
                }
                else{
                    return $q.reject('not authorized');
                }
            }
        }
    }

    angular.module('app.services')
        .factory('auth', ['$http', '$q', 'identity', 'UsersResource', auth]);
} ())