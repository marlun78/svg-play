'use strict';

var Controller = require('./app/controller');
var Model = require('./app/model');
var View = require('./app/view');

(function main() {
    var model = new Model();
    var view = new View(document.body);
    new Controller(model, view);
} ());
