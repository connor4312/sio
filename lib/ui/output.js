var IncomingEvent = require('./lines/incomingEvent');
var pack = require('../../package');
var _ = require('lodash');

var defaultMeta = 'sio version ' + pack.version;

/**
 * Manages drawing, filtering, and display of the output console.
 * @param {Drawing} ui
 */
function Output (ui) {
    this.ui = ui;
    this.lines = [];
    this.lastLength = 0;

    this.filters = [];
    this.pausedAt = null;

    this.meta = null;
    this.updateMeta();
    this.ui.screen.render();
}

/**
 * Adds a line or multiple lines to the output.
 * @param {Line|[]Line} line
 * @return {Output}
 */
Output.prototype.add = function (line) {
    // Don't accept incoming messages while paused.
    if (this.pausedAt !== null && line instanceof IncomingEvent) {
        return this;
    }

    if (Array.isArray(line)) {
        this.lines = this.lines.concat(line);
    } else {
        this.lines.push(line);
    }

    return this;
};

/**
 * Pauses the output.
 * @return {Output}
 */
Output.prototype.pause = function () {
    this.pausedAt = new Date();
    this.updateMeta();
    return this;
};

/**
 * Unpauses the output.
 * @return {Output}
 */
Output.prototype.unpause = function () {
    this.pausedAt = null;
    this.updateMeta();
    return this;
};


/**
 * Adds a filter to the output.
 * @param {String} filter
 * @return {Output}
 */
Output.prototype.filter = function (filter) {
    this.filters.push(filter);
    this.updateMeta();
    return this.redraw();
};

/**
 * Removes a previously added filters, or all filters if none is given.
 * @param  {String} filter
 * @return {Output}
 */
Output.prototype.unfilter = function (filter) {
    if (filter) {
        this.filters = _.remove(this.filters, filter);
    } else {
        this.filters = [];
    }

    this.updateMeta();
    return this.redraw();
};


/**
 * Returns all currently visible lines in the output.
 * @return {[]Line}
 */
Output.prototype.getVisibleLines = function () {
    var filters = this.filters;

    return _.filter(this.lines, function (line) {

        if (!line.shouldDisplay(filters)) {
            return false;
        }

        return true;
    });
};

/**
 * Expects fn to be a function that draws some content. This auto-scrolls
 * to the bottom after fn is run, if necessary.
 * @param  {Function} fn
 * @return {Output}
 */
Output.prototype.andScroll = function (fn) {
    var outbox = this.ui.outbox;
    var willscroll = outbox.getScroll() >= outbox.getScrollHeight() - 2;
    var out = fn.call(this);

    if (willscroll) {
        outbox.setScrollPerc(100);
    }

    return out;
};

/**
 * Draws new lines to the output.
 * @return {Output}
 */
Output.prototype.draw = function () {
    var lines = this.getVisibleLines();
    var newLines = lines.slice(this.lastLength);

    this.andScroll(function () {
        this.ui.outbox.pushLine(_.invoke(newLines, 'toString'));
        this.ui.screen.render();
    });

    this.lastLength = lines.length;

    return this;
};

/**
 * Clears all outbox content.
 * @return {[type]} [description]
 */
Output.prototype.clear = function () {
    this.lines = [];
    this.lastLength = 0;
    this.ui.outbox.setContent('');
    this.ui.screen.render();
};

/**
 * Triggers a total redraw of the output.
 * @return {Output}
 */
Output.prototype.redraw = function () {
    var lines = this.getVisibleLines();

    this.andScroll(function () {
        this.ui.outbox.setContent('');
        this.ui.outbox.pushLine(_.invoke(lines, 'toString'));
        this.ui.screen.render();
    });

    this.lastLength = lines.length;

    return this;
};

/**
 * Updates the meta text based on current status of the things.
 */
Output.prototype.updateMeta = function () {
    // Remove the old meta.
    if (this.meta) {
        this.ui.screen.remove(this.meta);
    }

    // Add status indictors
    var meta = [];
    if (this.filters.length > 0) {
        meta.push('FILTERED');
    }
    if (this.pausedAt !== null) {
        meta.push('PAUSED');
    }

    // If no status, just show the version
    var content;
    if (meta.length === 0) {
        content = defaultMeta;
    } else {
        content = meta.join(', ');
    }

    // Generate the meta and add it to the ui
    this.ui.meta.setText(' ' + content + ' ');
    this.ui.meta.width = content.length + 3;
};

module.exports = Output;
