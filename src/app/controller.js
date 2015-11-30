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
