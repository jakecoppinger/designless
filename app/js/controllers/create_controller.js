angular.module('designlessApp')

.controller('createController', function($scope, $timeout) {
    $timeout(function() {
        setupSemanticUI($scope);
    }, 0);

    $scope.pages = 3;

    setupMarkdown($scope);
    setupSimpleMDE($scope);
    createDocumentObject($scope);

    $scope.fontList = $scope.layout.fonts;
    $scope.styles = $scope.layout.styles;

    setupFontSelect($scope);

    // Always select the default style
    $scope.select = {
        "style": "1"
    };

    updateSelectDropdowns($scope);


    setupMarkdownUploader($scope);

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
                $scope.viewObj.updateAllStyles(oldValue);
            } else {
                $scope.viewObj.updateStyles(newValue, oldValue);
            }
        }
    }, true);


    $scope.$watch('layout', function(newVal, oldVal) {
        var differences = DeepDiff(newVal, oldVal);
        if (differences) {
            console.log("Updated layout!");
            $scope.documentObject.updateLayout($scope.layout);
        }
    }, true);
});

function createDocumentObject(scope) {
    // Create view object
    scope.viewObj = new View();

    // Create layout object
    var layoutObj = new Layout(scope.layout, scope.viewObj.pixelsPerMM(), function() {
        //console.log("Layout changed!");
        //console.log(this.layoutString());

        Lockr.set('layoutjson', this.layoutString());
    });

    // Create document object
    scope.documentObject = new Document(scope.viewObj, layoutObj);

    // Initially render the document
    // Create markdown object from textarea
    var initialmdObj = new Markdown(scope.markdown);

    scope.$watch("markdown", function(newValue, oldValue) {
        var md = new Markdown(scope.markdown);
        scope.documentObject.update(md);
    });

}

function updateSelectDropdowns(scope) {
    // Create array for style dropdown
    scope.styleSelectOptions = [];

    var counter = 1;
    for (var styleName in scope.styles) {
        scope.styleSelectOptions.push({
            "name": styleName,
            "id": counter
        });
        counter += 1;
    }

    // Find name of selected style
    scope.$watch("select.style", function(newValue, oldValue) {
        scope.selectedStyle = scope.styleSelectOptions[parseInt(scope.select.style) - 1].name;
        // Disable or enable the delete style button if default 
        // is selected.
        if (scope.selectedStyle == "Default style") {
            $("#styleRemovePopup").addClass("disabled");
        } else {
            $("#styleRemovePopup").removeClass("disabled");
        }
    });

    /////////////////////////////

    // Select first box by default
    scope.select.box = Object.keys(scope.layout.boxes)[0];

    console.log(pretty(scope.styleSelectOptions));

    // scope.selected = {
    //     item: scope.styleSelectOptions[0]
    // };

    // Create array for style dropdown
    scope.boxOptions = [];

    counter = 1;
    for (var boxName in scope.layout.boxes) {
        scope.boxOptions.push({
            "name": boxName,
            "style": scope.layout.boxes[boxName].style,
            "id": counter
        });
        counter += 1;
    }

    console.log(scope.boxOptions);
}

function setupFontSelect(scope) {
    // Convert the fontList array to a funky dictionary that the 
    // search field wants
    var content = [];
    for (var index in scope.fontList) {
        content.push({
            "title": scope.fontList[index]
        });
    }

    // And initialize that search fied with the fonts for autocomplete
    $('#testsearch')
        .search({
            source: content,
            onSelect: function(result, response) {
                scope.$apply(function() {
                    scope.styles[scope.selectedStyle].font = result.title;
                });
                return true;
            }
        });
}

function setupMarkdownUploader(scope) {

    var fileInput = document.getElementById('markdownFileInput');
    var fileDisplayArea = document.getElementById('fileDisplayArea');

    fileInput.addEventListener('change', function(e) {
        var file = fileInput.files[0];
        var textType = /text.*/;

        if (file.type.match(textType)) {
            var reader = new FileReader();

            reader.onload = function(e) {
                //fileDisplayArea.innerText = reader.result;
               

                    var markdown = reader.result

                    
                // scope.$apply(function() {
                //     scope.markdown = markdown;
                // });


                    scope.simplemde.value(markdown);


            }

            reader.readAsText(file);
        } else {
            alert("This filetype is not supported. Please import a Markdown or plain text file");




        }
    });

}