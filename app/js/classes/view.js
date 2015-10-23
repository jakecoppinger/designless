/* 
Designless
Jake Coppinger 2015
*/

/*
This class mamages writing, modifying and removing elements from the DOM
*/

function View() {
    this._ppm = this.pixelsPerMM();
}

View.prototype._currentBoxPosition = function(obj) {
    return {
        left: obj.left / this._ppm,
        top: obj.top / this._ppm
    };
};

View.prototype._mmToPixelPosition = function(desiredPosition) {
    return {
        top: desiredPosition.top * this._ppm,
        left: desiredPosition.left * this._ppm
    };
};

View.prototype.updateOverflows = function(headings) {
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
    var textboxWidth = box.size.width * this._ppm;
    var textboxHeight = box.size.height * this._ppm;
    var textboxHTML = '<div><div class="innertext ' + box.style + '">' + box.html + '</div></div>';

    var new_offset = this._mmToPixelPosition(box.position);
    var objectThis = this;

    var newElement$ = $(textboxHTML)
        .appendTo('#' + box.parentid) // Should this just be main?
        .attr("id", box.id)
        .attr("class", "ui-widget-content textbox")
        .width(textboxWidth)
        .height(textboxHeight)
        .resizable({
            "stop": function(event, ui) {
                objectThis._textboxDragged(ui.size, box.heading, newSizeCallback);
            }
        })

    // Set position relative to document page
    .css("top", new_offset.top + "px")
        .css("left", new_offset.left + "px")


    .draggable({
        containment: 'parent',
        cancel: "text",
        snap: true,
        snapTolerance: 20,
        start: function() {
            $('#textarea').focus();
        },
        drag: function() {

        },

        stop: function() {
            var object = document.getElementById(box.id);
            var leftPixels = parseInt(object.style.left);
            var topPixels = parseInt(object.style.top);

            var newBoxPos = objectThis._currentBoxPosition({
                left: leftPixels, //document.getElementById(box.id()).offsetLeft,
                top: topPixels
            });

            newPositionCallback(box.heading, newBoxPos);
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

View.prototype.stylePropertyLookups = function(propertyInput) {
    var propertyLookups = {
        "font": "font-family"
    };

    if (propertyInput in propertyLookups) {
        return propertyLookups[propertyInput];
    }
    return propertyInput;
};

View.prototype.updateStyles = function(newStyles, oldStyles) {
    var change;
    var style;
    var property;
    var value;

    var differences = DeepDiff(newStyles, oldStyles);
    if (differences) {
        for (var changeIndex in differences) {
            change = differences[changeIndex];
            style = change.path[0];
            property = change.path[1];
            value = change.lhs;
            this._setStyle(style, property, value);
        }

    } else {
        // Apply all styles
        var keys = [];
        for (style in newStyles) {
            var styleDict = newStyles[style];
            for (property in styleDict) {
                value = styleDict[property];
                this._setStyle(style, property, value);
            }

        }
    }
};

View.prototype._setStyle = function(style, property, value) {
    var cssProperty = this.stylePropertyLookups(property);
    console.log("[Styles] Set " + property + " (" + cssProperty + ") to " + value + " on all " + style);
    $('.' + style).css(cssProperty, value);
};


View.prototype.pixelsPerMM = function() {
    // Work out pixels per inch
    var div = $("<div>").css({
        position: "absolute",
        left: "100mm",
        top: "100mm"
    }).appendTo(document.body);
    var pos = div.offset();
    div.remove();

    var pixelsPerMM = pos.left / 100;

    return pixelsPerMM;

}

