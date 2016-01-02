(function(){
	var app = angular.module('profileController', []); 

    app.controller("activityController", function($window, $scope, $rootScope, $http) {
        // Decalre variables
        var runPath = null;
        var activity = this;
        activity.activities = [];
        activity.currentActivity = [];

        // How to sort the list
        var descAsc = "-";
        var sortBy = "date"

        // Run in the begining
        getActivities();

        this.setSort = function(sort) {
            // Set asc of dec
            if (sortBy == sort) descAsc = (descAsc == "-")?"":"-";

            // Set which attribut the list should be sorted by
            sortBy  = sort;
        }

        this.getSort = function() {
            return descAsc+sortBy;
        }
        
        var setActivity = function(activityId) {
            // Set current activity
            var results = $.grep(activity.activities, function(e){ return e._id == activityId; });
            activity.currentActivity = results[0];

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
                    percentage = activity.currentActivity.distance / $rootScope.user.longestRun;
                } else {
                    percentage = $rootScope.user.bestAvgTime / activity.currentActivity.averageTime;
                }
                var degrees = percentage * 360.0;
                var radians = degrees * (Math.PI / 180);

                var x = 60;
                var y = 50;
                var r = 30;
                var s = 0;//1.5 * Math.PI;
                
                context.fillStyle = "black";
                context.font = "bold 15px Arial";
                context.fillText(parseInt(percentage*100) + "%", 45, 55);

                context.beginPath();
                context.lineWidth = 25;
                context.arc(x, y, r, s, radians, false);
                context.stroke();
            }
        }

        $scope.getTotalLength = function() {
            var totalLength = 0;
            for(var i = 0; i < activity.activities.length; i++) {
                totalLength += parseFloat(activity.activities[i].distance);
            }
            return totalLength;
        }
        $scope.getTotalDuration = function() {
            var totalDuration = 0;
            for(var i = 0; i < activity.activities.length; i++) {
                totalDuration += parseFloat(activity.activities[i].totalTime);
            }
            return totalDuration;
        }
    });
})();