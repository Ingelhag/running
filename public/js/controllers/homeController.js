(function(){
    var app = angular.module('homeController', []); 

    app.controller("homeMapController", function($http, $scope){
        var userData = [];
        var activitiyData = [];
        var gpsData = [];

        var heatmap = null,polyLine = [];

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
        // $scope.slider = {
        //     minValue: 0,
        //     maxValue: 24,
        //     options: {
        //         floor: 0,
        //         ceil: 24,
        //         step: 1,
        //         onChange: function(){
        //             generateHeatmap();
        //             generatePolylines();
        //         }
        //     }
        // };

        setTimeout(function(){
            $scope.map.setCenter({lat:58.59074959, lng:16.17492828});
            $scope.map.setZoom(14);

            generatePolylines();
            generateHeatmap();

        }, 2000);

        // Lopa igenom användare, hämta ut akitivitet, hämta ut gps. Går att filrera massa då!
        function generateHeatmap() {
            var heatmapData = [];
            for(var i=0; i<gpsData.length; i++) {
                if(gpsData[i].lat != "")
                    heatmapData.push({location:new google.maps.LatLng(parseFloat(gpsData[i].lat), parseFloat(gpsData[i].lon)), weight:0.1});
            } 

            if(heatmap != null) heatmap.setMap(null);

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

            $scope.map.setCenter({lat:58.59,lng:16.17});
            $scope.map.setZoom(14);


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