'use strict';

var SVG_NS_URI = 'http://www.w3.org/2000/svg';

module.exports = {
    createCircle: function (cx, cy, radius, attributes) {
        var circle = document.createElementNS(SVG_NS_URI, 'circle');
        circle.setAttribute('cx', cx);
        circle.setAttribute('cy', cy);
        circle.setAttribute('r', radius);
        addAttributes(circle, attributes);
        return circle;
    },

    createPath: function (description, attributes) {
        var path = document.createElementNS(SVG_NS_URI, 'path');
        path.setAttribute('d', description);
        addAttributes(path, attributes);
        return path;
    }
};

function addAttributes(element, attributes) {
    for (var key in attributes) {
        if (attributes.hasOwnProperty(key)) {
            element.setAttribute(key, attributes[key]);
        }
    }
    return element;
}
