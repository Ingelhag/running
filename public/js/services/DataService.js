angular.module('DataService', []).factory('Data', ['$http', function($http) {

    return {
        // call to get all nerds
        get : function() {
            return $http.get('/api/data');
        },

        // call to POST and create a new nerd
        create : function(data) {
            return $http.post('/api/data/', data);
        },

        // call to DELETE a nerd
        delete : function(id) {
            return $http.delete('/api/data/' + id);
        }
    }       
}]);