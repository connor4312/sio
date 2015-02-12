/**
 * Adds padding to the string until it is a given length.
 * @param  {String} str
 * @param  {String} padding
 * @param  {Number} length
 * @return {Strin}
 */
module.exports.pad = function (str, padding, length) {
    while (str.length < length) {
        str += padding;
    }

    return str;
};

/**
 * Wraps a text in a Blessed tag.
 *
 * @param  {String} text
 * @param  {String} tag
 * @return {String}
 */
module.exports.wrap = function (text, tag) {
    return '{' + tag + '}' + text + '{/' + tag + '}';
};

/**
 * Returns a pretty-printed event string.
 * @param  {Array} args
 * @return {String}
 */
module.exports.prettifyEvent = function (args) {
    if (!args.length) {
        return '';
    }

    var output = '`' + args[0] + '`';
    if (args.length > 1) {
        output += ':  ' + args.slice(1).map(function (a) {
            return JSON.stringify(a) + ' ';
        });
    }

    return output;
};
