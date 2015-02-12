var InternalMessage = require('./internalMessage');

/**
 * Represents a line for an error message on the console.
 * @param {String} message Error message
 */
function ErrorMessage () {
    InternalMessage.apply(this, arguments);
}

ErrorMessage.prototype = new InternalMessage();

ErrorMessage.prototype.toString = function () {
    return '{red-fg}ERR{/red-fg} ' + this.message;
};

module.exports = ErrorMessage;
