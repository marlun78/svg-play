var geometry = require('../src/helpers/geometry');

describe('helpers/geometry', function () {
    describe('areaOfParallelogram', function () {
        it('should calculate the area of a parallelogram', function () {
            // Given
            var a = { x: 100, y: 100 };
            var b = { x: 200, y: 200 };
            var c = { x: 200, y: 100 };
            var d = { x: 100, y: 200 };
            // When
            var actual = geometry.areaOfParallelogram(a, b, c, d);
            // Then
            expect(actual).toBe(10000);
        });
    });

    describe('findForthVertex', function () {
        it('should find the forth vertex of a parallelogram', function () {
            // Given
            var a = { x: 100, y: 100 };
            var b = { x: 200, y: 200 };
            var c = { x: 200, y: 100 };
            // When
            var actual = geometry.findForthVertex(a, b, c);
            // Then
            expect(actual).toEqual({ x: 100, y: 200 });
        });
    });

    describe('findMidPoint', function () {
        it('should find the middle between two points', function () {
            // Given
            var a = { x: 0, y: 0 };
            var b = { x: 100, y: 100 };
            // When
            var actual = geometry.findMidPoint(a, b);
            // Then
            expect(actual).toEqual({ x: 50, y: 50 });
        });
    });
});
