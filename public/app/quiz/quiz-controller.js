(function () {
    'use strict';

    function QuizController($scope, $routeParams, $location, $window, data, notifier, voice) {
        $scope.quizId = $routeParams.id;
        $scope.quiz = {};
        $scope.currentQuestion = undefined;
        $scope.nextQuestionIndex = 0;
        $scope.hasAnswer = false;
        $scope.quizFinish = false;
        $scope.score = 0;
        $scope.answers = [];

        data.get('/api/quizzes/' + $scope.quizId)
            .then(function (quizResult) {
                $scope.quiz = quizResult;
            }, function (err) {
                notifier.error('No such quiz!');
                $location.path('/quizzes');
            });

        $scope.nextQuestion = function nextQuestion() {
            if ($scope.nextQuestionIndex === 0) {
                $scope.score = 0;
                $scope.quizFinish = false;
            }

            if ($scope.nextQuestionIndex === $scope.quiz.questions.length) {
                if (voice.isPlaying) {
                    voice.stop();
                }

                $scope.quizFinish = true;
                $scope.currentQuestion = undefined;
                calculateScore();
                $scope.showScore();
                $scope.nextQuestionIndex = 0;
                return;
            }

            $scope.hasAnswer = false;
            if ($scope.nextQuestionIndex === $scope.quiz.questions.length) {
                $scope.nextQuestionIndex = 0;
                $scope.currentQuestion = $scope.quiz.questions[$scope.nextQuestionIndex];
                notifier.success("Finish test!");
            }

            $scope.currentQuestion = $scope.quiz.questions[$scope.nextQuestionIndex];

            var isChrome = /Chrome/.test($window.navigator.userAgent) && /Google Inc/.test($window.navigator.vendor);
            if (isChrome) {
                voice.speak($scope.currentQuestion.text);
                for (var index = 0; index < $scope.currentQuestion.answers.length; index += 1) {
                    voice.speak($scope.currentQuestion.answers[index].text);
                }
            }

            $scope.nextQuestionIndex += 1;
        }

        $scope.addAnswerMark = function addAnswerMark(index) {
            $scope.hasAnswer = true;
            $scope.answers[$scope.nextQuestionIndex - 1] = parseInt(index);
        }

        $scope.showScore = function showScore() {
            return $scope.score;
        }

        function calculateScore() {
            for (var index = 0; index < $scope.answers.length; index += 1) {
                var answer = $scope.answers[index];
                var corectAnswerIndex = 0;
                for (var j = 0; j < $scope.quiz.questions[index].answers.length; j += 1) {
                    if ($scope.quiz.questions[index].answers[j].isCorrect) {
                        corectAnswerIndex = j;
                        break;
                    }
                }

                if (corectAnswerIndex === answer) {
                    $scope.score += 1;
                }
            }
        }

        $scope.$on("$destroy", function () {
            if (voice.isPlaying()) {
                voice.stop();
            }
        });
    }

    angular.module('app.controllers')
        .controller('QuizController', ['$scope', '$routeParams', '$location', '$window', 'data', 'notifier', 'voice', QuizController]);
} ());