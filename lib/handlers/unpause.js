var Handler = require('../handler');

function Unpause () {
    Handler.apply(this, arguments);
}

Unpause.prototype = new Handler();

Unpause.prototype.dispatch = function () {
    this.parser.ui.output.unpause();
};

Unpause.prototype.getName = function () {
    return 'unpause';
};

Unpause.prototype.getAliases = function () {
    return ['up'];
};

Unpause.prototype.getDescription = function () {
    return 'Unpauses the output.';
};

module.exports = Unpause;
