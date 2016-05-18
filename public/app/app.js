(function () {
    'use strict';

    function config($routeProvider, $locationProvider) {
        $locationProvider.html5Mode(true);

        $routeProvider
            .when('/', {
                templateUrl: '/partials/main/home',
                controller: 'MainController'
            })
            .when('/account/register', {
                templateUrl: '/partials/account/register',
                controller: 'RegisterController'
            })
            .when('/quizzes', {
                templateUrl: 'partials/quiz/quizzes',
                controller: 'QuizzesController'
            })       
            .when('/quiz/create', {
                templateUrl: 'partials/quiz/quiz-create',
                controller: 'QuizzCreateController',
                resolve: {
                    authenticate: function (auth) {
                        return auth.isAuthorizedForRole('admin');
                    }
                }
            })
            .when('/quiz/:id', {
                templateUrl: 'partials/quiz/quiz',
                controller: 'QuizController'
            })
            .when('/questions/create', {
                templateUrl: 'partials/question/question-create',
                controller: 'QuestionCreateController',
                resolve: {
                    authenticate: function (auth) {
                        return auth.isAuthorizedForRole('user');
                    }
                }
            })
            .when('/admin/users', {
                templateUrl: '/partials/admin/users-list',
                controller: 'UserListController',
                resolve: {
                    authenticate: function (auth) {
                        return auth.isAuthorizedForRole('admin');
                    }
                }
            });
    }

    var run = function run($rootScope, $location, notifier) {
        $rootScope.$on('$routeChangeError', function (ev, current, previous, rejection) {
            if (rejection === 'not authorized') {
                notifier.error('Not Authorized!');
                $location.path('/');
            }
        })
    }

    angular.module('app.services', []);
    angular.module('app.filters', []);
    angular.module('app.resources', []);
    angular.module('app.controllers', ['app.services', 'app.resources']);
    angular.module('app', ['ngResource', 'ngRoute', 'app.controllers', 'app.filters'])
        .config(['$routeProvider', '$locationProvider', config])
        .run(['$rootScope', '$location', 'notifier', run])
        .value('toastr', toastr);
} ());