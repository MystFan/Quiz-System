(function() {
    'use strict';

    function QuestionCreateController($scope, $location, notifier, data) {
        $scope.CONSTANTS = {
            QUESTION_TEXT_MINLENGTH: 10,
            ANSWER_TEXT_MINLENGTH: 2
        };

        data.get('/api/categories')
            .then(function(categoriesResult) {
                $scope.categories = categoriesResult.categories.map(function(category) {
                    return category.text;
                });
            }, function(err) {
                console.log(err);
            })


        $scope.createQuestion = function createQuestion(question, form) {
            if (!form.$valid) {
                notifier.error('Question not created!');
            }

            if(!question.index){
                notifier.error('Not marked correct answer!');
                return;
            }
            
            var corectAnswerIndex = parseInt(question.index);
            var answers = [];
            for (var key in question.answers) {
                if (question.answers.hasOwnProperty(key)) {
                    var answer = question.answers[key];
                    if(answer.text.length > $scope.CONSTANTS.ANSWER_TEXT_MINLENGTH){
                        answers.push(answer.text);
                    }
                }
            }
            
            question.answers = answers;

            data.post('/api/questions', question)
                .then(function(result) {
                    $location.path('/questions');                    
                    notifier.success('Question successfully created!');
                }, function (err) {
                    $location.path('/questions'); 
                    notifier.error('Cannot create question!');
                });
        }
    }

    angular.module('app.controllers')
        .controller('QuestionCreateController', ['$scope', '$location', 'notifier', 'data', QuestionCreateController]);
} ())