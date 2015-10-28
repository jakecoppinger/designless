/* 
Designless
Jake Coppinger 2015
*/

/*
This class forms the main scaffold for the operation of the app (the Controller), managing the location of boxes and updating the view when the data changes.
*/

function Document(viewObj, layoutObj) {
    this._defaultContainerID = "paper";
    this._view = viewObj;
    this._layoutObj = layoutObj;
    this._mdcontent = {};
}

Document.prototype.update = function(md) {
    var mdcontent = md.structured();
    var boxChanges = this._boxChanges(mdcontent);

    this._mdcontent = mdcontent;
    this._insertBoxes(boxChanges.new);
    this._updateBoxesContent(boxChanges.modified);
    this._deleteBoxes(boxChanges.deleted);
    this._view.updateOverflows(md.headings());
};

Document.prototype._insertBoxes = function(boxKeys) {
    for (var i = 0; i < boxKeys.length; i += 1) {
        this._insertTextbox(boxKeys[i]);
    }
};

Document.prototype._updateBoxesContent = function(boxKeys) {
    for (var i = 0; i < boxKeys.length; i += 1) {
        this._view.updateTextBox(this._mdcontent[boxKeys[i]]);
    }
};

Document.prototype._deleteBoxes = function(boxKeys) {
    for (var i = 0; i < boxKeys.length; i += 1) {
        this._view.deleteTextBox(boxKeys[i]);
        this._layoutObj.deleteTextbox(boxKeys[i]);
    }
};


Document.prototype._insertTextbox = function(boxKey) {
    var objectThis = this;
    var completeBox = this._layoutPlusMarkdownBox(boxKey);

    // Is layout of box heading NOT defined (again)
    if (boxKey in this._layoutObj.layout.boxes === false) {
        console.log("Putting box layout into layout file");
        this._layoutObj.insertTextbox(textbox);
    }

    // Insert textbox to DOM
    this._view.newTextBox(completeBox, function(currentBoxTitle, newBoxPos) {
        objectThis._layoutObj.updateTextboxPosition(currentBoxTitle, newBoxPos);
    }, function(currentBoxTitle, newBoxSize) {
        objectThis._layoutObj.updateTextboxSize(currentBoxTitle, newBoxSize);
    });

};

Document.prototype._layoutPlusMarkdownBox = function(boxKey) {
    var boxMDStructured = this._mdcontent[boxKey];
    var boxPos;
    var boxSize;

    console.log("BoxKey: " + boxKey);
    console.log(pretty(this._layoutObj.layout.boxes))

    // Copy object, otherwise out changes travel upstream
    var completeBox = JSON.parse(JSON.stringify(this._layoutObj.layout.boxes[boxKey]));

    // Is layout of box heading defined
    if (boxKey in this._layoutObj.layout.boxes) {
        console.log(boxKey + "  is defined in layout");
    } else {
        console.log(boxKey + "  is NOT defined in layout - defaulting");
        completeBox.size = {
            width: 100,
            height: 100
        };
        completeBox.position = {
            page: 0,
            left: 0,
            top: 0
        };
    }

    completeBox.heading = boxKey;
    completeBox.parentid = this._defaultContainerID;
    completeBox.id = boxKey.hashCode();
    completeBox.html = marked(boxMDStructured.markdowntext);

    return completeBox;
};

Document.prototype._boxChanges = function(mdcontent) {
    var objectThis = this;
    var newBoxes = [];
    var modifiedBoxes = [];
    var deletedBoxes = [];

    // Looking at new keys
    for (var newkey in mdcontent) {
        if (mdcontent.hasOwnProperty(newkey)) {
            if (newkey in this._mdcontent) {
                if (objectThis._boxModified(mdcontent[newkey], this._mdcontent[newkey])) {
                    modifiedBoxes.push(newkey);
                }
            } else {
                newBoxes.push(newkey);
            }
        }
    }

    // Looking at old keys

    for (var oldkey in this._mdcontent) {
        if (this._mdcontent.hasOwnProperty(oldkey)) {
            if (oldkey in mdcontent === false) {
                console.log(oldkey + " has been deleted");
                deletedBoxes.push(oldkey);
            }
        }
    }

    return {
        "new": newBoxes,
        "modified": modifiedBoxes,
        "deleted": deletedBoxes
    };
};

Document.prototype._boxModified = function(box1, box2) {
    if (JSON.stringify(box1) == JSON.stringify(box2)) {
        return false;
    } else {
        return true;
    }
};