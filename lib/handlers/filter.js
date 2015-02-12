var Handler = require('../handler');

function Filter () {
    Handler.apply(this, arguments);
}

Filter.prototype = new Handler();

Filter.prototype.dispatch = function (body) {
    this.parser.ui.output.filter(body);
};

Filter.prototype.getName = function () {
    return 'filter';
};

Filter.prototype.getAliases = function () {
    return ['f'];
};

Filter.prototype.getDescription = function () {
    return 'Filters events to match a glob pattern.';
};

module.exports = Filter;
