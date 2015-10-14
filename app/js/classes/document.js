/* 
Designless
Jake Coppinger 2015
*/

/*
This class forms the main scaffold for the operation of the app (the Controller), managing the location of boxes and updating the view when the data changes.
*/

function Document(viewObj, layoutObj) {
    this._defaultContainerID = "page1";
    this._view = viewObj;
    this._layoutObj = layoutObj;
    this._mdcontent = {};
}

Document.prototype.update = function(md) {
    var mdcontent = md.structured();
    var boxChanges = this._boxChanges(mdcontent);
    this._mdcontent = mdcontent;
    this._insertBoxes(boxChanges.new);
    this._updateBoxes(boxChanges.modified);
    this._deleteBoxes(boxChanges.deleted);

    this._view.updateOverflows(md.headings());
}

Document.prototype._insertBoxes = function(boxKeys) {
    for (var i = 0; i < boxKeys.length; i += 1) {
        this._insertTextbox(boxKeys[i]);
    }
}

Document.prototype._updateBoxes = function(boxKeys) {
    for (var i = 0; i < boxKeys.length; i += 1) {
        this._view.updateTextBox(this._mdcontent[boxKeys[i]]);
    }
}

Document.prototype._deleteBoxes = function(boxKeys) {
    for (var i = 0; i < boxKeys.length; i += 1) {
        this._view.deleteTextBox(boxKeys[i]);
        this._layoutObj.deleteTextbox(boxKeys[i]);
    }
}


Document.prototype._insertTextbox = function(boxKey) {
    var objectThis = this;
    var boxMDStructured = this._mdcontent[boxKey];
    var boxPos = undefined;
    var boxSize = undefined;
    var safeID = (boxMDStructured.heading).hashCode();
    var parentID = this._defaultContainerID;


    // Is layout of box heading defined
    if (this._layoutObj.boxExist(boxMDStructured.heading)) {
        textboxJSON = this._layoutObj.getBoxJSON(boxMDStructured.heading);
        boxSize = textboxJSON.size;
        boxPos = textboxJSON.position;
    } else {
        console.log("Box not in layout - defaulting");
        boxSize = {
            width: 100,
            height: 100
        };
        boxPos = {
            left: 0,
            top: 0
        };
    }

    // Create new textbox
    textbox = new Box({
        title: boxMDStructured.heading,
        id: safeID,
        text: boxMDStructured.markdowntext,
        parentid: parentID,
        position: boxPos,
        size: boxSize
    });


    // Is layout of box heading NOT defined (again)
    if (this._layoutObj.boxExist(boxMDStructured.heading) == false) {
        console.log("Putting box layout into layout file");
        this._layoutObj.insertTextbox(textbox);
    }

    // Insert textbox to DOM
    this._view.newTextBox(textbox, function(currentBoxTitle, newBoxPos) {
        objectThis._layoutObj.updateTextboxPosition(currentBoxTitle, newBoxPos);
    }, function(currentBoxTitle,newBoxSize) {
        objectThis._layoutObj.updateTextboxSize(currentBoxTitle, newBoxSize);
    });

}

Document.prototype._boxChanges = function(mdcontent) {
    var objectThis = this;
    var newBoxes = [];
    var modifiedBoxes = [];
    var deletedBoxes = [];

    // Looking at new keys
    for (var key in mdcontent) {
        if (key in this._mdcontent) {
            if (objectThis._boxModified(mdcontent[key], this._mdcontent[key])) {
                modifiedBoxes.push(key);
            }
        } else {
            newBoxes.push(key)
        }
    }

    // Looking at old keys
    for (var key in this._mdcontent) {
        if (key in mdcontent == false) {
            console.log(key + " has been deleted");
            deletedBoxes.push(key);
        }
    }

    return {
        "new": newBoxes,
        "modified": modifiedBoxes,
        "deleted": deletedBoxes
    }
};

Document.prototype._boxModified = function(box1, box2) {
    if (JSON.stringify(box1) == JSON.stringify(box2)) {
        return false;
    } else {
        return true;
    }
};

/*
Document.prototype.update2 = function(md) {
    var mdObject = md;
    var mdStructure = md.structured();
    var newBoxes = [];
    var objectThis = this;

    var boxesToAdd = [];

    // Iterate over each box in structure
    for (var i = 0; i < mdStructure.length; i++) {
        var structuredMD = mdStructure[i];

        // Does the box heading exist in the document
        if (this._allBoxes.indexOf(structuredMD.heading) != -1) {
            console.log(structuredMD.heading + " already exists in document");

            // Box heading does exist
            var safeID = (structuredMD.heading).hashCode();
            this._DOM_updateTextBox(structuredMD);

        } else {
            console.log(structuredMD.heading + " doesn't exist in document");
            // Box heading doesn't exist
            var boxPos = undefined;
            var boxSize = undefined;

            var safeID = (structuredMD.heading).hashCode();
            var parentID = this._defaultContainerID;


            // Is layout of box heading defined
            if (this._layoutObj.boxExist(structuredMD.heading)) {
                textboxJSON = this._layoutObj.getBoxJSON(structuredMD.heading);
                boxSize = textboxJSON.size;
                boxPos = textboxJSON.position;
            } else {
                console.log("Box not in layout - defaulting");
                boxSize = {
                    width: 100,
                    height: 100
                };
                boxPos = {
                    left: 0,
                    top: 0
                };
            }

            // Create new textbox
            textbox = new Box({
                title: structuredMD.heading,
                id: safeID,
                text: structuredMD.markdowntext,
                parentid: parentID,
                position: boxPos,
                size: boxSize
            });


            // Is layout of box heading NOT defined (again)
            if (this._layoutObj.boxExist(structuredMD.heading) == false) {
                console.log("Putting box layout into layout file");
                this._layoutObj.insertTextbox(textbox);
            }

            // Save textbox
            this._allBoxes.push(structuredMD.heading);
            console.log("All boxes now:");
            print(this._allBoxes);

            // Insert textbox to DOM
            this._DOM_newTextBox(textbox, function(currentBoxTitle, newBoxPos) {
                objectThis._layoutObj.updateTextboxPosition(currentBoxTitle, newBoxPos);

            });
        }
    }
};
*/
