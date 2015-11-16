/* 
Designless
Jake Coppinger 2015
*/

function setupMarkdown(scope) {
    // Set up Markdown
    scope.markdown = "# Designless.io\n*If you can use an emoticon, you can write Markdown.*\n\nDeployed at [Designless.io](http://www.designless.io).\nBuilt by [Jake Coppinger](http://www.jakecoppinger.com).\n\n## Example textbox\n**This is an example textbox**\nMarkdown is a simple way of writing without distractions. Textboxes are created with a heading, denoted with a hash (or number of hashes).\n\nSee the Markdown Guide in the menu for more information";

    // Set up layout
    var layoutJSON;//  = Lockr.get('layoutjson');
    var layout;

    if (layoutJSON) {
        layout = JSON.parse(layoutJSON);
    } else {
        layoutJSON = '{"document":{"height":210,"width":297,"layout":"absolute"},"boxes":{"Designless.io":{"size":{"width":136.26591698362824,"height":117.21514800727634},"position":{"page":1,"top":24.07805523400033,"left":36.513973871341165},"style":"Default style"},"Example textbox":{"size":{"width":100.81031916652886,"height":66.41309740367124},"position":{"page":1,"top":141.29320324127667,"left":36.513973871341165},"style":"Example Style"}},"styles":{"Default style":{"font":"Helvetica","color":"rgb(0, 0, 0)","fontsize":"26.112","lineheight":"1.147","headingsize":"56.925","fontweight":"0","textalign":"left"},"Example Style":{"font":"Helvetica","color":"rgb(86, 85, 85)","fontsize":"15.943","lineheight":"1.062","opacity":"1","headingsize":"0","textalign":"left"}},"fonts":["Arial","Helvetica","HelveticaNeue","Papyrus","Georgia","Garamond","Gill Sans"]}';

        //'{"document":{"height":210,"width":297,"layout":"absolute"},"boxes":{},"styles":{"Default":{"font":"Arial"}}}';

        layout = JSON.parse(layoutJSON);
        console.log("using default layout");
    }


    scope.layout = layout;
}