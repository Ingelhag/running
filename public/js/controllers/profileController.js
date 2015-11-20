(function(){
	var app = angular.module('profileController', []); 

	app.controller("profileController", function($scope, $rootScope, $http){


        /*** Variables ***/
        var interval;
        var status = false;
        var currentActivityId = null;

        $scope.gpsdata = null;


        /*** Functions ***/
        this.getStatus = function() {
            return status;
        }

		this.startTracking = function() {

            //Create a new activity
            $http({
                url: 'api/user/'+$rootScope.user._id+'/activity',
                method: "POST"
            }).success(function(data){
                // Save id of the activity
                currentActivityId = data._id;
            });

            // Check if we got geolocation
			if ("geolocation" in navigator) {
                status = true;

                // Save gps data every 10sec
                interval = setInterval(function() {
                    navigator.geolocation.getCurrentPosition(AddGpsData);
                }, 10000);
            } else {
                console.log("Ingen gps-data");
            }
		}

        // Stop tracking and saving gps data
        this.stopTracking = function() {
            console.log("Stop tracking");
            clearInterval(interval);
            status = false;
            currentActivityId = null;
        }

        // Add gps data to DB
        function AddGpsData(position) {
            console.log("Add gps data to db");
            if(currentActivityId != null) {
                //Create gpsdata
                $http({
                    url: 'api/user/'+$rootScope.user._id+'/activity/'+currentActivityId+'/gps',
                    method: "POST",
                    params: {lat: position.coords.latitude, lon: position.coords.longitude}
                }).success(function(data){
                    // Save id of the activity
                    $scope.gpsdata = data;
                });
            }
        }

	});
})();