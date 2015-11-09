function setupSimpleMDE(scope) {
    // Because SimpleMDE mashes it
    // we dont want two-way
    $("#markdowninput").val(scope.markdown);
    //$scope.markdowninput = defaultStr;

    ///////////////////////////////////////
    // Initialise SimpleMDE
    scope.simplemde = new SimpleMDE({
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
    scope.simplemde.codemirror.on("change", function() {
        //var md = new Markdown(simplemde.value());
        //documentObject.update(md);
        console.log("Updating markdown");

        scope.$apply(function() {
            scope.markdown = scope.simplemde.value();
        });
    });

}