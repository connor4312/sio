var Handler = require('../handler');

function Pause () {
    Handler.apply(this, arguments);
}

Pause.prototype = new Handler();

Pause.prototype.dispatch = function () {
    this.parser.ui.output.pause();
};

Pause.prototype.getName = function () {
    return 'pause';
};

Pause.prototype.getAliases = function () {
    return ['p'];
};

Pause.prototype.getDescription = function () {
    return 'Pauses the output.';
};

module.exports = Pause;
