(function(){
    'use strict';
    
    function UsersResource($resource){
       var usersResource = $resource('/api/users/:id', {_id: '@id'});
       
       usersResource.prototype.isAdmin = function(){
           return this.roles && this.roles.indexOf('admin') > -1;
       }
       
       return usersResource;
    }
    
    angular.module('app.resources')
        .factory('UsersResource', ['$resource', UsersResource]);
}())