(function () {
    'use strict';

    function UserListController($scope, UsersResource){
        $scope.users = UsersResource.query();
    }

    angular.module('app.controllers')
        .controller('UserListController', ['$scope', 'UsersResource', UserListController]);
} ());