(function () {
    'use strict';

    function MainController($scope) {
        $scope.hello = "Angular run";
        $scope.questions = [
            { text: 'Text 1', createdOn: Date.now(), category: 'other', author: "anonimus"},
            { text: 'Text 2', createdOn: Date.now(), category: 'other', author: "anonimus" },
            { text: 'Text 3', createdOn: Date.now(), category: 'other', author: "anonimus" },
            { text: 'Text 4', createdOn: Date.now(), category: 'other', author: "anonimus" },
            { text: 'Text 5', createdOn: Date.now(), category: 'other', author: "anonimus" },
        ]
    }

    angular.module('app.controllers')
        .controller('MainController', ['$scope', MainController]);
} ());