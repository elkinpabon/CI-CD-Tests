/**
 * Calcula una nota final ponderada a partir de componentes con peso
 */
function calcWeightedGrade(items) {
    if (!Array.isArray(items) || items.length === 0) {
        throw new TypeError('items debe ser un arreglo no vacío');
    }
    
    let totalScore = 0;
    let totalWeight = 0;
    
    for (const item of items) {
        if (typeof item?.score !== 'number' || typeof item?.weight !== 'number') {
            throw new TypeError('score y weight deben ser números');
        }
        
        if (item.score < 0 || item.score > 100) {
            throw new RangeError('score debe estar entre 0 y 100');
        }
        
        if (item.weight < 0 || item.weight > 1) {
            throw new RangeError('weight debe estar entre 0 y 1');
        }
        
        totalScore += item.score * item.weight;
        totalWeight += item.weight;
    }
    
    if (Math.abs(totalWeight - 1) > 0.001) {
        throw new RangeError('La suma de weights debe ser 1 (±0.001)');
    }
    
    return parseFloat(totalScore.toFixed(2));
}

/**
 * Devuelve el percentil p
 */
function percentile(p, values) {
    if (typeof p !== 'number' || p < 0 || p > 100) {
        throw new RangeError('p debe ser un número entre 0 y 100');
    }
    
    if (!Array.isArray(values) || values.length === 0) {
        throw new TypeError('values debe ser un arreglo no vacío');
    }
    
    if (!values.every(v => typeof v === 'number')) {
        throw new TypeError('Todos los valores deben ser números');
    }
    
    const sorted = [...values].sort((a, b) => a - b);
    
    if (p === 0) return parseFloat(sorted[0].toFixed(2));
    if (p === 100) return parseFloat(sorted[sorted.length - 1].toFixed(2));
    
    const rank = Math.ceil((p / 100) * sorted.length);
    return parseFloat(sorted[rank - 1].toFixed(2));
}

module.exports = { calcWeightedGrade, percentile };