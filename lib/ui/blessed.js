var blessed = require('blessed');
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

// Dividing line between command and outbox
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
var meta = blessed.text({
    bottom: 2,
    right: 2,
    align: 'center',
    shrink: true,
    style: {
        fg: 5
    },
    fg: 5
});

var outbox = blessed.box({
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
screen.append(meta);
screen.append(outbox);

var emitter = new EventEmitter();

// If our box is clicked, change the content.
input.on('submit', function (data) {
    emitter.emit('input', data);
    input.setValue('');
    input.focus();
    screen.render();
});

// Quit on Escape, q, or Control-C.
screen.key(['escape', 'q', 'C-c'], function () {
    return process.exit(0);
});

// Scrolling the console
input.key('C-w', function () {
    var scrollPos = Math.max(outbox.getScroll() - outbox.height, 1);
    outbox.setScroll(scrollPos);
    screen.render();
});
input.key('C-s', function () {
    var scrollPos = outbox.getScroll() + outbox.height;
    outbox.setScroll(scrollPos);
    screen.render();
});
input.key('up', function () {
    emitter.emit('recall-older');
});
input.key('down', function () {
    emitter.emit('recall-newer');
});
// Control+C clears the input if there is any. If there isn't, it exists.
input.key('C-c', function () {
    if (input.getValue().length > 0) {
        input.setValue('');
        screen.render();
    } else {
        return process.exit(0);
    }
});

module.exports = {
    emitter: emitter,
    outbox: outbox,
    screen: screen,
    input: input,
    meta: meta,
    line: line
};
