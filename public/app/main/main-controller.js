(function () {
    'use strict';

    function MainController($scope) {
        $scope.year = (new Date()).getFullYear();

    }

    angular.module('app.controllers')
        .controller('MainController', ['$scope', MainController]);
} ());