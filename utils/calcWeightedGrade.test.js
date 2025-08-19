const { calcWeightedGrade, percentile } = require('./calcWeightedGrade');

describe('calcWeightedGrade', () => {
    test('caso de referencia', () => {
        expect(calcWeightedGrade([{score:80,weight:0.4},{score:90,weight:0.6}])).toBe(86.00);
    });
    
    test('multiples componentes', () => {
        expect(calcWeightedGrade([
            {score:85,weight:0.3},
            {score:90,weight:0.4},
            {score:75,weight:0.3}
        ])).toBe(84.00);
    });
    
    test('errores de validacion', () => {
        expect(() => calcWeightedGrade(null)).toThrow(TypeError);
        expect(() => calcWeightedGrade([])).toThrow(TypeError);
        expect(() => calcWeightedGrade([{score:'80',weight:0.5}])).toThrow(TypeError);
        expect(() => calcWeightedGrade([{score:101,weight:1}])).toThrow(RangeError);
        expect(() => calcWeightedGrade([{score:80,weight:1.1}])).toThrow(RangeError);
        expect(() => calcWeightedGrade([{score:80,weight:0.5}])).toThrow(RangeError);
    });
});

describe('percentile', () => {
    test('casos de referencia', () => {
        expect(percentile(0,[1,2,3])).toBe(1.00);
        expect(percentile(100,[1,2,3])).toBe(3.00);
        expect(percentile(50,[1,2,3,4])).toBe(2.00);
    });
    
    test('casos adicionales', () => {
        expect(percentile(25,[1,2,3,4])).toBe(1.00);
        expect(percentile(75,[1,2,3,4])).toBe(3.00);
        expect(percentile(50,[4,1,3,2])).toBe(2.00);
    });
    
    test('errores de validacion', () => {
        expect(() => percentile('50',[1,2,3])).toThrow(RangeError);
        expect(() => percentile(-1,[1,2,3])).toThrow(RangeError);
        expect(() => percentile(101,[1,2,3])).toThrow(RangeError);
        expect(() => percentile(50,null)).toThrow(TypeError);
        expect(() => percentile(50,[])).toThrow(TypeError);
        expect(() => percentile(50,[1,'2',3])).toThrow(TypeError);
    });
});