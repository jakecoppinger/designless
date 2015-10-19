/* 
Designless
Jake Coppinger 2015
*/

/*
This class extension implements the Java hashCode function which creates a unique HTML ID for each textbox (not required to be secure)
*/

String.prototype.hashCode = function() {
    var hash = 0;
    if (this.length === 0) {
        return hash;
    }
    for (i = 0; i < this.length; i++) {
        char = this.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
};

function pretty(s) {
    return JSON.stringify(s, null, 2);
}