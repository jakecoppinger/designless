//$(document).ready(function() {


function mainFunction() {

	console.log("Main");

    var defaultStr = "# Designless.io\n*If you can use an emoticon, you can write Markdown.*\n\nDeployed frequently at [Designless.io](http://www.designless.io).\nBuilt by [Jake Coppinger](http://www.jakecoppinger.com).\n\n## Example textbox\n**This is an example textbox**\nTextboxes are created with a heading, denoted with a hash (or number of hashes\n\nSee the Markdown Guide in the menu for more information";

    $("#markdowninput").val(defaultStr);
    // Set up markdown textarea
    simplemde = new SimpleMDE({
        element: $("#markdowninput")[0],
        spellChecker: false
    });

    simplemde.render();

    
    return 0;
}
//});