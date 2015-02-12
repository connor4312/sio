var Handler = require('../handler');

function Connect () {
    Handler.apply(this, arguments);
}

Connect.prototype = new Handler();

Connect.prototype.dispatch = function (body) {
    this.parser.socket.connect(body);
};

Connect.prototype.getName = function () {
    return 'connect';
};

Connect.prototype.getAliases = function () {
    return ['c'];
};

Connect.prototype.getDescription = function () {
    return 'Connects to a socket.io server: `connect <host>:<port>`';
};

module.exports = Connect;
