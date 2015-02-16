var Handler = require('../handler');

function Clear () {
    Handler.apply(this, arguments);
}

Clear.prototype = new Handler();

Clear.prototype.dispatch = function () {
    this.parser.ui.output.clear();
};

Clear.prototype.getName = function () {
    return 'clear';
};

Clear.prototype.getAliases = function () {
    return ['cls'];
};

Clear.prototype.getDescription = function () {
    return 'Clears the output frame.';
};

module.exports = Clear;
