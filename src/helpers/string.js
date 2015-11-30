'use strict';

module.exports = {
    /**
     * Replaces embedded expressions within a string with values passed after the formula
     * @example
     * replace('Hello ${1}', 'World'); => 'Hello World'
     * replace('Hello ${1.name}', {name: 'Martin'}); => 'Hello Martin'
     * @public
     * @param {string} formula - A string containing the embedded expressions
     * @param {...*} [data] - Any number of referenced arguments
     * @returns {string}
     */
    replace: function (formula, data) {
        var args = arguments;
        return formula.replace(/\$\{\s*(\d+)(?:\.([A-Za-z_0-9]+))?\s*\}/g, function (match, position, property) {
            return property ? args[position][property] : args[position];
        });
    }
};
