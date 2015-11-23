(function(){
	var app = angular.module('profileController', []); 

    app.controller('mapController', function($scope, $http, $timeout, $rootScope) 
    {
        var runCoordinates = [];
        $http({
            url: 'api/user/'+$rootScope.user._id+'/activity',
            method: "GET"
        }).success(function(data){
            $http({
                url: 'api/user/'+$rootScope.user._id+'/activity/'+data[0]._id+'/gps',
                method: "GET"
            }).success(function(data){
                // Save id of the activity
                for(var i=0; i<data.length; i++) {
                    runCoordinates.push({lat:parseFloat(data[i].lat), lng:parseFloat(data[i].lon)});
                    console.log(data[i].lon);
                }
                console.log(runCoordinates.length);
                GenerateMapMarkers();
            });
        });

        function GenerateMapMarkers() {

            var runPath = new google.maps.Polyline({
                path: runCoordinates,
                geodesic: true,
                strokeColor: '#FF0000',
                strokeOpacity: 1.0,
                strokeWeight: 2
                });

            $scope.map.setCenter(runCoordinates[0]);
            $scope.map.setZoom(14);
            runPath.setMap($scope.map);
        }
    });

    app.controller("activityController", function($window, $scope, $rootScope, $http) {
        var activity = this;
        activity.activities = [];

        //Get all activities for the user
        $http({
            url: 'api/user/'+$rootScope.user._id+'/activity',
            method: "GET"
        }).success(function(data){
            // Save id of the activity
            activity.activities = data;
        });

    });

	app.controller("trackingController", function($scope, $rootScope, $http){

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
                status = true
            });

   //          // Check if we got geolocation
			// if ("geolocation" in navigator) {
   //              status = true;

   //              // Save gps data every 10sec
   //              interval = setInterval(function() {
   //                  navigator.geolocation.getCurrentPosition(AddGpsData);
   //              }, 10000);
   //          } else {
   //              console.log("Ingen gps-data");
   //          }
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