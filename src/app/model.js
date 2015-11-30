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
