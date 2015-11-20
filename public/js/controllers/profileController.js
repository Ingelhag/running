(function(){
	var app = angular.module('profileController', []); 

	app.controller("profileController", function($rootScope, $cookies){

		this.startTracking = function() {
			console.log("Lets track");
		}
	});
})();