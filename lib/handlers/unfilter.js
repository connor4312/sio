var Handler = require('../handler');

function Unfilter () {
    Handler.apply(this, arguments);
}

Unfilter.prototype = new Handler();

Unfilter.prototype.dispatch = function (body) {
    this.parser.ui.output.unfilter(body);
};

Unfilter.prototype.getName = function () {
    return 'unfilter';
};

Unfilter.prototype.getAliases = function () {
    return ['uf'];
};

Unfilter.prototype.getDescription = function () {
    return 'Removes one or all patterns from the filters.';
};

module.exports = Unfilter;
