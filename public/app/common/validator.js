(function() {
    'use strict';

    function validator() {
        return {
            validateStringCharacters: function validateStringCharacters(value, symbols) {
                var isValid = true,
                    index = 0,
                    len = value.length;

                for (index = 0; index < len; index += 1) {
                    if (symbols.indexOf(value[index].toLowerCase()) < 0) {
                        isValid = false;
                        break;
                    }
                }

                return isValid;
            }
        }
    }

    angular.module('app.services')
        .factory('validator', [validator]);
} ())