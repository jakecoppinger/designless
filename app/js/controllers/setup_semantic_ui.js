// Initialize Semantic UI
function setupSemanticUI(scope) {
    $('.demo.menu .item').tab({
        history: false
    });

    $('.ui.dropdown')
        .dropdown();
    $('#stylePickerPopup')
        .popup({
            on: 'click',
            position: 'top right'
        });

    document.getElementById('addStyleButton').onclick = function() {

        console.log("We clicked");
        var text = $("#styleNameText").val();
        console.log(text);
        scope.$apply(function() {

            scope.styles[text] = {
                color: "rgb(0,0,0)",
                font: "Arial"
            };

        });

        console.log(scope.styles);
        $('#stylePickerPopup').popup('hide');
    };
}