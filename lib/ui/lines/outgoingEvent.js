var IncomingEvent = require('./incomingEvent');
var util = require('../../util');

/**
 * Represents a line for an outgoing event on the console.
 * @param {String} event
 * @param {Number} data
 */
function OutgoingEvent (event, data) {
    IncomingEvent.call(this, { data: [event, data] });
    this.event = event;
    this.data = data;
}

OutgoingEvent.prototype = new IncomingEvent();

OutgoingEvent.prototype.shouldDisplay = function () {
    return true;
};

OutgoingEvent.prototype.toString = function () {
    return '{cyan-fg}' +
        this.fmtTime() +
        '{/cyan-fg} {red-fg}<{/red-fg} ' +
        util.prettifyEvent([ this.event, this.data ]);
};

module.exports = OutgoingEvent;
