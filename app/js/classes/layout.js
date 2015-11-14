/* 
Designless
Jake Coppinger 2015
*/

/*
This class represents the layout object used by the app, suppoted by a flexible JSON data structure
*/

function Layout(layout, ppm, layoutChangedFunction) {
    this._changeCallback = layoutChangedFunction;
    this._ppm = ppm;
    this.layout = layout;
}

Layout.prototype.updateLayout = function(newLayout) {
    this.layout = newLayout;
    this._changeCallback();
};

// Insert textbox to the layout file
Layout.prototype.insertTextbox = function(boxTitle, box) {
    var layoutJSON = {
        "size": box.size,
        "position": box.position,
        "style": box.style
    };
    this.layout.boxes[boxTitle] = layoutJSON;
    this._changeCallback();
};

Layout.prototype.deleteTextbox = function(boxTitle) {
    delete this.layout.boxes[boxTitle];
    this._changeCallback();
};

Layout.prototype.updateTextboxPosition = function(boxTitle, pos) {
    this.layout.boxes[boxTitle].position = pos;
    this._changeCallback();
};

Layout.prototype.updateTextboxSize = function(boxTitle, size) {
    console.log("Textbox size upated");
    this.layout.boxes[boxTitle].size = size;
    this._changeCallback();
};

Layout.prototype.box = function(boxTitle) {
    return this.layout.boxes[boxTitle];
};

// Finds the box position, taking into account the resolution of the display
Layout.prototype.boxPosition = function(boxPos, parentPos) {
    return {
        left: (boxPos.left - parentPos.left) / this._ppm,
        top: (boxPos.top - parentPos.top) / this._ppm
    };
};

Layout.prototype.layoutString = function() {
    return JSON.stringify(this.layout, null, 2);
};


Layout.prototype.ppm = function() {
    return this._ppm;
};