var Handler = require('../handler');

function Quit () {
    Handler.apply(this, arguments);
}

Quit.prototype = new Handler();

Quit.prototype.dispatch = function () {
    process.exit(0);
};

Quit.prototype.getName = function () {
    return 'quit';
};

Quit.prototype.getAliases = function () {
    return ['q'];
};

Quit.prototype.getDescription = function () {
    return 'Exits the sio prompt.';
};

module.exports = Quit;
