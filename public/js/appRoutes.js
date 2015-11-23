angular.module('appRoutes', []).config(['$stateProvider','$urlRouterProvider', '$locationProvider', function($stateProvider,$urlRouterProvider,$locationProvider) {

    $urlRouterProvider.otherwise("/");


    $stateProvider
    .state('home', {
        url: '/',
        templateUrl: './views/home.html'
    })
    .state('profile', {
        url: '/profile',
        templateUrl: './views/profile.html'
    });
}]);

