var string = require('../src/helpers/string');

describe('helpers/svg', function () {
    describe('replace', function () {
        it('should interpolate passed string template with passed data', function () {
            // Given
            var template = '${ 2.text } ${ 1 }';
            // When
            var actual = string.replace(template, 'world', { text: 'hello' });
            // Then
            expect(actual).toBe('hello world');
        });
    });
});
