var Handler = require('../handler');
var util = require('../util');
var ErrorMessage = require('../ui/lines/errorMessage');

function Connect () {
    Handler.apply(this, arguments);
}

Connect.prototype = new Handler();

Connect.prototype.dispatch = function (body) {
    var parts = util.splitFirst(body, '#');
    var data, event = parts[0].trim();
    try {
        data = (new Function('return ' + parts[1] + ';'))(); // jshint ignore:line
    } catch (e) {
        return this.parser.ui.output.add(new ErrorMessage(e.toString())).draw();
    }

    this.parser.socket.emit(event, data);
};

Connect.prototype.getName = function () {
    return 'emit';
};

Connect.prototype.getAliases = function () {
    return ['e'];
};

Connect.prototype.getDescription = function () {
    return 'Emits an event like `event#{ foo: \'bar\' }`';
};

module.exports = Connect;
