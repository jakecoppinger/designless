angular.module('designlessApp')

.controller('createController', function($scope, $timeout) {

    // Set up Markdown
    $scope.markdown = "# Designless.io\n*If you can use an emoticon, you can write Markdown.*\n\nDeployed frequently at [Designless.io](http://www.designless.io).\nBuilt by [Jake Coppinger](http://www.jakecoppinger.com).\n\n## Example textbox\n**This is an example textbox**\nTextboxes are created with a heading, denoted with a hash (or number of hashes\n\nSee the Markdown Guide in the menu for more information";

    // Set up layout
    var layoutJSON; // = Lockr.get('layoutjson');
    var layout;

    if (layoutJSON) {
        layout = JSON.parse(layoutJSON);
    } else {
        layoutJSON = '{"document":{"height":210,"width":297,"layout":"absolute"},"boxes":{"Designless.io":{"size":{"width":100,"height":100},"position":{"page":1,"left":0,"top":0},"style":"Papyrus"},"Example textbox":{"size":{"width":100,"height":100},"position":{"page":2,"left":56,"top":56},"style":"Helvetica"}},"styles":{"Default style":{"font":"Comic Sans S","color":"rgb(137, 48, 57)"},"Papyrus":{"font":"Papyrus","color":"rgb(137, 48, 57)"},"Helvetica":{"font":"Helvetica Neue","color":"#000000"}},"fonts":["Apple Braille","Apple Color Emoji","Apple Symbols","AppleGothic","AquaKana","Courier","Geeza Pro Bold","Geeza Pro","Geneva","HelveLTMM","Helvetica LT MM","Helvetica","HelveticaNeue","HelveticaNeueDeskUI","Keyboard","LastResort","LucidaGrande","MarkerFelt","Menlo","Monaco","STHeiti Light","STHeiti Medium","Symbol","Thonburi","ThonburiBold","Times LT MM","Times","TimesLTMM","ZapfDingbats"]}';

        //'{"document":{"height":210,"width":297,"layout":"absolute"},"boxes":{},"styles":{"Default":{"font":"Arial"}}}';

        layout = JSON.parse(layoutJSON);
        console.log("using default layout");
    }

    ///////////////////////////////////////

    // Initialize Semantic UI
    $timeout(function() {
        $('.demo.menu .item').tab({
            history: false
        });

        $('.ui.dropdown')
            .dropdown();
    }, 0);


    // Because SimpleMDE mashes it
    // We dont want two-way
    $("#markdowninput").val($scope.markdown);
    //$scope.markdowninput = defaultStr;


    ///////////////////////////////////////
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
    });


    // Live Markdown updating
    simplemde.codemirror.on("change", function() {
        //var md = new Markdown(simplemde.value());
        //documentObject.update(md);
        console.log("Updating markdown");

        $scope.$apply(function() {
            $scope.markdown = simplemde.value();
        });
    });

    ///////////////////////////////////////

    // Create view object
    var viewObj = new View();

    $scope.layout = layout;

    // Create layout object
    var layoutObj = new Layout(layout, viewObj.pixelsPerMM(), function() {
        //console.log("Layout changed!");
        //console.log(this.layoutString());

        Lockr.set('layoutjson', this.layoutString());
    });

    // Create document object
    var documentObject = new Document(viewObj, layoutObj);


    // Initially render the document
    // Create markdown object from textarea
    var initialmdObj = new Markdown($scope.markdown);
    //documentObject.update(initialmdObj);

    $scope.$watch("markdown", function(newValue, oldValue) {
        var md = new Markdown($scope.markdown);
        documentObject.update(md);
    });

    ///////////////////////////////////////

    // Copy the layout into Angular's scope
    $scope.fontList = layout.fonts;
    $scope.styles = layout.styles;

    $scope.$watch("styles", function(newValue, oldValue) {
        console.log("Updated styles");
        // There is a bug in the angular-color-picker import
        // (https://github.com/ruhley/angular-color-picker)
        // when the object initializes it changes the color to white.
        // Here is the slightly hacky fix.
        var defaultStyleName = 'Default style';
        if (newValue != oldValue) {
            var painfulDefault = 'rgb(255, 255, 255)';
            if (newValue[defaultStyleName].color == painfulDefault) {
                newValue[defaultStyleName].color = oldValue[defaultStyleName].color;
                viewObj.updateAllStyles(oldValue);
            } else {
                viewObj.updateStyles(newValue, oldValue);
            }
        }
    }, true);

    // Convert the fontList array to a funky dictionary that the 
    // search field wants
    var content = [];
    for (var index in $scope.fontList) {
        content.push({
            "title": $scope.fontList[index]
        });
    }

    // And initialize that search fied with the fonts for autocomplete
    $('#testsearch')
        .search({
            source: content,
            onSelect: function(result, response) {
                $scope.$apply(function() {
                    $scope.styles[$scope.selectedStyle].font = result.title;
                });
                return true;
            }
        });


    // Create array for style dropdown
    $scope.styleSelectOptions = [];

    var counter = 1;
    for (var styleName in $scope.styles) {
        $scope.styleSelectOptions.push({
            "name": styleName,
            "id": counter
        });
        counter += 1;
    }

    // Find name of selected style
    $scope.$watch("select.style", function(newValue, oldValue) {
        $scope.selectedStyle = $scope.styleSelectOptions[parseInt($scope.select.style) - 1].name;
    });

    // Always select the default style
    $scope.select = {
        "style": "1"
    };

    $scope.pages = 3;


    $scope.items = [{
        id: 0,
        label: 'aLabel'
    }, {
        id: 1,
        label: 'bLabel'
    }];

    console.log(pretty($scope.styleSelectOptions));

    $scope.selected = {
        item: $scope.styleSelectOptions[0]

    };

    // $scope.$watch("selected.item", function(newValue, oldValue) {
    //     console.log("Selected changed to ");
    //     var selectedItem = newValue;
    //     var boxName = selectedItem.name;
    //     console.log($scope.box[boxName]);
    // }, true);



    // Create array for style dropdown
    $scope.boxOptions = [];

    counter = 1;
    for (var boxName in $scope.layout.boxes) {
        $scope.boxOptions.push({
            "name": boxName,
            "style": $scope.layout.boxes[boxName].style,
            "id": counter
        });
        counter += 1;
    }

    console.log($scope.boxOptions);

    /*
    // Find name of selected style
    $scope.$watch("select.box", function(newValue, oldValue) {
        $scope.selectedBox = $scope.layout.boxes[$scope.select.box];

        console.log($scope.select.box);

        console.log($scope.selectedBox);
        //$scope.styleSelectOptions[parseInt($scope.select.style) - 1].name;
    });
        */

    $scope.$watch('layout', function(newVal, oldVal) {
        var differences = DeepDiff(newVal, oldVal);
        if (differences) {
            console.log("Updated layout!");
            documentObject.updateLayout($scope.layout);
        }
    }, true);


    // Select first box by default
    $scope.select.box = Object.keys($scope.layout.boxes)[0];

});