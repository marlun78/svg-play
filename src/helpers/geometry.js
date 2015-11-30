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
