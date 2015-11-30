var dom = require('../src/helpers/dom');

describe('helpers/dom', function () {
    describe('addClass', function () {
        var element;
        beforeEach(function () {
            element = {
                getAttribute: function () { },
                setAttribute: jasmine.createSpy('setAttribute'),
            };
        });
        it('should add passed class name to the element’s class list', function () {
            // Given
            spyOn(element, 'getAttribute').and.returnValue(null);
            // When
            dom.addClass(element, 'cherry');
            // Then
            expect(element.setAttribute).toHaveBeenCalledWith('class', 'cherry');
            expect(element.setAttribute.calls.count()).toBe(1);
        });
        it('should append passed class name to the element’s class list', function () {
            // Given
            spyOn(element, 'getAttribute').and.returnValue('apple banana');
            // When
            dom.addClass(element, 'cherry');
            // Then
            expect(element.setAttribute).toHaveBeenCalledWith('class', 'apple banana cherry');
            expect(element.setAttribute.calls.count()).toBe(1);
        });
    });

    describe('prependChild', function () {
        var parent;
        beforeEach(function () {
            parent = {
                firstChild: {},
                insertBefore: jasmine.createSpy('insertBefore'),
            };
        });
        it('should prepend an element to its parent’s child nodes', function () {
            // Given
            var child = {};
            // When
            dom.prependChild(parent, child);
            // Then
            expect(parent.insertBefore).toHaveBeenCalledWith(child, parent.firstChild);
            expect(parent.insertBefore.calls.count()).toBe(1);
        });
    });

    describe('removeClass', function () {
        var element;
        beforeEach(function () {
            element = {
                getAttribute: function () { },
                setAttribute: jasmine.createSpy('setAttribute'),
            };
        });
        it('should remove passed class name from the element’s class list', function () {
            // Given
            spyOn(element, 'getAttribute').and.returnValue(null);
            // When
            dom.removeClass(element, 'cherry');
            // Then
            expect(element.setAttribute.calls.count()).toBe(0);
        });
        it('should remove passed class name from the element’s class list', function () {
            // Given
            spyOn(element, 'getAttribute').and.returnValue('apple banana cherry');
            // When
            dom.removeClass(element, 'banana');
            // Then
            expect(element.setAttribute).toHaveBeenCalledWith('class', 'apple cherry');
            expect(element.setAttribute.calls.count()).toBe(1);
        });
    });
});
