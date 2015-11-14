// This is where everything happens.
// This Angular controller start of the Model, Controller and View class objects
// (in Markdown.js, Document.js and View.js)
// and sets up asynchronous callbacks through the setup_*.js files to
// watch for changes in variables

angular.module('designlessApp')

.controller('createController', function($scope, $timeout) {
    $timeout(function() {
        setupSemanticUI($scope);
    }, 0);

    $scope.pages = 30;

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
    setupMarkdownImportExport($scope);
    setupLayoutImportExport($scope);

    // Watch the styles variable to push style changes ino the DOM
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


    // Watch the layout variable, to update the document object
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
        console.log("Layout changed!!!!");
        console.log(this.layoutString());
        // Lockr.set('layoutjson', this.layoutString());
    });

    // Create document object
    scope.documentObject = new Document(scope.viewObj, layoutObj,scope);

    // Initially render the document
    // Create markdown object from textarea
    var initialmdObj = new Markdown(scope.markdown);

    scope.$watch("markdown", function(newValue, oldValue) {
        var md = new Markdown(scope.markdown);
        scope.documentObject.update(md);

        //updateSelectDropdowns(scope);
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


    // Select first box by default
    scope.select.box = Object.keys(scope.layout.boxes)[0];
    console.log(pretty(scope.styleSelectOptions));



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
    // AngularJS search field wants
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


function setupMarkdownImportExport(scope) {
    // A filepicker dialogue to upload markdown files
    var fileInput = document.getElementById('importMarkdown');
    fileInput.addEventListener('change', function(e) {
        var file = fileInput.files[0];
        var textType = /text.*/;

        if (file.type.match(textType)) {
            var reader = new FileReader();

            reader.onload = function(e) {
                var markdown = reader.result;
                scope.simplemde.value(markdown);
            };
            reader.readAsText(file);
        } else {
            alert("This filetype is not supported. Please import a Markdown or plain text file");
        }
    });

    // Save markdown as a .md file
    document.getElementById('exportMarkdown').onclick = function() {
        var content = scope.markdown;
        var blob = new Blob([content], {
            type: "text/plain;charset=utf-8"
        });
        saveAs(blob, "Designless document.md");
    };

    document.getElementById('loadMarkdown').onclick = function() {
        var markdown = Lockr.get('markdown');
        if (markdown) {
            scope.simplemde.value(markdown);
        } else {
            alert("Could not load Markdown from browser local storage.");
        }
    };

    // Save markdown to local storage with the help of Lockr
    document.getElementById('saveMarkdown').onclick = function() {
        Lockr.set('markdown', scope.markdown);
    };
}

function setupLayoutImportExport(scope) {
    var fileInput = document.getElementById('importLayout');
    fileInput.addEventListener('change', function(e) {
        var file = fileInput.files[0];
        var textType = /text.*/;

        if (file.type.match(textType)) {
            var reader = new FileReader();
            reader.onload = function(e) {
                var layoutJSON = reader.result;
                scope.$apply(function() {
                    scope.layout = JSON.parse(layoutJSON);
                });
            };
            reader.readAsText(file);
        } else {
            alert("This filetype is not supported. Please import a layout file created with Designless");
        }
    });

    document.getElementById('exportLayout').onclick = function() {
        var content = JSON.stringify(scope.layout, null, 2);
        var blob = new Blob([content], {
            type: "text/plain;charset=utf-8"
        });
        saveAs(blob, "Designless layout.json");
    };


    // To make sure the DOM is completely updated when importing the layout,
    // The document object is initialized with an entirely new document 
    // with one random textbox. Then the new layout is loaded in!
    document.getElementById('loadLayout').onclick = function() {
        var layoutJSON = Lockr.get('layoutjson');
        if (layoutJSON) {
            var randomHeading = "# " + stringGen(5);
            var markObj = new Markdown(randomHeading);

            scope.documentObject.update(markObj);

            scope.$apply(function() {
                scope.layout = JSON.parse(layoutJSON);
            });

            var md = new Markdown(scope.markdown);
            scope.documentObject.update(md);

        } else {
            alert("Could not load layout from browser local storage.");
        }
    };

    document.getElementById('saveLayout').onclick = function() {
        var layoutJSON = JSON.stringify(scope.layout, null, 2);
        Lockr.set('layoutjson', layoutJSON);
    };


    document.getElementById('printDocument').onclick = function() {
        var r = confirm("Make sure to set the paper size to A4 and margins to none to print accurately");
        if (r) {
            window.print();
        }
    };
}

function stringGen(len) {
    var text = " ";
    var charset = "abcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < len; i++)
        text += charset.charAt(Math.floor(Math.random() * charset.length));
    return text;
}