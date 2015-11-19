(function(){
	var app = angular.module('indexController', []); 

	app.run(['$rootScope', '$window', '$cookies', function($rootScope, $window, $cookies) {

		// If the someone is logged in
		if($cookies.loggedIn  != "true") {
			$cookies.loggedIn 	= false;
			$cookies.user 		= null;
		}

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

	app.controller("navController", function($rootScope, $cookies){

		// Get information from cookies
		$rootScope.user 		= JSON.parse($cookies.user);
  		$rootScope.loggedIn 	= $cookies.loggedIn;



   		this.status = function(){
   			return $rootScope.loggedIn;
   		}

   		this.logout = function(){
   			console.log("Log out");
   			$rootScope.user 	= {}
   			$rootScope.loggedIn = false;
   			$cookies.user 		= null
   			$cookies.loggedIn 	= {};
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

				$http({
						url: 'api/user/login/',
						method: "GET",
						params: newUser
				}).success(function(data){
					$rootScope.loggedIn = true;		
					$rootScope.user = data;	

					$cookies.loggedIn = true;
					$cookies.user = JSON.stringify(data);
				});
			});
		}
	});
})();