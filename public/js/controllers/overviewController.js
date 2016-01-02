(function(){
    var app = angular.module('overviewController', []); 

    app.controller("userOverviewController", function($http, $rootScope, $scope){
        var userOverview = this;
        userOverview.selectedUser = [];
        userOverview.users = [];
        userOverview.activities = [];

        // Table with the different user types
        $scope.authenicationTable = [
            {id:'0', name: "Master"},
            {id:'1', name: "Admin"},
            {id:'2', name: "User"}
        ];

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

        userOverview.changeAuthentication = function(user, newAuth) {
            // Change the category
            if(newAuth == "Master") {
                user.authentication = 0;
            } else if(newAuth == "Admin") {
                user.authentication = 1;
            } else {
                user.authentication = 2;
            }

            // Update the DB
            $http({
                url: 'api/user/'+user._id+'/update/authentication',
                method: "POST",
                params: user
            }).success(function(updatedUser){
                console.log(updatedUser);
            });
        }
    });
})();