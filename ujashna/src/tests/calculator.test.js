import { describe, it, expect } from 'vitest';
import { evaluateExpression } from '../utils/evaluator.js';
import { solveQuadratic, calculateCombination, calculatePermutation } from '../utils/solver.js';

describe('Calculator Basic Arithmetic & Precedence', () => {
  it('evaluates 2 + 2 = 4', () => {
    const res = evaluateExpression('2 + 2', 'DEG');
    expect(res.success).toBe(true);
    expect(res.value).toBe(4);
    expect(res.formatted).toBe('4');
  });

  it('evaluates 2 × 5 = 10', () => {
    const res = evaluateExpression('2 * 5', 'DEG');
    expect(res.success).toBe(true);
    expect(res.value).toBe(10);
  });

  it('evaluates 10 / 2 = 5', () => {
    const res = evaluateExpression('10 / 2', 'DEG');
    expect(res.success).toBe(true);
    expect(res.value).toBe(5);
  });

  it('respects operator precedence: 2 + 3 * 4 = 14', () => {
    const res = evaluateExpression('2 + 3 * 4', 'DEG');
    expect(res.success).toBe(true);
    expect(res.value).toBe(14);
  });

  it('respects parentheses: (12 + 5) * 3 = 51', () => {
    const res = evaluateExpression('(12 + 5) * 3', 'DEG');
    expect(res.success).toBe(true);
    expect(res.value).toBe(51);
  });

  it('handles negative numbers: -25 + 10 = -15', () => {
    const res = evaluateExpression('-25 + 10', 'DEG');
    expect(res.success).toBe(true);
    expect(res.value).toBe(-15);
  });

  it('handles floating point addition cleanly: 0.1 + 0.2 = 0.3', () => {
    const res = evaluateExpression('0.1 + 0.2', 'DEG');
    expect(res.success).toBe(true);
    expect(res.value).toBe(0.3);
    expect(res.formatted).toBe('0.3');
  });
});

describe('Scientific Functions & Powers', () => {
  it('evaluates 2^10 = 1024', () => {
    const res = evaluateExpression('2^10', 'DEG');
    expect(res.success).toBe(true);
    expect(res.value).toBe(1024);
  });

  it('evaluates sqrt(144) = 12', () => {
    const res = evaluateExpression('sqrt(144)', 'DEG');
    expect(res.success).toBe(true);
    expect(res.value).toBe(12);
  });

  it('evaluates 5! = 120', () => {
    const res = evaluateExpression('5!', 'DEG');
    expect(res.success).toBe(true);
    expect(res.value).toBe(120);
  });

  it('evaluates log(100) = 2', () => {
    const res = evaluateExpression('log(100)', 'DEG');
    expect(res.success).toBe(true);
    expect(res.value).toBe(2);
  });

  it('evaluates ln(e) = 1', () => {
    const res = evaluateExpression('ln(e)', 'DEG');
    expect(res.success).toBe(true);
    expect(res.value).toBe(1);
  });

  it('evaluates cbrt(27) = 3', () => {
    const res = evaluateExpression('cbrt(27)', 'DEG');
    expect(res.success).toBe(true);
    expect(res.value).toBe(3);
  });

  it('evaluates percentages: 50% = 0.5', () => {
    const res = evaluateExpression('50%', 'DEG');
    expect(res.success).toBe(true);
    expect(res.value).toBe(0.5);
  });
});

describe('Angle Modes: DEG, RAD, GRAD', () => {
  it('calculates sin(90) in DEG = 1', () => {
    const res = evaluateExpression('sin(90)', 'DEG');
    expect(res.success).toBe(true);
    expect(res.value).toBe(1);
  });

  it('calculates cos(0) in DEG = 1', () => {
    const res = evaluateExpression('cos(0)', 'DEG');
    expect(res.success).toBe(true);
    expect(res.value).toBe(1);
  });

  it('calculates sin(180) in DEG = 0 (clean float)', () => {
    const res = evaluateExpression('sin(180)', 'DEG');
    expect(res.success).toBe(true);
    expect(res.value).toBe(0);
  });

  it('calculates sin(pi/2) in RAD = 1', () => {
    const res = evaluateExpression('sin(π / 2)', 'RAD');
    expect(res.success).toBe(true);
    expect(res.value).toBe(1);
  });

  it('calculates sin(100) in GRAD = 1', () => {
    const res = evaluateExpression('sin(100)', 'GRAD');
    expect(res.success).toBe(true);
    expect(res.value).toBe(1);
  });

  it('calculates tan(45) in DEG = 1', () => {
    const res = evaluateExpression('tan(45)', 'DEG');
    expect(res.success).toBe(true);
    expect(res.value).toBe(1);
  });

  it('calculates asin(1) in DEG = 90', () => {
    const res = evaluateExpression('asin(1)', 'DEG');
    expect(res.success).toBe(true);
    expect(res.value).toBe(90);
  });
});

describe('Error Handling', () => {
  it('catches division by zero', () => {
    const res = evaluateExpression('10 / 0', 'DEG');
    expect(res.success).toBe(false);
  });

  it('catches negative square root', () => {
    const res = evaluateExpression('sqrt(-5)', 'DEG');
    expect(res.success).toBe(false);
  });

  it('catches invalid log argument', () => {
    const res = evaluateExpression('log(-10)', 'DEG');
    expect(res.success).toBe(false);
  });

  it('catches mismatched parentheses', () => {
    const res = evaluateExpression('(2 + 5', 'DEG');
    expect(res.success).toBe(false);
  });
});

describe('Engineering Tools', () => {
  it('solves quadratic equation x^2 - 5x + 6 = 0 with roots 3 and 2', () => {
    const res = solveQuadratic(1, -5, 6);
    expect(res.rootType).toBe('two-real');
    expect(res.roots).toContain('x₁ = 3');
    expect(res.roots).toContain('x₂ = 2');
  });

  it('solves quadratic equation with complex roots: x^2 + 1 = 0', () => {
    const res = solveQuadratic(1, 0, 1);
    expect(res.rootType).toBe('complex');
    expect(res.roots[0]).toContain('i');
  });

  it('calculates permutation 5P2 = 20', () => {
    expect(calculatePermutation(5, 2)).toBe(20);
  });

  it('calculates combination 5C2 = 10', () => {
    expect(calculateCombination(5, 2)).toBe(10);
  });
});
