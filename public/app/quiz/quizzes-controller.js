(function () {
    'use strict';

    function QuizzesController($scope, data, notifier) {
        $scope.DEFAULT_PAGE_SIZE = 2;
        $scope.currentPage = 0;
        $scope.totalQuizzes = 0;
        $scope.totalPages = 0;
        $scope.pages = [];
        $scope.allQuizzes = [];
        $scope.quizzes = [];

        data.get('/api/quizzes')
            .then(function (quizzesResult) {
                $scope.allQuizzes = quizzesResult.quizzes;
                $scope.onQuizzesRequested($scope.currentPage);
            })

        $scope.onQuizzesRequested = function onQuizzesRequested(currentPage) {
            $scope.pages = [];
            $scope.totalQuizzes = $scope.allQuizzes.length;
            $scope.totalPages = Math.ceil($scope.totalQuizzes / $scope.DEFAULT_PAGE_SIZE);
            $scope.currentPage = currentPage;
            $scope.quizzes = $scope.allQuizzes.slice(currentPage * $scope.DEFAULT_PAGE_SIZE, (currentPage * $scope.DEFAULT_PAGE_SIZE) + $scope.DEFAULT_PAGE_SIZE);

            for (var index = 1; index <= $scope.totalPages; index += 1) {
                $scope.pages.push(index);
            }
        }
    }

    angular.module('app.controllers')
        .controller('QuizzesController', ['$scope', 'data', 'notifier', QuizzesController]);
} ());