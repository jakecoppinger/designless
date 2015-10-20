/* 
Designless
Jake Coppinger 2015
*/

/*
This class stores information about each textbox on the screen as part of the Model
*/

/*
For position, use left:0 and top:0
For size use width:0 and height:0
*/

/*
function Box(data) {
    this._title = data.title;
    this._id = data.id;
    this._mdtext = data.text;
    this._parentid = data.parentid;
    this._pos = data.position;
    this._size = data.size;
    this._style = data.style;
}

Box.prototype.setPosition = function(pos) {
    this._position = pos;
};

Box.prototype.position = function() {
    return this._pos;
};

Box.prototype.parentid = function() {
    return this._parentid;
};

Box.prototype.id = function() {
    return this._id;
};

Box.prototype.size = function() {
    return this._size;
};

Box.prototype.markdown = function() {
    return this._mdtext;
};

Box.prototype.html = function() {
    return marked(this._mdtext);
};

Box.prototype.heading = function() {
    return this._title;
};

Box.prototype.style = function() {
    return this._style;
};


Box.prototype.layoutJSON = function() {
    return {
        "size": this._size,
        "position": this._pos
    };

};

*/