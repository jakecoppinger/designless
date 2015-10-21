angular.module('designlessApp')

.controller('createController', function($scope, $timeout) {

    // Initialize Semantic UI
    $timeout(function() {
        $('.demo.menu .item').tab({
            history: false
        });

        $('.ui.dropdown')
            .dropdown();

    }, 0);

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
    });

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
    var layoutJSON; // = Lockr.get('layoutjson');
    var layout;

    if (layoutJSON) {
        layout = JSON.parse(layoutJSON);
    } else {

        layoutJSON = '{"document":{"height":210,"width":297,"layout":"absolute"},"boxes":{"Designless.io":{"size":{"width":100,"height":100},"position":{"left":0,"top":0},"style":"Papyrus"},"Example textbox":{"size":{"width":100,"height":100},"position":{"left":56,"top":56},"style":"Helvetica"}},"styles":{"Papyrus":{"font":"Papyrus","color":"#893039"},"Helvetica":{"font":"Helvetica Neue","color":"#173039"}},"fonts":["Apple Braille","Apple Color Emoji","Apple Symbols","AppleGothic","AquaKana","Courier","Geeza Pro Bold","Geeza Pro","Geneva","HelveLTMM","Helvetica LT MM","Helvetica","HelveticaNeue","HelveticaNeueDeskUI","Keyboard","LastResort","LucidaGrande","MarkerFelt","Menlo","Monaco","STHeiti Light","STHeiti Medium","Symbol","Thonburi","ThonburiBold","Times LT MM","Times","TimesLTMM","ZapfDingbats"]}';

        //'{"document":{"height":210,"width":297,"layout":"absolute"},"boxes":{},"styles":{"Default":{"font":"Arial"}}}';

        layout = JSON.parse(layoutJSON);
        console.log("using default layout");
    }

    console.log(pretty(layout));

    layoutConfig.layout = layout;

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
        var md = new Markdown($scope.markdown);
        documentObject.update(md);
    });

    $scope.styles = layout.styles;

    /*
    $scope.colors.boxcolor = {
        Papyrus: 'rgb(182, 63, 63)'
    };
    */

    //console.log($scope.styles);

    /*
    $scope.$watch("styles.Papyrus.textcolor", function(newValue, oldValue) {
        console.log($scope.styles.Papyrus.textcolor);
    });
    */

    $scope.$watch("styles", function(newValue, oldValue) {
        //console.log($scope.styles);
        viewObj.updateStyles(newValue, oldValue);
    }, true);
    /*
    $scope.boxes = {
        "NotDesignless.io": {
            "content": "<h2>Hello world</h2>"
        },
        "something else": {
            "content": "<h3>something world</h3>"
        }
    };
    */




    var content = [{
            title: 'Andorra'
        }, {
            title: 'United Arab Emirates'
        }, {
            title: 'Afghanistan'
        }, {
            title: 'Antigua'
        }, {
            title: 'Anguilla'
        }, {
            title: 'Albania'
        }, {
            title: 'Armenia'
        }, {
            title: 'Netherlands Antilles'
        }, {
            title: 'Angola'
        }, {
            title: 'Argentina'
        }, {
            title: 'American Samoa'
        }, {
            title: 'Austria'
        }, {
            title: 'Australia'
        }, {
            title: 'Aruba'
        }, {
            title: 'Aland Islands'
        }, {
            title: 'Azerbaijan'
        }, {
            title: 'Bosnia'
        }, {
            title: 'Barbados'
        }, {
            title: 'Bangladesh'
        }, {
            title: 'Belgium'
        }, {
            title: 'Burkina Faso'
        }, {
            title: 'Bulgaria'
        }, {
            title: 'Bahrain'
        }, {
            title: 'Burundi'
        }
        // etc
    ];

    $('#testsearch')
        .search({
            source: content
        });

    // Create array for style dropdown
    $scope.styleSelectOptions = [];
    $scope.styleSelectOptions.push({
        "name": "Default style",
        "id": 1
    });

    var counter = 2;
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

    $scope.select = {
        "style": "1"
    };
});