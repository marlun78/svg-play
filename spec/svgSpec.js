var svg = require('../src/helpers/svg');

var SVG_NS_URI = 'http://www.w3.org/2000/svg';
var originalGlobaDocument;

describe('helpers/svg', function () {
    var document, element;
    beforeEach(function () {
        originalGlobaDocument = global.document;
        element = {
            setAttribute: jasmine.createSpy('Element.setAttribute')
        };
        document = global.document = {
            createElementNS: jasmine.createSpy('document.createElementNS').and.returnValue(element)
        };
    });
    describe('createCircle', function () {
        it('should create an SVG <circle> element', function () {
            // Given
            var x = 100;
            var y = 100;
            var radius = 50;
            var attributes = {
                class: 'abc',
                id: 123
            };
            // When
            var actual = svg.createCircle(x, y, radius, attributes);
            // Then
            expect(actual).toBe(element);
            expect(document.createElementNS).toHaveBeenCalledWith(SVG_NS_URI, 'circle');
            expect(document.createElementNS.calls.count()).toBe(1);
            expect(element.setAttribute).toHaveBeenCalledWith('cx', x);
            expect(element.setAttribute).toHaveBeenCalledWith('cy', y);
            expect(element.setAttribute).toHaveBeenCalledWith('r', radius);
            expect(element.setAttribute).toHaveBeenCalledWith('class', 'abc');
            expect(element.setAttribute).toHaveBeenCalledWith('id', 123);
            expect(element.setAttribute.calls.count()).toBe(5);
        });
    });
    describe('createPath', function () {
        it('should create an SVG <path> element', function () {
            // Given
            var description = 'some description';
            var attributes = {
                class: 'abc',
                id: 123
            };
            // When
            var actual = svg.createPath(description, attributes);
            // Then
            expect(actual).toBe(element);
            expect(document.createElementNS).toHaveBeenCalledWith(SVG_NS_URI, 'path');
            expect(document.createElementNS.calls.count()).toBe(1);
            expect(element.setAttribute).toHaveBeenCalledWith('d', description);
            expect(element.setAttribute).toHaveBeenCalledWith('class', 'abc');
            expect(element.setAttribute).toHaveBeenCalledWith('id', 123);
            expect(element.setAttribute.calls.count()).toBe(3);
        });
    });
    afterEach(function () {
        global.document = originalGlobaDocument;
    });
});
