/* 
Designless
Jake Coppinger 2015
*/

/*
This file stores the markdown and processes it into a JSON format which stores the title of each section, the size of the heading (denoted by the number of hashes) and the text of the box.
*/

function Markdown(mdtext) {
    this.mdtext = mdtext;
    this._structured = this.structured();
}

Markdown.prototype.structured = function() {
    var lines = this.mdtext.split("\n");
    var paragraphs = [];
    var currentHeading = "";
    var buffer = "";
    var order = 0;
    for (var i = 0; i < lines.length; i++) {
        var currentLine = lines[i];
        if (this._lineIsHeading(currentLine)) {

            if (buffer.length > 0 && this._isWhitespace(buffer) == false) {
                paragraphs[this._bareHeading(currentHeading)] = {
                    "heading": this._bareHeading(currentHeading),
                    "order": order,
                    "headinglevel": this._headingLevel(currentHeading),
                    "markdowntext": buffer,
                };

                currentHeading = "";
                buffer = "";
            }


            order += 1;
            currentHeading = currentLine.trim();
        }
        buffer = buffer + currentLine + "\n";
    }

    if (buffer.length > 0 && this._isWhitespace(buffer) == false) {
        paragraphs[this._bareHeading(currentHeading)] = {
            "heading": this._bareHeading(currentHeading),
            "order": order,
            "headinglevel": this._headingLevel(currentHeading),
            "markdowntext": buffer,
        };
    }

    this._structured = paragraphs;
    return paragraphs
}

Markdown.prototype._isWhitespace = function(s) {
    if ($.trim(s).length > 0) {
        return false;
    } else {
        return true;
    }
}

Markdown.prototype._lineIsHeading = function(line) {
    var strippedLine = line.trim();
    if (strippedLine[0] == "#") {
        return true;
    } else {
        return false;
    }
}

Markdown.prototype._headingLevel = function(line) {
    var regExp = /^ *(#+) *.*$/;
    var matches = regExp.exec(line);
    return matches[1].length
}

Markdown.prototype._bareHeading = function(rawHeading) {
    var regExp = /^ *#+ *(.*)$/;
    var matches = regExp.exec(rawHeading);
    return matches[1];
}

Markdown.prototype.headings = function() {
    return Object.keys(this._structured);
}

Markdown.prototype.IDs = function() {
    var headings = this.headings();
    var keys = [];
    for (var i = 0; i < headings.length; i += 1) {
        keys.push(headings[i].hashCode());
    }
    return keys;
};