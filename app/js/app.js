// This is where all the bindings are created for Angular,
// attaching the views to the controllers. Oh, it's a single
// page website too!


angular.module('designlessApp.controllers', ['color.picker']);
angular.module('designlessApp', ['ngRoute', 'designlessApp.controllers', 'color.picker'])

// Configure our routes
.config(function($routeProvider, $locationProvider) {
        $routeProvider.when('/', {
                templateUrl: 'pages/home.html'
            })
            .when('/about', {
                templateUrl: 'pages/about.html'
            })
            .when('/create', {
                templateUrl: 'pages/create.html',
                controller: 'createController'
            })
            .when('/guide', {
                templateUrl: 'pages/guide.html'
            })
            .when('/contact', {
                templateUrl: 'pages/contact.html'
            });

        // use the HTML5 History API
        $locationProvider.html5Mode(true);
    })
    // Great for injecting Markdown content
    .filter('to_trusted', ['$sce', function($sce) {
        return function(text) {
            return $sce.trustAsHtml(text);
        };
    }]);