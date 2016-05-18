(function (params) {
    'use strict';

    function QuizzCreateController($scope, $location, data, notifier) {
        var QUIZ_QUESTIONS_MIN_LENGTH = 3;
        $scope.questions = {};
        $scope.currentPage = 0;
        $scope.pageSize = 2;
        $scope.totalQuestions = 0;
        $scope.quizQuestions = [];

        $scope.numberOfPages = function () {
            return Math.ceil($scope.totalQuestions / $scope.pageSize);
        }

        $scope.onCategoryChanged = function onCategoryChanged(category) {

            data.get('/api/questions?category=' + category)
                .then(function (questions) {
                    $scope.questions = questions;
                    $scope.totalQuestions = $scope.questions.length;
                })
        }

        $scope.onCategoryChanged();

        $scope.createQuiz = function createQuiz(quiz, form) {
            var quizCategory = quiz.category.toLowerCase();
            var isSameCategory = true;

            for (var index = 0, len = $scope.quizQuestions.length; index < len; index += 1) {
                if ($scope.quizQuestions[index].category.toLowerCase() !== quizCategory) {
                    isSameCategory = false;
                    break;
                }
            }

            if (!isSameCategory) {
                notifier.error('The questions in the quiz to be the same category!');
                return;
            }

            if ($scope.quizQuestions.length < QUIZ_QUESTIONS_MIN_LENGTH) {
                notifier.error('Quiz must contain at least ' + QUIZ_QUESTIONS_MIN_LENGTH + ' questions!');
                return;
            }
            
            if (form.$valid) {
                quiz.questions = $scope.quizQuestions;
                data.post('/api/quiz-create', quiz)
                    .then(function (qreatedQuiz) {
                        notifier.success("The quiz has been successfully created!");
                        $location.path('/quizzes');
                    })
            }
            else {
                notifier.error("Invalid quiz data!");
            }
        }

        data.get('/api/categories')
            .then(function (categoriesResult) {
                $scope.categories = categoriesResult.categories.map(function (category) {
                    return category.text;
                });
            }, function (err) {
                console.log(err);
            })

        $scope.addQuizQuestion = function addQuizQuestion(question) {
            var hasQuestion = $scope.quizQuestions.some(function (item) {
                return question._id === item._id;
            });

            if (hasQuestion) {
                notifier.error("Question is already added!");
                return;
            }

            $scope.quizQuestions.push(question);
            notifier.success("The question has been successfully added!");
        }
        
        $scope.removeQuestion = function removeQuestion(question){
            $scope.quizQuestions = $scope.quizQuestions.filter(function (item) {
                return question._id !== item._id;
            });
        }

        $scope.clearQuiz = function clearQuiz() {
            $scope.quizQuestions = [];
        }

        $scope.deleteQuestion = function deleteQuestion(question) {
            data.post('/api/questions/remove', { id: question._id })
                .then(function (removedQuestion) {
                    var index = $scope.questions.indexOf(question);
                    $scope.questions[index] = undefined;
                    notifier.success("The question has been successfully removed!");
                }, function (err) {
                    notifier.error("Question can`t be removed!");
                })
        }
    }

    angular.module('app.controllers')
        .controller('QuizzCreateController', ['$scope', '$location', 'data', 'notifier', QuizzCreateController])
} ())