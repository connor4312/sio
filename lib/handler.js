/**
 * The basis of a command handler.
 * @param {Parser} parser
 */
function Handler (parser) {
    this.parser = parser;
}

/**
 * Should take a command in and... do the necessary actions, whatever
 * they may be.
 *
 * @param  {String} body
 */
Handler.prototype.dispatch = function (body) {
    throw new Error('dispatch not implemented');
};

/**
 * Returns the primary command name.
 * @return {String}
 */
Handler.prototype.getName = function () {
    throw new Error('getName not implemented');
};

/**
 * Returns aliases this command can be called with.
 * @return {[]String}
 */
Handler.prototype.getAliases = function () {
    throw new Error('getAliases not implemented');
};

/**
 * Returns helpful info about the handler's usage.
 * @return {[]String}
 */
Handler.prototype.getDescription = function () {
    throw new Error('getDescription not implemented');
};

module.exports = Handler;
