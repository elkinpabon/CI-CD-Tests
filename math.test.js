const { factorial, fibonacci, isPrime, power } = require('./math');

describe('Math Functions', () => {
    
    describe('factorial', () => {
        test('factorial de 0 debe ser 1', () => {
            expect(factorial(0)).toBe(1);
        });

        test('factorial de 1 debe ser 1', () => {
            expect(factorial(1)).toBe(1);
        });

        test('factorial de números positivos', () => {
            expect(factorial(3)).toBe(6);
            expect(factorial(4)).toBe(24);
            expect(factorial(5)).toBe(120);
            expect(factorial(6)).toBe(720);
        });

        test('factorial de número negativo debe lanzar error', () => {
            expect(() => factorial(-1)).toThrow('El factorial no está definido para números negativos');
            expect(() => factorial(-5)).toThrow('El factorial no está definido para números negativos');
        });
    });

    describe('fibonacci', () => {
        test('fibonacci de 0 debe ser 0', () => {
            expect(fibonacci(0)).toBe(0);
        });

        test('fibonacci de 1 debe ser 1', () => {
            expect(fibonacci(1)).toBe(1);
        });

        test('secuencia de fibonacci correcta', () => {
            expect(fibonacci(2)).toBe(1);
            expect(fibonacci(3)).toBe(2);
            expect(fibonacci(4)).toBe(3);
            expect(fibonacci(5)).toBe(5);
            expect(fibonacci(6)).toBe(8);
            expect(fibonacci(7)).toBe(13);
            expect(fibonacci(10)).toBe(55);
        });

        test('fibonacci de número negativo debe lanzar error', () => {
            expect(() => fibonacci(-1)).toThrow('Fibonacci no está definido para números negativos');
            expect(() => fibonacci(-3)).toThrow('Fibonacci no está definido para números negativos');
        });
    });

    describe('isPrime', () => {
        test('números menores o iguales a 1 no son primos', () => {
            expect(isPrime(-5)).toBe(false);
            expect(isPrime(-1)).toBe(false);
            expect(isPrime(0)).toBe(false);
            expect(isPrime(1)).toBe(false);
        });

        test('números primos pequeños', () => {
            expect(isPrime(2)).toBe(true);
            expect(isPrime(3)).toBe(true);
            expect(isPrime(5)).toBe(true);
            expect(isPrime(7)).toBe(true);
            expect(isPrime(11)).toBe(true);
            expect(isPrime(13)).toBe(true);
        });

        test('números no primos', () => {
            expect(isPrime(4)).toBe(false);
            expect(isPrime(6)).toBe(false);
            expect(isPrime(8)).toBe(false);
            expect(isPrime(9)).toBe(false);
            expect(isPrime(10)).toBe(false);
            expect(isPrime(12)).toBe(false);
            expect(isPrime(15)).toBe(false);
            expect(isPrime(25)).toBe(false);
        });

        test('números primos más grandes', () => {
            expect(isPrime(17)).toBe(true);
            expect(isPrime(19)).toBe(true);
            expect(isPrime(23)).toBe(true);
            expect(isPrime(29)).toBe(true);
            expect(isPrime(97)).toBe(true);
        });
    });

    describe('power', () => {
        test('cualquier número elevado a 0 es 1', () => {
            expect(power(2, 0)).toBe(1);
            expect(power(5, 0)).toBe(1);
            expect(power(-3, 0)).toBe(1);
            expect(power(0, 0)).toBe(1);
        });

        test('exponentes positivos', () => {
            expect(power(2, 1)).toBe(2);
            expect(power(2, 2)).toBe(4);
            expect(power(2, 3)).toBe(8);
            expect(power(3, 2)).toBe(9);
            expect(power(3, 3)).toBe(27);
            expect(power(5, 2)).toBe(25);
        });

        test('exponentes negativos', () => {
            expect(power(2, -1)).toBe(0.5);
            expect(power(2, -2)).toBe(0.25);
            expect(power(4, -2)).toBe(0.0625);
            expect(power(10, -1)).toBe(0.1);
        });

        test('base negativa', () => {
            expect(power(-2, 2)).toBe(4);
            expect(power(-2, 3)).toBe(-8);
            expect(power(-3, 2)).toBe(9);
            expect(power(-3, 3)).toBe(-27);
        });

        test('casos especiales', () => {
            expect(power(0, 1)).toBe(0);
            expect(power(0, 5)).toBe(0);
            expect(power(1, 100)).toBe(1);
            expect(power(-1, 2)).toBe(1);
            expect(power(-1, 3)).toBe(-1);
        });
    });
});