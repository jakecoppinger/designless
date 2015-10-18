/* 
Designless
Jake Coppinger 2015
*/

/*
This class represents the layout object used by the app, suppoted by a flexible JSON data structure
*/

function Layout(layoutChangedFunction, obj) {
    this._changeCallback = layoutChangedFunction;
    this._ppm = obj.ppm;
    this._layout = obj.layout;

}

Layout.prototype.insertTextbox = function(textbox) {
    this._layout.boxes[textbox.heading()] = textbox.layoutJSON();
    this._changeCallback();
};

Layout.prototype.deleteTextbox = function(boxTitle) {
    this._layout.boxes[boxTitle] = undefined;
    this._changeCallback();
};

Layout.prototype.updateTextboxPosition = function(boxTitle, pos) {
    this._layout.boxes[boxTitle].position = pos;
    this._changeCallback();
};

Layout.prototype.updateTextboxSize = function(boxTitle, size) {
    this._layout.boxes[boxTitle].size = size;
    this._changeCallback();
};



Layout.prototype.boxExist = function(boxTitle) {
    if (boxTitle in this._layout.boxes) {
        return true;
    } else {
        return false;
    }
}

Layout.prototype.getBoxJSON = function(boxTitle) {
    return this._layout.boxes[boxTitle];
}

Layout.prototype.boxPosition = function(boxPos, parentPos) {
    return {
        left: (boxPos.left - parentPos.left) / this._ppm,
        top: (boxPos.top - parentPos.top) / this._ppm
    }
}

Layout.prototype.layoutString = function() {
    return JSON.stringify(this._layout, null, 2);
}

Layout.prototype.layoutJSON = function() {
    return this._layout;
}

Layout.prototype.ppm = function() {
    return this._ppm;
}