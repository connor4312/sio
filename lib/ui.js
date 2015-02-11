var blessed = require('blessed');
var pack = require('../package');
var EventEmitter = require('events').EventEmitter;

var screen = blessed.screen();
screen.title = 'SIO';

// Input box for commands
var input = blessed.textbox({
    bottom: 0,
    left: 0,
    width: '100%',
    height: 1,
    content: 'Hello!',
    style: {
        fg: 'white'
    },
    mouse: true,
    keys: true,
    inputOnFocus: true
});

// Dividing line between command and output
var line = blessed.line({
    bottom: 1,
    left: 0,
    right: 0,
    orientation: 'horizontal',
    type: 'bg',
    ch: '=',
    fg: 'magenta'
});

// sio text
var versioning = blessed.text({
    bottom: 1,
    right: 2,
    align: 'right',
    label: 'sio version ' + pack.version + '    ',
    style: {
        fg: 5
    },
    fg: 5
});

var output = blessed.box({
    bottom: 3,
    right: 0,
    left: 0,
    top: 0,
    valign: 'bottom',
    tags: true,
    scrollable: true,
    scrollbar: {
        bg: 'white',
        ch: ' '
    }
});

// Append our box to the screen.
screen.append(input);
screen.append(line);
screen.append(versioning);
screen.append(output);

var emitter = new EventEmitter();

// If our box is clicked, change the content.
input.on('submit', function (data) {
    emitter.emit('input', data);
    input.setValue('');
    input.focus();
    screen.render();
});

// Quit on Escape, q, or Control-C.
screen.key(['escape', 'q', 'C-c'], function (ch, key) {
    return process.exit(0);
});

// Scrolling the console
input.key('C-up', function () {
    var scrollPos = Math.max(output.getScroll() - output.height, 1);
    output.setScroll(scrollPos);
    screen.render();
});
input.key('C-down', function () {
    var scrollPos = output.getScroll() + output.height;
    output.setScroll(scrollPos);
    screen.render();
});
// Control+C clears the input if there is any. If there isn't, it exists.
input.key('C-c', function () {
    if (input.getValue().length > 0) {
        input.setValue('');
    } else {
        return process.exit(0);
    }
});

module.exports = {
    boot: function () {
        // Focus our element.
        input.focus();

        // Render the screen.
        screen.render();
    },

    // pushes a message to the output
    push: function (message) {
        var willscroll = output.getScroll() === output.getScrollHeight() - 1;
        output.pushLine(message);

        if (willscroll) {
            output.setScrollPerc(100);
        }
        screen.render();
    },

    emitter: emitter,
    output: output,
    screen: screen
};
