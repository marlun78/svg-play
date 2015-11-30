'use strict';

module.exports = {
    addClass: function (element, className) {
        var classes = element.getAttribute('class');
        var value = classes ? classes + ' ' + className : className;
        element.setAttribute('class', value);
    },

    prependChild: function (parent, child) {
        parent.insertBefore(child, parent.firstChild);
    },

    removeClass: function (element, className) {
        var classes = element.getAttribute('class');
        if (classes) {
            classes = classes.replace(className, '');
            classes = classes.replace(/\s+/g, ' ');
            classes = classes.trim();
            element.setAttribute('class', classes);
        }
    }
};
