var fs = require('fs');
var path = require('path');
var _ = require('lodash');

var Socket = require('./socket');
var util = require('./util');

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

    this.commandHistory = [];
    this.currentCommand = 0;

    var parser = this;
    this.handlers = handlers.map(function (Handler) {
        return new Handler(parser);
    });

    ui.emitter.on('input', this.parse.bind(this));
    ui.emitter.on('recall-older', this.recall.bind(this, -1));
    ui.emitter.on('recall-newer', this.recall.bind(this, 1));
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
    var parts = util.splitFirst(message, delimiter);
    var handler = this.getCommand(parts[0].toLowerCase());

    // If the command was invalid, show the help.
    if (!handler) {
        handler = this.getCommand('help');
    } else {
        this.commandHistory.push(message);
        this.currentCommand = this.commandHistory.length;
    }

    // Finally, dispatch the command
    handler.dispatch(parts[1]);
};

/**
 * Attempts to recall a command.
 * @param  {Number} difference Difference from current position
 */
Parser.prototype.recall = function (difference) {
    var target = Math.max(Math.min(this.currentCommand + difference, this.commandHistory.length), 0);

    this.currentCommand = target;
    this.ui.input.setValue(this.commandHistory[target] || '');
    this.ui.screen.render();
};

module.exports = Parser;
