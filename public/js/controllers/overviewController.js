(function(){
    var app = angular.module('overviewController', []); 

    app.controller("userOverviewController", function($http, $rootScope){
        var userOverview = this;
        userOverview.selectedUser = [];
        userOverview.users = [];
        userOverview.activities = [];

        $http.get("api/user").success(function(data){
            userOverview.users = data;
            selectUser(data[0]._id);
        });

        $http.get("api/activity").success(function(data){
            userOverview.activities = data;
        });

        // External functions
        var selectUser = function(userId) {
            var results = $.grep(userOverview.users, function(e){ return e._id == userId; });
            userOverview.selectedUser = results[0];
            console.log(userOverview.selectedUser);
        }
        this.selectUser = selectUser;
    });
})();