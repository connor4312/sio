var fs = require('fs');
var path = require('path');
var _ = require('lodash');

var Socket = require('./socket');

// Command handlers
var handlerPath = __dirname + '/handlers';
var handlers = fs.readdirSync(handlerPath).map(function (file) {
    return require(path.join(handlerPath, file));
});

// Separator between the command and body.
var delimiter = ' ';

/**
 * The parser is responsible for listening for input then dispatching
 * that input to the appropriate handler.
 *
 * @param {Object} ui
 */
function Parser (ui) {
    this.ui = ui;
    this.socket = new Socket(this);

    var parser = this;
    this.handlers = handlers.map(function (Handler) {
        return new Handler(parser);
    });

    ui.emitter.on('input', this.parse.bind(this));
}

/**
 * Returns a command by its name or an alias. Or undef, if it doesn't exist.
 * @return {Command}
 */
Parser.prototype.getCommand = function (name) {
    return _.find(this.handlers, function (handler) {
        return handler.getName() === name || handler.getAliases().indexOf(name) !== -1;
    });
};

/**
 * Parses an input message, dispatching it to a handler.
 * @param  {String} message
 */
Parser.prototype.parse = function (message) {
    // Split the command and its body.
    var split = message.indexOf(delimiter);
    var command = split === -1 ? message : message.slice(0, split);
    var handler = this.getCommand(command.toLowerCase());

    // If the command was invalid, show the help.
    if (!handler) {
        handler = this.getCommand('help');
    }

    // Finally, dispatch the command
    var body;
    if (split !== -1) {
        body = message.slice(split + delimiter.length);
    }

    handler.dispatch(body);
};

module.exports = Parser;
