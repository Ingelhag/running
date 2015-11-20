(function(){
	var app = angular.module('indexController', []); 

	app.run(['$window', '$cookies', function($window, $cookies) {

		// If the someone is logged in
		if($cookies.get('loggedIn')  != "true") {
			$cookies.put('loggedIn', false);
			$cookies.put('user', null);
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

	app.controller("mainController", function($rootScope, $cookies){

		// Get information from cookies
		$rootScope.user 		= JSON.parse($cookies.get('user'));
  		$rootScope.loggedIn 	= ($cookies.get('loggedIn') != "false");
  		console.log($rootScope.user);

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
})();