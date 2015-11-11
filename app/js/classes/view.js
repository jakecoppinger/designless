/* 
Designless
Jake Coppinger 2015
*/

/*
This class mamages writing, modifying and removing elements from the DOM
*/

function View() {
    this._ppm = this.pixelsPerMM();
    this._dimensions = {
        "height": 297,
        "width": 210
    };
}

View.prototype._mmToPixelPosition = function(desiredPosition) {
    return {
        top: desiredPosition.top * this._ppm,
        left: desiredPosition.left * this._ppm
    };
};

View.prototype._pixelToMMPosition = function(measuredPosition) {
    return {
        top: measuredPosition.top / this._ppm,
        left: measuredPosition.left / this._ppm
    };
};

View.prototype._pixelToPagePosition = function(measuredPosition) {
    var mmPos = this._pixelToMMPosition(measuredPosition);
    var page = Math.floor(mmPos.top / 297) + 1;
    // 0.13907722837768688 is the constant (apparent) mm height of a divider
    var mmTopOnPage = (mmPos.top - (0.13907722837768688 * (page - 1))) % this._dimensions.height;
    return {
        "page": page,
        "top": mmTopOnPage,
        "left": mmPos.left
    };
};

View.prototype._pageToPixelPosition = function(position) {
    var newPos = {
        top: (position.top * this._ppm) + (this._dimensions.height * (position.page - 1) * this._ppm),
        left: position.left * this._ppm
    };
    return newPos;
};



View.prototype.updateOverflowingBoxes = function(headings) {
    for (var i = 0; i < headings.length; i += 1) {
        this._updateBoxOverflow(headings[i]);
    }
};

View.prototype._updateBoxOverflow = function(heading) {
    var textbox = $("#" + heading.hashCode());

    // The 7px offset is due to the jQuery drag handle divs
    if (textbox.prop('scrollHeight') - textbox.height() > 7) {
        textbox.addClass('overflowing');

    } else {
        textbox.removeClass('overflowing');
    }
};

View.prototype._textboxDragged = function(pixelSize, heading, newSizeCallback) {
    this._updateBoxOverflow(heading);

    var newBoxSize = {
        width: pixelSize.width / this._ppm,
        height: pixelSize.height / this._ppm
    };

    newSizeCallback(heading, newBoxSize);
};

View.prototype.newTextBox = function(box, newPositionCallback, newSizeCallback) {
    console.log("Created new textbox");
    var content = box.content;
    var layout = box.layout;

    var textboxWidth = layout.size.width * this._ppm;
    var textboxHeight = layout.size.height * this._ppm;

    var safeStyleSelector = this._safeStyleSelector(layout.style);
    var textboxHTML = '<div><div class="innertext ' + safeStyleSelector + '">' + content.html + '</div></div>';

    var position = this._pageToPixelPosition(layout.position);

    var objectThis = this;

    var newElement$ = $(textboxHTML)
        .appendTo('#' + content.parentid) // Should this just be main?
        .attr("id", content.id)
        .attr("class", "ui-widget-content textbox")
        .width(textboxWidth)
        .height(textboxHeight)
        .resizable({
            "stop": function(event, ui) {
                objectThis._textboxDragged(ui.size, content.heading, newSizeCallback);
            }
        })

    // Set position relative to document page
    .css("top", position.top + "px")
        .css("left", position.left + "px")


    .draggable({
        containment: 'parent',
        cancel: "text",
        snap: ".pageseparator, .textbox",
        snapMode: "both",
        snapTolerance: 20,
        start: function() {
            $('#textarea').focus();
        },
        drag: function() {

        },

        stop: function() {
            var object = document.getElementById(content.id);
            var leftPixels = parseInt(object.style.left);
            var topPixels = parseInt(object.style.top);

            var mmBoxPos = objectThis._pixelToPagePosition({
                left: leftPixels, //document.getElementById(content.id()).offsetLeft,
                top: topPixels
            });

            console.log(mmBoxPos);

            newPositionCallback(content.heading, mmBoxPos);
        }
    });

};

View.prototype.updateTextBox = function(structuredMD) {
    var safeID = (structuredMD.heading).hashCode();
    var newHTMLContent = marked(structuredMD.markdowntext);
    $("#" + safeID + " .innertext").html(newHTMLContent);
};

View.prototype.deleteTextBox = function(heading) {
    var safeID = heading.hashCode();
    $("#" + safeID).remove();
};

// A sort of hash table connecting convenient property names
// (eg font) to the CSS counterparts (font-family)
View.prototype.stylePropertyLookups = function(propertyInput) {
    var propertyLookups = {
        "font": "font-family",
        "textalign":"text-align"
    };

    if (propertyInput in propertyLookups) {
        return propertyLookups[propertyInput];
    }
    return propertyInput;
};
// Update only the changed styles into the DOM
// (Yes, it really diffs!)
View.prototype.updateStyles = function(newStyles, oldStyles) {
    var change;
    var style;
    var property;
    var value;
    var safeStyleSelector;
    var differences = DeepDiff(newStyles, oldStyles);
    if (differences) {
        for (var changeIndex in differences) {
            if (differences.hasOwnProperty(changeIndex)) {
                change = differences[changeIndex];
                if (change.path.length == 2) {
                    style = change.path[0];
                    property = change.path[1];
                    value = change.lhs;
                    safeStyleSelector = this._safeStyleSelector(style);
                    this._setStyle(safeStyleSelector, property, value);
                } else {
                    //console.log("Added or removed style: not gonna try to change color or something");
                }
            }
        }


    } else {
        this.updateAllStyles(newStyles);
    }
};
// Update every style there is into the DOM
View.prototype.updateAllStyles = function(styles) {
    for (var style in styles) {
        if (styles.hasOwnProperty(style)) {
            var styleDict = styles[style];
            for (var property in styleDict) {
                value = styleDict[property];
                safeStyleSelector = this._safeStyleSelector(style);
                this._setStyle(safeStyleSelector, property, value);
            }
        }
    }
};

// Applies styleclass_{{style}} to each style box on the page
View.prototype.updateBoxStyles = function(boxes) {
    for (var boxName in boxes) {
        var boxID = '#' + boxName.hashCode();
        var styleClass = this._safeStyleSelector(boxes[boxName].style);
        var selector = boxID + " .innertext";
        var newClasses = "innertext " + styleClass;
        $(selector).attr('class', newClasses);
    }
};


View.prototype._setStyle = function(style, property, value) {
    var cssProperty = this.stylePropertyLookups(property);
    //console.log("[Styles] Set " + property + " (" + cssProperty + ") to " + value + " on all " + style);
    $('.' + style).css(cssProperty, value);
};


// Work out pixels per inch
View.prototype.pixelsPerMM = function() {
    var div = $("<div>").css({
        position: "absolute",
        left: "100mm",
        top: "100mm"
    }).appendTo(document.body);
    var pos = div.offset();
    div.remove();

    var pixelsPerMM = pos.left / 100;

    return pixelsPerMM;
};

View.prototype._safeStyleSelector = function(name) {
    return "styleclass" + name.replace(/[^a-z0-9]/g, function(s) {
        var c = s.charCodeAt(0);
        if (c == 32) return '-';
        if (c >= 65 && c <= 90) return '_' + s.toLowerCase();
        return '__' + ('000' + c.toString(16)).slice(-4);
    });
};