/**
 * Basic line to be represented in the output.
 */
function Line () {
    this.time = new Date();
}

/**
 * Determines whether this line should be displayed in the output,
 * taking into account the active filters.
 *
 * @param  {[]String} filters
 * @return {Boolean}
 */
Line.prototype.shouldDisplay = function (filters) {
    return true;
};

module.exports = Line;
