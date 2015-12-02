(function(){
    var app = angular.module('homeController', []); 

    app.controller("homeMapController", function($http, $scope){
        var userData = [];
        var activitiyData = [];
        var gpsData = [];

        var heatmap = null
        var polyLine = [];

        var input = null;
        var searchBox = null; 

        $http.get('api/gps').success(function(gps){
            gpsData = gps;
        });
        $http.get('api/user').success(function(user){
            userData = user;
        });
        $http.get('api/activity').success(function(activity){
            activityData = activity;
        });

        //Range slider config
        $scope.hourFilter = {
            minValue: 0,
            maxValue: 24,
            options: {
                floor: 0,
                ceil: 24,
                step: 1,
                stepsArray:'00:00,01:00,02:00,03:00,04:00,05:00,06:00,07:00,08:00,09:00,10:00,11:00,12:00,13:00,14:00,15:00,16:00,17:00,18:00,19:00,20:00,21:00,22:00,23:00,24:00'.split(','),
                onChange: function(){
                    generateHeatmap();
                    generatePolylines();
                }
            }
        };

        //Range slider config
        $scope.ageFilter = {
            minValue: 1900,
            maxValue: 2010,
            options: {
                floor: 1900,
                ceil: 2010,
                step: 1,
                onChange: function(){
                    generateHeatmap();
                    generatePolylines();
                }
            }
        };

        //Range slider config
        $scope.monthFilter = {
            minValue: 0,
            maxValue: 11,
            options: {
                floor: 0,
                ceil: 11,
                step: 1,
                stepsArray: 'JAN,FEB,MARS,APRIL,MAJ,JUNI,JULI,AUG,SEP,OKT,NOV,DEC'.split(','),
                onChange: function(){
                    generateHeatmap();
                    generatePolylines();
                }
            }
        };

        setTimeout(function() {

            // Set center and zoom of the map 
            $scope.map.setCenter({lat:58.59074959, lng:16.17492828});
            $scope.map.setZoom(14);

            // Get the searchbox and connect it to google maps API
            input = document.getElementById('pac-input');
            searchBox = new google.maps.places.SearchBox(input);

            // When a new place in selected in the searchbox
            searchBox.addListener('places_changed', function() {

                // If nothing was found
                if(searchBox.getPlaces().length == 0) {
                    return;
                }

                // Get the first place and set the bounds.
                var place = searchBox.getPlaces()[0];
                var bounds = new google.maps.LatLngBounds();
                if (place.geometry.viewport) {
                    bounds.union(place.geometry.viewport);
                } else {
                    bounds.extend(place.geometry.location);
                } 

                // Go to the place the user serach for
                $scope.map.fitBounds(bounds);
            });

            generatePolylines();
            generateHeatmap();

        }, 2500);

        // Lopa igenom användare, hämta ut akitivitet, hämta ut gps. Går att filrera massa då!
        function generateHeatmap() {
            var heatmapData = [];

            // Loop through all users
            for(var a = 0; a < userData.length; a++) {

                // Filter: birthyear
                if(userData[a].birthYear <= $scope.ageFilter.maxValue &&
                    userData[a].birthYear >= $scope.ageFilter.minValue) {

                    for(var b = 0; b < userData[a].activities.length; b++) {
                        // Get all activities for the user
                        var activities = $.grep(activityData, function(e) { return e._id == userData[a].activities[b]; });
                        
                        // Loop through all activities
                        // Filter: hour & month
                        for(var i=0; i<activities.length; i++) {
                            if((new Date(activities[i].date)).getHours() >= $scope.hourFilter.minValue &&
                                (new Date(activities[i].date)).getHours() <= $scope.hourFilter.maxValue &&
                                (new Date(activities[i].date)).getMonth() >= $scope.monthFilter.minValue &&
                                (new Date(activities[i].date)).getMonth() <= $scope.monthFilter.maxValue) {

                                // Loop through all gps positions for the choosen activity 
                                for(var j = 0; j<activities[i].gpsData.length; j++) {
                                    var gpspoints = $.grep(gpsData, function(e) { return e._id == activities[i].gpsData[j]; });

                                    //Loop through all gpspoint found with correct ID
                                    for(var k = 0; k < gpspoints.length; k++) {
                                        if(gpspoints[k].lat != "")
                                            heatmapData.push({location:new google.maps.LatLng(parseFloat(gpspoints[k].lat), parseFloat(gpspoints[k].lon)), weight:0.1});
                                    }
                                }
                            }
                        }
                    }
                }
            }

            // Clean the heatmap
            if(heatmap != null) heatmap.setMap(null);

            // Set heatmap
            heatmap = new google.maps.visualization.HeatmapLayer({
                data: heatmapData,
                map: $scope.map,
                radius: 4,
                opacity: 0.3
            });
        }

        function generatePolylines() {

            var coordinates;
            for(var i = 0; i < activityData.length; i++){
                coordinates = [];
                for(var j = 0; j < gpsData.length; j++){
                    if(gpsData[j].activity.toString() == activityData[i]._id.toString()) {
                        if(gpsData[j].lat != "") coordinates.push({lat:parseFloat(gpsData[j].lat), lng:parseFloat(gpsData[j].lon)});
                    }
                }
                drawPolylines(coordinates);
            }
        }

        // Generates a ployline at the map
        function drawPolylines(coordinates) {

            polyLine.push(new google.maps.Polyline({
                path: coordinates,
                geodesic: true,
                map: null,
                strokeColor: '#FF0000',
                strokeOpacity: 1.0,
                strokeWeight: 2
            }));
        }

        this.toggleHeatmap = function() {
            heatmap.setMap(heatmap.getMap() ? null : $scope.map);
        }
        this.togglePolyline = function() {
            for(var i = 0; i<polyLine.length; i++) {
                polyLine[i].setMap(polyLine[i].getMap() ? null : $scope.map);
            } 
        }
    });

    app.controller("trackingController", function($scope, $rootScope, $http){

        /*** Variables ***/
        $scope.newActivity = false;
        $scope.gspLink = "";


        $scope.startTracking = function() {
            console.log("Start Tracking");
            $scope.newActivity = true;

            //Create a new activity
            $http({
                url: 'api/user/'+$rootScope.user._id+'/activity',
                method: "POST"
            }).success(function(data){
                // Save id of the activity
                $scope.gspLink = "https://desolate-temple-8386.herokuapp.com/api/user/"+$rootScope.user._id+"/activity/"+data._id+"/gps/add";
            });
        }

    });
})();