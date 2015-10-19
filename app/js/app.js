angular.module('designlessApp.controllers', ['color.picker']);
angular.module('designlessApp', ['ngRoute', 'designlessApp.controllers', 'color.picker'])

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
.when('/guide', {
        templateUrl: 'pages/guide.html'
    })
    .when('/contact', {
        templateUrl: 'pages/contact.html',
        controller: 'contactController'
    });

    // use the HTML5 History API
    $locationProvider.html5Mode(true);
});
