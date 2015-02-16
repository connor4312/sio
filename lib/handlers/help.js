var _ = require('lodash');
var Handler = require('../handler');
var util = require('../util');
var InternalMessage = require('../ui/lines/internalMessage');

var hotkeys = {
    'Ctrl+W': 'Scrolls the console up a page.',
    'Ctrl+S': 'Scrolls the console down a page.',
    'Ctrl+C': 'Clears the line in sio or, if already clear, exits'
};

function Help () {
    Handler.apply(this, arguments);
}

Help.prototype = new Handler();

Help.prototype.dispatch = function () {
    var handlers = this.parser.handlers;
    var ui = this.parser.ui;

    // Now output everything...
    ui.output.add(new InternalMessage(''));

    // Show commands
    ui.output.add(new InternalMessage('Commands:'));
    this.pushColumns([
        handlers.map(function (handler) {
            return [handler.getName()].concat(handler.getAliases()).join(', ');
        }),
        _.invoke(handlers, 'getDescription')
    ]);
    ui.output.add(new InternalMessage(''));

    // And now hotkeys
    ui.output.add(new InternalMessage('Hotkeys:'));
    this.pushColumns([_.keys(hotkeys), _.values(hotkeys)]);
    ui.output.add(new InternalMessage(''));

    // And update the screen
    ui.output.draw();
};

/**
 * Pushes a set of columns to the output, taburlarizing, indenting,
 * and prefixing it correctly.
 * @param  {[][]String} columns
 */
Help.prototype.pushColumns = function (columns) {
    var ui = this.parser.ui;

    tabularize('  ', columns).forEach(function (row) {
        ui.output.add(new InternalMessage('\t' + row));
    });
};

Help.prototype.getName = function () {
    return 'help';
};

Help.prototype.getAliases = function () {
    return ['h'];
};

Help.prototype.getDescription = function () {
    return 'Shows this help text.';
};

/**
 * Makes an array of table rows, so that every column aligns correctly
 * with the other vertical cells.
 * @param  {String} spacing The pad between columns
 * @param  {[][]String} columns Array of columns (array of arrays of string)
 * @return {String}
 */
function tabularize (spacing, columns) {
    // Store the max length of each column.
    var maxInColumns = [];
    columns.forEach(function (column, i) {
        maxInColumns[i] = Math.max.apply(null, _.pluck(column, 'length'));
    });

    // Build the output
    var output = [];
    for (var x = 0, l = columns[0].length; x < l; x++) {
        output.push(
            columns.map(function (column, y) {
                return util.pad(column[x], ' ' , maxInColumns[y]);
            }).join(spacing)
        );
    };

    return output;
}

module.exports = Help;
