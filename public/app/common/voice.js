(function () {
    'use strict';

    function voice() {
        return {
            speak: function (text) {
                responsiveVoice.speak(text);
            },
            isPlaying: function () {
                return responsiveVoice.isPlaying()
            },
            stop: function () {
                responsiveVoice.cancel();
            }
        }
    }

    angular.module('app.services')
        .factory('voice', [voice]);
} ())