(function() {
    'use strict';

    function startFrom() {
        return function(input, start) {
            if(!Array.isArray(input)){
                return;
            }

            start = +start;
            return input.slice(start);
        }
    }

    angular.module('app.filters')
        .filter('startFrom', [startFrom]);
} ())