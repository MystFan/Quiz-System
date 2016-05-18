(function() {
    'use strict';

    function data($http, $q) {
        return {
            get: function get(url) {
                var defered = $q.defer();
                $http.get(url)
                    .success(function(res) {
                        defered.resolve(res);
                    })
                    .error(function(err) {
                        defered.reject(err);
                    })

                return defered.promise;
            },
            post: function post(url, postData) {
                var defered = $q.defer();

                $http.post(url, postData)
                    .success(function(res) {
                        defered.resolve(res);
                    })
                    .error(function(err) {
                        defered.reject(err);
                    })

                return defered.promise;
            }
        }
    }

    angular.module('app.services')
        .factory('data', ['$http', '$q', data]);
} ())