(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var geometry = require('../helpers/geometry');

module.exports = Controller;

function Controller(model, view) {
    this.model = model;
    this.view = view;

    this.view.bind('point:move', this.onPointMove.bind(this));
    this.view.bind('reset:click', this.onReset.bind(this));
    this.view.bind('svg:click', this.onSvgClick.bind(this));
}

Controller.FORTH_INDEX = Controller.MAX_POINT_COUNT = 3;
Controller.POINT_RADIUS = 5.5;

Controller.prototype = {
    constructor: Controller,

    onPointMove: function (index, x, y) {
        this.model.set(index, { x: x, y: y });
        this.update();
    },

    onReset: function () {
        this.model.delete();
        this.view.clearStats();
        this.view.disableDragging();
        this.view.removeAll();
    },

    onSvgClick: function (event) {
        var count = this.model.count();
        if (count < Controller.MAX_POINT_COUNT) {
            this.createPoint(count, event.clientX, event.clientY);
            if (count === Controller.MAX_POINT_COUNT - 1) {
                this.createShapes();
                this.view.enableDragging();
            }
        }
    },

    createPoint: function (index, x, y) {
        var position = { x: x, y: y };
        this.model.set(index, position);
        this.view.createPoint(index, position, Controller.POINT_RADIUS);
    },

    createShapes: function () {
        this.view.createPoint(Controller.FORTH_INDEX, { x: 0, y: 0 }, Controller.POINT_RADIUS, true);
        this.view.createParallelogram();
        this.view.createCircle();
        this.update();
    },

    update: function () {
        var a = this.model.get(0);
        var b = this.model.get(1);
        var c = this.model.get(2);
        var d = geometry.findForthVertex(a, b, c);

        var area = geometry.areaOfParallelogram(a, c, b, d);
        var center = geometry.findMidPoint(a, b);
        var radius = Math.sqrt(area / Math.PI);
        this.view.updateCircle(center, radius);

        this.view.updateParallelogram(a, b, c, d);

        this.view.updatePoint(0, a);
        this.view.updatePoint(1, b);
        this.view.updatePoint(2, c);
        this.view.updatePoint(3, d);

        this.view.updateStats(a, b, c, Math.round(area));
    }
};

},{"../helpers/geometry":5}],2:[function(require,module,exports){
'use strict';

module.exports = Model;

function Model() {
    this.items = [];
}

Model.prototype = {
    constructor: Model,

    count: function () {
        return this.items.length;
    },

    delete: function () {
        this.items.length = 0;
        return this;
    },

    get: function (index) {
        return this.items[index];
    },

    set: function (index, item) {
        this.items[index] = item;
        return this;
    }
};

},{}],3:[function(require,module,exports){
'use strict';

var dom = require('../helpers/dom');
var string = require('../helpers/string');
var svg = require('../helpers/svg');

module.exports = View;

function View(root) {
    this.root = root;
    this.dragging = null;
    this.draggingEnabled = false;

    this.$reset = root.querySelector('#reset');
    this.$stats = root.querySelector('#stats');
    this.$svg = root.querySelector('#svg');

    this.$svg.addEventListener('mousemove', this.onSvgMouseMove.bind(this));
    this.$svg.addEventListener('mouseup', this.onSvgMouseUp.bind(this));

    this.circle = null;
    this.parallelogram = null;
    this.points = [];
}

View.DRAGGING_CLASS = 'dragging';

View.prototype = {
    constructor: View,

    bind: function (event, handler) {
        if (event === 'reset:click') {
            this.$reset.addEventListener('click', handler);
        } else if (event === 'svg:click') {
            this.$svg.addEventListener('click', handler);
        } else if (event === 'point:move') {
            this.onPointMove = handler;
        }
    },

    createCircle: function () {
        this.circle = svg.createCircle(0, 0, 0, { 'class': 'circle' });
        dom.prependChild(this.$svg, this.circle);
    },

    createParallelogram: function () {
        this.parallelogram = svg.createPath('', { 'class': 'parallelogram' });
        dom.prependChild(this.$svg, this.parallelogram);
    },

    createPoint: function (index, position, radius, disabled) {
        var handler;
        var element = svg.createCircle(position.x, position.y, radius, {
            'class': disabled ? 'point-disabled' : 'point',
            'data-index': index
        });
        if (!disabled) {
            handler = this.onPointMouseDown.bind(this);
            element.addEventListener('mousedown', handler, false);
        }
        this.points.push({
            element: element,
            handler: handler
        });
        dom.prependChild(this.$svg, element);
    },

    disableDragging: function () {
        this.draggingEnabled = false;
        dom.removeClass(this.$svg, View.DRAGGING_CLASS);
    },

    enableDragging: function () {
        dom.addClass(this.$svg, View.DRAGGING_CLASS);
        this.draggingEnabled = true;
    },

    removeAll: function () {
        var self = this;

        this.$svg.removeChild(this.circle);
        this.circle = null;

        this.$svg.removeChild(this.parallelogram);
        this.parallelogram = null;

        this.points.forEach(function (point) {
            point.element.removeEventListener('mousedown', point.handler);
            self.$svg.removeChild(point.element);
        });
        this.points = [];
    },

    updateCircle: function (position, radius) {
        this.circle.setAttribute('cx', position.x);
        this.circle.setAttribute('cy', position.y);
        this.circle.setAttribute('r', radius);
    },

    updateParallelogram: function (a, b, c, d) {
        var description = toParallelogramPath(a, b, c, d);
        this.parallelogram.setAttribute('d', description);
    },

    updatePoint: function (index, position) {
        var point = this.points[index].element;
        point.setAttribute('cx', position.x);
        point.setAttribute('cy', position.y);
    },

    clearStats: function () {
        this.$stats.innerHTML = '';
    },

    updateStats: function (a, b, c, area) {
        this.$stats.innerHTML = string.replace('' +
            'Point 1: ${ 1.x },${ 1.y }<br>' +
            'Point 2: ${ 2.x },${ 2.y }<br>' +
            'Point 3: ${ 3.x },${ 3.y }<br>' +
            'Area:    ${ 4 }', a, b, c, area);
    },

    onPointMouseDown: function (event) {
        if (this.draggingEnabled) {
            this.dragging = event.target;
        }
    },

    onSvgMouseMove: function (event) {
        var index;
        if (this.dragging) {
            index = parseInt(this.dragging.getAttribute('data-index'), 10);
            this.onPointMove(index, event.clientX, event.clientY);
        }
    },

    onSvgMouseUp: function (event) {
        this.dragging = null;
    }
};

function toParallelogramPath(a, b, c, d) {
    return string.replace('M${1.x} ${1.y} L${2.x} ${2.y} L${3.x} ${3.y} L${4.x} ${4.y} Z', a, c, b, d);
}

},{"../helpers/dom":4,"../helpers/string":6,"../helpers/svg":7}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
'use strict';

module.exports = {
    areaOfParallelogram: function (pointA, pointB, pointC, pointD) {
        return areaOfTriangle(pointA, pointB, pointC) * 2;
    },

    findForthVertex: function (pointA, pointB, pointC) {
        var midPoint = this.findMidPoint(pointA, pointB);
        return {
            x: midPoint.x * 2 - pointC.x,
            y: midPoint.y * 2 - pointC.y
        };
    },

    findMidPoint: function (pointA, pointB) {
        return {
            x: (pointA.x + pointB.x) / 2,
            y: (pointA.y + pointB.y) / 2
        };
    }
};

function areaOfTriangle(pointA, pointB, pointC) {
    var sideA = distance(pointA, pointB);
    var sideB = distance(pointB, pointC);
    var sideC = distance(pointC, pointA);
    var s = semiperimeter(sideA, sideB, sideC);
    return Math.sqrt(s * (s - sideA) * (s - sideB) * (s - sideC));
}

function distance(pointA, pointB) {
    var dx = pointA.x - pointB.x;
    var dy = pointA.y - pointB.y;
    return Math.sqrt(dx * dx + dy * dy);
}

function semiperimeter(sideA, sideB, sideC) {
    var perimeter = sideA + sideB + sideC;
    return perimeter / 2;
}

},{}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
'use strict';

var Controller = require('./app/controller');
var Model = require('./app/model');
var View = require('./app/view');

(function main() {
    var model = new Model();
    var view = new View(document.body);
    new Controller(model, view);
} ());

},{"./app/controller":1,"./app/model":2,"./app/view":3}]},{},[8]);
