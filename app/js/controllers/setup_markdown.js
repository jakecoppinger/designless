function setupMarkdown(scope) {
    // Set up Markdown
    scope.markdown = "# Designless.io\n*If you can use an emoticon, you can write Markdown.*\n\nDeployed frequently at [Designless.io](http://www.designless.io).\nBuilt by [Jake Coppinger](http://www.jakecoppinger.com).\n\n## Example textbox\n**This is an example textbox**\nTextboxes are created with a heading, denoted with a hash (or number of hashes\n\nSee the Markdown Guide in the menu for more information";

    // Set up layout
    var layoutJSON;//  = Lockr.get('layoutjson');
    var layout;

    if (layoutJSON) {
        layout = JSON.parse(layoutJSON);
    } else {
        layoutJSON = '{"document":{"height":210,"width":297,"layout":"absolute"},"boxes":{"Designless.io":{"size":{"width":100,"height":100},"position":{"page":1,"left":0,"top":0},"style":"Default style"},"Example textbox":{"size":{"width":100,"height":100},"position":{"page":2,"left":56,"top":56},"style":"Helvetica"}},"styles":{"Default style":{"font":"Comic Sans S","color":"rgb(137, 48, 57)"},"Papyrus":{"font":"Papyrus","color":"rgb(137, 48, 57)"},"Helvetica":{"font":"Helvetica Neue","color":"#000000"}},"fonts":["Arial","Helvetica","HelveticaNeue","Papyrus","Georgia","Garamond","Gill Sans"]}';

        //'{"document":{"height":210,"width":297,"layout":"absolute"},"boxes":{},"styles":{"Default":{"font":"Arial"}}}';

        layout = JSON.parse(layoutJSON);
        console.log("using default layout");
    }


    scope.layout = layout;
}