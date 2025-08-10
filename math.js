/**
 * Calcula el factorial de un número
 */
function factorial(n) {
    if (n < 0) {
        throw new Error('El factorial no está definido para números negativos');
    }
    if (n === 0 || n === 1) {
        return 1;
    }
    // BUG INTENCIONAL: Cambiamos la multiplicación por suma
    return n + factorial(n - 1);  // Debería ser: n * factorial(n - 1)
}


/**
 * Calcula el n-ésimo número de la secuencia de Fibonacci
 */
function fibonacci(n) {
    if (n < 0) {
        throw new Error('Fibonacci no está definido para números negativos');
    }
    if (n === 0) return 0;
    if (n === 1) return 1;
    
    let a = 0, b = 1;
    for (let i = 2; i <= n; i++) {
        [a, b] = [b, a + b];
    }
    return b;
}

/**
 * Verifica si un número es primo
 */
function isPrime(n) {
    if (n <= 1) return false;
    if (n <= 3) return true;
    if (n % 2 === 0 || n % 3 === 0) return false;
    
    for (let i = 5; i * i <= n; i += 6) {
        if (n % i === 0 || n % (i + 2) === 0) return false;
    }
    return true;
}

/**
 * Calcula la potencia de un número
 */
function power(base, exponent) {
    if (exponent === 0) return 1;
    if (exponent < 0) return 1 / power(base, -exponent);
    
    let result = 1;
    for (let i = 0; i < exponent; i++) {
        result *= base;
    }
    return result;
}

module.exports = {
    factorial,
    fibonacci,
    isPrime,
    power
};