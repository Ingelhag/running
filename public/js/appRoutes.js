angular.module('appRoutes', []).config(['$stateProvider','$urlRouterProvider', '$locationProvider', function($stateProvider,$urlRouterProvider,$locationProvider) {

    $urlRouterProvider.otherwise("/");


    $stateProvider
    .state('home', {
        url: '/',
        templateUrl: './views/home.html'
    })
    .state('profile', {
        url: '/profile',
        templateUrl: './views/profile.html',
        controller: 'activityController',
        controllerAs: 'activity'
    })
    .state('overview', {
        url: '/overview',
        templateUrl: './views/overview.html',
        controller: "userOverviewController",
        controllerAs: 'userOverview'
    });
}]);

