var ui = require('./lib/ui');
var parser = require('./lib/parser');

ui.boot();
parser.boot(ui);
