const suma = require('./sum');

test('Suma 1+2 debe dar 3 ', () => {
    expect(suma(1, 2)).toBe(3);
});

