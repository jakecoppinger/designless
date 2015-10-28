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

    console.log("Boxchanges:");
    console.log(pretty(boxChanges));

    this._mdcontent = mdcontent;


    if (boxChanges.new.length == 1 && boxChanges.deleted.length == 1) {
        console.log("We have a header name change!");

        var newBoxName = boxChanges.new[0];
        var oldBoxName = boxChanges.deleted[0];

        var oldLayout = this._layoutObj.layout.boxes[oldBoxName];

        this._insertTextbox(newBoxName,oldLayout);
        this._deleteBoxes(boxChanges.deleted);
        this._layoutObj.deleteTextbox(oldBoxName);

    } else {
        this._insertBoxes(boxChanges.new);
        this._updateBoxesContent(boxChanges.modified);
        this._deleteBoxes(boxChanges.deleted);
    }

    this._view.updateOverflowingBoxes(md.headings());
    this._view.updateAllStyles(this._layoutObj.layout.styles);
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


Document.prototype._insertTextbox = function(boxKey, layout) {
    var completeBox;
    var layoutBox = {};

    if (boxKey in this._layoutObj.layout.boxes) {
        completeBox = this._layoutPlusMarkdownBox(boxKey);
    } else {

        if (typeof(layout) === 'undefined') {
            console.log(boxKey + " is not in layout. Inserting.");
            layoutBox.size = {
                width: 100,
                height: 100
            };
            layoutBox.position = {
                page: 1,
                left: 0,
                top: 0
            };
            layoutBox.style = 'Default style';
        } else {
            layoutBox = layout;
        }
        this._layoutObj.insertTextbox(boxKey, layoutBox);
        completeBox = this._layoutPlusMarkdownBox(boxKey);
    }

    // Insert textbox to DOM
    var objectThis = this;
    this._view.newTextBox(completeBox, function(currentBoxTitle, newBoxPos) {
        objectThis._layoutObj.updateTextboxPosition(currentBoxTitle, newBoxPos);
    }, function(currentBoxTitle, newBoxSize) {
        objectThis._layoutObj.updateTextboxSize(currentBoxTitle, newBoxSize);
    });

};

Document.prototype._layoutPlusMarkdownBox = function(boxKey) {
    var boxMDStructured = this._mdcontent[boxKey];

    // Copy object, otherwise out changes travel upstream
    var completeBox = {
        layout: JSON.parse(JSON.stringify(this._layoutObj.layout.boxes[boxKey])),
        content: {
            heading: boxKey,
            parentid: this._defaultContainerID,
            id: boxKey.hashCode(),
            html: marked(boxMDStructured.markdowntext)
        }
    };
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