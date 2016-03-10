(function(){
    'use strict';
    
    function notifier(toastr){
        return {
            success: function(message){
                toastr.success(message);
            },
            error: function(message){
                toastr.error(message);
            }
        }
    }
    
    angular.module('app.services')
        .factory('notifier', ['toastr', notifier]);
}())