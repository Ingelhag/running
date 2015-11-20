angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

	$routeProvider
		// home page
		.when('/', {
            templateUrl: 'views/home.html'
        })
        .when('/profile', {
            templateUrl: 'views/profile.html',
            controller: 'profileController'
        });;

	$locationProvider.html5Mode(true);

}]);