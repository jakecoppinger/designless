/* 
Designless
Jake Coppinger 2015
*/

function Box(title,layout,markdown) {
    
    this._layout = layout.boxes[title];
    this._structuredMD = markdown[title];
}


Box.prototype.html = function() {
    return marked(this._mdtext);
};


Box.prototype.layoutJSON = function() {
    return {
        "size": this._size,
        "position": this._pos
    };

};

