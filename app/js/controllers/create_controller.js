angular.module('designlessApp')

.controller('createController', function($scope) {
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

    // Set Markdown to treat newline as a <br>
    // with Github Flavoured Markdown
    marked.setOptions({
        gfm: true,
        breaks: true
    })

    // Work out pixels per inch
    var div = $("<div>").css({
        position: "absolute",
        left: "100mm",
        top: "100mm"
    }).appendTo(document.body);
    var pos = div.offset();
    div.remove();

    var pixelsPerMM = {
        x: pos.left / 100,
        y: pos.top / 100
    };

    // Create markdown object from textarea
    var initialmdObj = new Markdown($scope.markdown);

    var layoutConfig = {
        "ppm": pixelsPerMM.x
    };

    // Set up layout from localstorage if possible
    var localStorageLayout = Lockr.get('layoutjson');
    //console.log(localStorageLayout);
    if (localStorageLayout) {
        console.log("using local storage layout");
        layoutConfig["layout"] = JSON.parse(localStorageLayout);
    } else {
        console.log("using default layout");
    }

    // Create layout object
    var layoutObj = new Layout(function() {
        //console.log("Layout changed!");
        console.log(this.layoutString());

        Lockr.set('layoutjson', this.layoutString());
    }, layoutConfig);

    // Create view object
    var viewObj = new View(pixelsPerMM.x);

    // Create document object
    var documentObject = new Document(viewObj, layoutObj);

    // Initially render the document
    documentObject.update(initialmdObj);




    // Live Markdown updating
    simplemde.codemirror.on("change", function() {
        //var md = new Markdown(simplemde.value());
        //documentObject.update(md);
        console.log("Updating markdown");

        $scope.$apply(function() {
            $scope.markdown = simplemde.value();
        });
    });




    $scope.$watch("markdown", function(newValue, oldValue) {
        //console.log($scope.markdown);

        var md = new Markdown($scope.markdown);
        documentObject.update(md);


    });




});