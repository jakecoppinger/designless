	// create the module and name it scotchApp
	var scotchApp = angular.module('scotchApp', ['ngRoute']);

	// configure our routes
	scotchApp.config(function($routeProvider) {
	    $routeProvider

	    // route for the home page
	        .when('/', {
	        templateUrl: 'pages/home.html',
	        controller: 'mainController'
	    })

	    // route for the about page
	    .when('/about', {
	        templateUrl: 'pages/about.html',
	        controller: 'aboutController'
	    })

	    .when('/create', {
	        templateUrl: 'pages/create.html',
	        controller: 'createController'
	    })


	    // route for the contact page
	    .when('/contact', {
	        templateUrl: 'pages/contact.html',
	        controller: 'contactController'
	    });
	});

	// create the controller and inject Angular's $scope
	scotchApp.controller('mainController', function($scope) {
	    // create a message to display in our view
	    $scope.message = 'Everyone come and see how good I look!';
	});

	scotchApp.controller('createController', function($scope) {
	    console.log("Loaded create controller");

	    $scope.markdown = "# Designless.io\n*If you can use an emoticon, you can write Markdown.*\n\nDeployed frequently at [Designless.io](http://www.designless.io).\nBuilt by [Jake Coppinger](http://www.jakecoppinger.com).\n\n## Example textbox\n**This is an example textbox**\nTextboxes are created with a heading, denoted with a hash (or number of hashes\n\nSee the Markdown Guide in the menu for more information";

	    // Because SimpleMDE mashes it
	    // We dont want two-way
	    $("#markdowninput").val($scope.markdown);
	    //$scope.markdowninput = defaultStr;

	    // Initialise SimpleMDE
	    var simplemde = new SimpleMDE({
	        element: $("#markdowninput")[0],
	        spellChecker: false
	    });

	    simplemde.codemirror.on("change", function() {
	        //var md = new Markdown(simplemde.value());
	        //documentObject.update(md);
	        console.log("Updating markdown");

	        $scope.$apply(function() {
	            $scope.markdown = simplemde.value();
	        });
	    });




	    
	    











	    $scope.message = 'More creation.';
	});

	scotchApp.controller('aboutController', function($scope) {
	    $scope.message = 'Look! I am an about page.';
	});

	scotchApp.controller('contactController', function($scope) {
	    $scope.message = 'Contact us! JK. This is just a demo.';
	});