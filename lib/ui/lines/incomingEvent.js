var minimatch = require('minimatch');
var util = require('../../util');
var Line = require('../line');

/**
 * Represents a line for an incoming event on the console.
 * @param {Object} packet Socket.io event packet
 */
function IncomingEvent (packet) {
    Line.call(this);
    this.packet = packet;
}

IncomingEvent.prototype = new Line();

/**
 * Creates a nice timestamp for the time the event was sent.
 * @return {String}
 */
IncomingEvent.prototype.fmtTime = function () {
    return '' +
        padZeroes(this.time.getMinutes(), 2) +
        ':' +
        padZeroes(this.time.getSeconds(), 2) +
        ':' +
        padZeroes(this.time.getMilliseconds(), 4);
};

IncomingEvent.prototype.shouldDisplay = function (filters) {
    // If there are no active filters, display it.
    if (filters.length === 0) {
        return true;
    }

    // Otherwise attempt to glob match the event name.
    for (var i = 0, l = filters.length; i < l; i++) {
        if (minimatch(this.packet.data[0], filters[i])) {
            return true;
        }
    }

    return false;
};

IncomingEvent.prototype.toString = function () {
    return '{cyan-fg}' + this.fmtTime() + '{/cyan-fg} {green-fg}>{/green-fg} ' + util.prettifyEvent(this.packet.data);
};

function padZeroes (time, len) {
    var t = '' + time;
    while (t.length < len) {
        t = '0' + t;
    }

    return t;
}

module.exports = IncomingEvent;
