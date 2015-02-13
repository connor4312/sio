var io = require('socket.io-client');
var IncomingEvent = require('./ui/lines/incomingEvent');
var OutgoingEvent = require('./ui/lines/outgoingEvent');
var ErrorMessage = require('./ui/lines/errorMessage');
var InternalMessage = require('./ui/lines/internalMessage');

/**
 * Manages the websocket connection, including listening for output.
 * @param {Parser} parser
 */
function Socket (parser) {
    this.parser = parser;
    this.socket = null;
    this.connected = false;

    this.paused = false;
    this.spool = [];
    this.filters = [];
}

/**
 * Wraps the socket's own onevent function so that we can intercept
 * every event. Calls the given function with the event data.
 * @param  {Function} fn
 */
Socket.prototype.onEvent = function (fn) {
    var onEvent = this.socket.onevent;
    var self = this;

    this.socket.onevent = function (packet) {
        fn.call(self, packet);
        onEvent.apply(self.socket, arguments);
    };
};

/**
 * Parses a socket.io url for connection. Adds the http if needed, and
 * replaces a space with a colon between the host and port.
 * @param  {String} address
 * @return {String}
 */
Socket.prototype.parseAddress = function (address) {
    var addr = address.replace(' ', ':');
    if (addr.indexOf('http') !== 0) {
        addr = 'http://' + addr;
    }
    return addr;
};

/**
 * Tries to emit a new event on the socket.
 * @param  {String} event
 * @param  {*} data
 * @return {Socket}
 */
Socket.prototype.emit = function (event, data) {
    if (this.connected) {
        this.socket.emit(event, data);
        this.parser.ui.output.add(new OutgoingEvent(event, data)).draw();
    } else {
        this.parser.ui.output.add(new ErrorMessage('You must connect to a server first!')).draw();
    }

    return this;
};


/**
 * Creates a new socket connection to the address. The address may be
 * given in the form `<host> <port>` or `<host>:<port>`
 * @param  {String} address
 */
Socket.prototype.connect = function (address) {
    var ui = this.parser.ui;
    var addr = this.parseAddress(address);
    var socket = this.socket = io(addr);
    var self = this;

    ui.output.add(new InternalMessage('Connecting to ' + addr)).draw();

    socket.on('connect', function () {
        self.connected = true;
        ui.output.add(new InternalMessage('Socket connected.')).draw();
    });

    socket.on('disconnect', function () {
        self.connected = false;
        ui.output.add(new InternalMessage('Socket disconnected.')).draw();
    });

    this.onEvent(function (packet) {
        ui.output.add(new IncomingEvent(packet)).draw();
    });
};

module.exports = Socket;
