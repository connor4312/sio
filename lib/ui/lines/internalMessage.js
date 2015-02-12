var Line = require('../line');

/**
 * Represents a line for an internal message on the console.
 * @param {String} message Error message
 */
function Internal (message) {
    Line.call(this);
    this.message = message;
}

Internal.prototype = new Line();

Internal.prototype.toString = function () {
    return '{cyan-fg}+{/cyan-fg} ' + this.message;
};

module.exports = Internal;
