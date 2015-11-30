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
