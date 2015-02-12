var _ = require('lodash');

var InternalMessage = require('./lines/internalMessage');
var Parser = require('../parser');
var Output = require('./output');

function Drawing (ui) {
    _.extend(this, ui);
    this.lines = [];
}

/**
 * Does first-time initializations, creating the UI and binding events.
 */
Drawing.prototype.boot = function () {
    this.input.focus();
    this.screen.render();

    this.output = new Output(this);
    this.parser = new Parser(this);

    this.welcome();
};

/**
 * Displays a welcome message to the user.
 */
Drawing.prototype.welcome = function () {
    this.output.add([
        new InternalMessage(''),
        new InternalMessage('Welcome to sio. Type `connect <host> <port>` to get started,'),
        new InternalMessage('or `help` for a list of commands.'),
        new InternalMessage('')
    ]).draw();
};

module.exports = Drawing;
