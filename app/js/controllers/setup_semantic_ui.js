// Initialize Semantic UI
function setupSemanticUI(scope) {
    $('.demo.menu .item').tab({
        history: false
    });

    $('.ui.dropdown')
        .dropdown();

    // Add and delete style buttons
    $('#stylePickerPopup')
        .popup({
            on: 'click',
            position: 'top right'
        });
    $('#styleRemovePopup')
        .popup({
            on: 'click',
            position: 'top right'
        });


    document.getElementById('addStyleButton').onclick = function() {
        var text = $("#styleNameText").val();
        scope.$apply(function() {
            // Set new style defaults
            scope.styles[text] = {
                color: "rgb(0,0,0)",
                font: "Arial"
            };

            // Update select elements
            updateSelectDropdowns(scope);

            // Find style select object & make it the active one
            var styleObject = findStyleSelectObject(text, scope);
            var styleSelectIndex = styleObject.id.toString();
            scope.select.style = styleSelectIndex;
        });

        $('#stylePickerPopup').popup('hide');
    };




    document.getElementById('removeStyleButton').onclick = function() {
        console.log(findSelectedStyleSelectObject(scope.select.style,scope);


    };









}

function findStyleSelectObject(styleName, scope) {
    for (var styleIndex = 0; styleIndex < scope.styleSelectOptions.length; styleIndex += 1) {
        var style = scope.styleSelectOptions[styleIndex];
        if (style.name == styleName) {
            return style;
        }
    }
    return undefined;
}

function findSelectedStyleSelectObject(id,scope) {

    console.log(id);

}