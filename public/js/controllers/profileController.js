(function(){
	var app = angular.module('profileController', []); 

    app.controller("statisticsController", function($http, $rootScope) {

        statistics = this;
        statistics.activities = [];

        // Fetch all activities
        $http.get('api/user/'+$rootScope.user._id+'/activity').success(function(data) {
            statistics.activities = data
        });

        // When user want to calc
        this.setStats = function() {
            // Loop through all activiteties
            for(var i = 1; i < 2; i++) {
                var theActivity = statistics.activities[i];

                // If not all attributes allready is set
                if(theActivity.totalTime == "") {
                    var gpsData = [];
                
                    // Fetch GPS data
                    $http.get('api/user/'+$rootScope.user._id+'/activity/'+theActivity._id+'/gps').success(function(data) {
                        // Create a new activity object
                        var activity = {
                            totalTime   : calculateTotalTime(data),
                            distance    : calculateDistance(data),
                            avgTime     : 0
                        };

                        activity.avgTime = calculateAvgTime(activity.totalTime, activity.distance);

                        // Save the changes
                        $http({
                            url: 'api/user/'+$rootScope.user._id+'/activity/'+theActivity._id+'/update',
                            method: "POST",
                            params: activity
                        }).success(function(data){console.log(data);});
                    });
                }
            }
        }

        function calculateDistance(data) {
            var coordinates = [];
            // Set the activity coordinates.
            for(var i=0; i<data.length; i++) {
                if(data[i].lat != "") coordinates.push({lat:parseFloat(data[i].lat), lng:parseFloat(data[i].lon)});
            }

            var path = new google.maps.Polyline({
                path: coordinates,
                geodesic: true,
            });

            return Math.floor(google.maps.geometry.spherical.computeLength(path.getPath()));
        } 

        // Returns the difference betwwen the first and the last time stamp in sec
        function calculateTotalTime(gpsData) {
            return ((new Date(gpsData[gpsData.length-1].time) - new Date(gpsData[0].time)) / 1000);
        }

        function calculateAvgTime(totalTime, distance) {
            return ((distance/1000) / (totalTime/60));
        }
    });

    app.controller("activityController", function($window, $scope, $rootScope, $http) {
        // Decalre variables
        var activity = this;
        activity.activities = [];
        $scope.currentActivity = [];
        getActivities();
        
        var setActivity = function(activityId) {
            // Set current activity
            var results = $.grep(activity.activities, function(e){ return e._id == activityId; });
            $scope.currentActivity = results[0];
            console.log(results[0]);

            // Get all gpsdata for this activity
            $http({
                url: 'api/user/'+$rootScope.user._id+'/activity/'+activityId+'/gps',
                method: "GET"
            }).success(function(data){

                // Clear all coordinates
                var runCoordinates = [];
                // Set the activity coordinates.
                for(var i=0; i<data.length; i++) {
                    if(data[i].lat != "") runCoordinates.push({lat:parseFloat(data[i].lat), lng:parseFloat(data[i].lon)});
                }
                // Generate a ployline at the map
                GenerateMapMarkers(runCoordinates);
            });
        };
        this.setActivity = setActivity;


        this.getCurrentActivity = function() {
            return currentActivity;
        }


        // Get all acitivities
        function getActivities() {

            $http({
                url: 'api/user/'+$rootScope.user._id+'/activity',
                method: "GET"
            }).success(function(data){
                $scope.currentActivity = data[0];
                setActivity(data[0]._id);
                activity.activities = data;
            });
        }

        // Generates a ployline at the map
        function GenerateMapMarkers(runCoordinates) {

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

	app.controller("trackingController", function($scope, $rootScope, $http){

        /*** Variables ***/
        $scope.status = true;
        $scope.gpsdata = null;


		this.startTracking = function() {
            //Create a new activity
            $http({
                url: 'api/user/'+$rootScope.user._id+'/activity',
                method: "POST"
            }).success(function(data){
                // Save id of the activity
                $scope.gpsdata = "https://desolate-temple-8386.herokuapp.com/api/user/"+$rootScope.user._id+"/activity/"+data._id+"/gps";
                $scope.status = false;
            });
		}

	});
})();