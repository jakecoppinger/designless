angular.module('designlessApp.controllers', []);
angular.module('designlessApp', ['ngRoute', 'designlessApp.controllers'])

// configure our routes
.config(function($routeProvider, $locationProvider) {
    $routeProvider.when('/', {
        templateUrl: 'pages/home.html',
        controller: 'mainController'
    })

    .when('/about', {
        templateUrl: 'pages/about.html',
        controller: 'aboutController'
    })

    .when('/create', {
        templateUrl: 'pages/create.html',
        controller: 'createController'
    })

    .when('/contact', {
        templateUrl: 'pages/contact.html',
        controller: 'contactController'
    });

    // use the HTML5 History API
    $locationProvider.html5Mode(true);
});