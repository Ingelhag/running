angular.module('GpsService', []).factory('Gps', ['$http', function($http) {

    return {
        // call to get all nerds
        get : function() {
            return $http.get('/api/gps');
        },

        // call to POST and create a new nerd
        create : function(data) {
            return $http.post('/api/gps', data);
        },

        // call to DELETE a nerd
        delete : function(id) {
            return $http.delete('/api/gps/' + id);
        }
    }       
}]);