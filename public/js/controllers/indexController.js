(function(){
	var app = angular.module('indexController', []); 

	app.run(['$window', '$cookies', function($window, $cookies) {

		// If the someone is logged in
		if($cookies.get('loggedIn')  != "true") {
			$cookies.put('loggedIn', false);
			$cookies.put('user', null);
		}

		// Facebook init
		window.fbAsyncInit = function() {
		    FB.init({
		      appId      : '435155786609216',
		      xfbml      : true,
		      version    : 'v2.5'
		    });
		  };

        (function(d, s, id){
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {return;}
            js = d.createElement(s); js.id = id;
            js.src = "//connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));


	}]);

	app.controller("mainController", function($rootScope, $cookies){

		// Get information from cookies
		$rootScope.user 		= JSON.parse($cookies.get('user'));
  		$rootScope.loggedIn 	= ($cookies.get('loggedIn') != "false");

  		// Returns true or false, status of signed in
   		this.status = function(){
   			return $rootScope.loggedIn;
   		}

   		// Logout from application
   		this.logout = function(){
   			console.log("Log out");
   			$rootScope.user 	= null;
   			$rootScope.loggedIn = false;
   			$cookies.put('loggedIn', false);
			$cookies.put('user', null);
   		}
	});

	app.controller("loginController", function($http, $rootScope, $cookies) {
		// When click on facebook login button
		this.login = function() {
			console.log("Try to login with facebook");
			FB.login(function(response) {
				statusChangeCallback(response);
			}, {scope: 'email,user_likes'});
		};

		// This is called with the results from from FB.getLoginStatus().
		function statusChangeCallback(response) {
			console.log('statusChangeCallback');
			if (response.status === 'connected') {
				console.log("connected");
				login();
			} else if (response.status === 'not_authorized') {
				// The person is logged into Facebook, but not your app.
				console.log("not_authorized");
			} else {
				// The person is not logged into Facebook, so we're not sure if
				// they are logged into this app or not.
				console.log("Not logged in");
			}
		}

		function login() {
			FB.api('/me', {fields: 'last_name,email,first_name'}, function(response) {

				// Create a user
				var newUser = {
					firstName: 		response.first_name,
					lastName: 		response.last_name,
					email: 			response.email,
				}

				// Create a new user OR log in the user
				$http({
						url: 'api/user/login/',
						method: "GET",
						params: newUser
				}).success(function(data){
					$rootScope.loggedIn = true;
					$rootScope.user = data;

					$cookies.put('loggedIn', true);
					$cookies.put('user', JSON.stringify(data));
				});
			});
		}
	});

	app.filter('secondsToDateTime', function() {
	    return function(seconds) {
	        var d = new Date(0,0,0,0,0,0,0);
	        d.setSeconds(seconds);
	        return d;
	    };
	});

	app.controller("statisticsController", function($http, $rootScope) {
        // Fetch all activities
        if($rootScope.user != null) {
            $http.get('api/user/'+$rootScope.user._id+'/activity').success(function(data) {
                setStats(data);
            });
        }

        // When user want to calc
        function setStats(activities) {
            console.log("Check stats");
            // Loop through all activiteties
            for(var i = 0; i < activities.length; i++) {
                var theActivity = activities[i];

                // If not all attributes allready is set
                if(theActivity.totalTime == "") {
                    console.log("Update stats");
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
                            $http({
                                url: 'api/user/'+$rootScope.user._id+'/update',
                                method: "POST",
                                params: updatedActivity
                            }).success(function(updatedUser){
                                $rootScope.user = updatedUser;
                            });

                        });
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
            return parseInt((new Date(gpsData[gpsData.length-1].time) - new Date(gpsData[0].time)) / 1000);
        }

        function calculateAvgTime(totalTime, distance) {
            return parseInt(totalTime / (distance/1000));
        }
    });
})();