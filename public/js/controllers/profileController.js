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
            for(var i = 0; i < statistics.activities.length; i++) {
                var theActivity = statistics.activities[i];

                // If not all attributes allready is set
                //if(theActivity.totalTime == "") {
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
                            url: 'api/user/'+$rootScope.user._id+'/activity/'+data[0].activity+'/update',
                            method: "POST",
                            params: activity
                        }).success(function(updatedActivity){
                            console.log(updatedActivity);
                            $http({
                                url: 'api/user/'+$rootScope.user._id+'/update',
                                method: "POST",
                                params: updatedActivity
                            }).success(function(updatedUser){
                                console.log(updatedUser);
                            });

                        });
                    });
                //}
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
            return parseInt((new Date(gpsData[gpsData.length-1].time) - new Date(gpsData[0].time)) / 1000);
        }

        function calculateAvgTime(totalTime, distance) {
            return parseInt(totalTime / (distance/1000));
        }
    });

    app.controller("activityController", function($window, $scope, $rootScope, $http) {
        // Decalre variables
        var runPath = null;
        var activity = this;
        activity.activities = [];
        $scope.currentActivity = [];
        getActivities();
        
        var setActivity = function(activityId) {
            // Set current activity
            var results = $.grep(activity.activities, function(e){ return e._id == activityId; });
            $scope.currentActivity = results[0];

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
                setCircles();
            });
        };
        this.setActivity = setActivity;

        // Get all acitivities
        function getActivities() {

            $http({
                url: 'api/user/'+$rootScope.user._id+'/activity',
                method: "GET"
            }).success(function(data){
                activity.activities = data;
                setActivity(data[0]._id);
            });
        }

        // Generates a ployline at the map
        function GenerateMapMarkers(runCoordinates) {

            if(runPath != null) runPath.setMap(null);

            runPath = new google.maps.Polyline({
                path: runCoordinates,
                geodesic: true,
                strokeColor: '#FF0000',
                strokeOpacity: 1.0,
                strokeWeight: 2
            });

            $scope.map.setCenter(runCoordinates[0]);
            $scope.map.setZoom(14);
            runPath.setMap(null);
            runPath.setMap($scope.map);
        }

        function setCircles() {
            var longest = document.getElementById('longest');
            var fastest = document.getElementById('fastest');
            var circleArray = [longest, fastest];

            for(var i=0; i<2; i++) {
                var context = circleArray[i].getContext('2d');
                context.clearRect(0, 0, circleArray[i].width, circleArray[i].height);

                var percentage
                if(i == 0) {
                    percentage = $rootScope.user.bestAvgTime / $scope.currentActivity.averageTime;
                } else {
                    percentage = $scope.currentActivity.distance / $rootScope.user.longestRun;
                }
                var degrees = percentage * 360.0;
                var radians = degrees * (Math.PI / 180);

                var x = 50;
                var y = 50;
                var r = 30;
                var s = 0;//1.5 * Math.PI;

                context.beginPath();
                context.lineWidth = 5;
                context.arc(x, y, r, s, radians, false);
                //context.closePath();
                context.stroke();
            }
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