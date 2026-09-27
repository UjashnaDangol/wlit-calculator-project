import { factorial, formatResult, cleanFloat } from './math.js';

export function solveQuadratic(a, b, c) {
  if (a === 0) {
    if (b === 0) return { rootType: 'invalid', roots: [] };
    const x = cleanFloat(-c / b);
    return { rootType: 'linear', roots: [`x = ${formatResult(x)}`] };
  }

  const disc = cleanFloat(b * b - 4 * a * c);

  if (disc > 0) {
    const sqrtDisc = Math.sqrt(disc);
    const x1 = cleanFloat((-b + sqrtDisc) / (2 * a));
    const x2 = cleanFloat((-b - sqrtDisc) / (2 * a));
    return {
      rootType: 'two-real',
      discriminant: disc,
      roots: [`x₁ = ${formatResult(x1)}`, `x₂ = ${formatResult(x2)}`]
    };
  } else if (disc === 0) {
    const x = cleanFloat(-b / (2 * a));
    return {
      rootType: 'one-real',
      discriminant: 0,
      roots: [`x = ${formatResult(x)}`]
    };
  } else {
    const real = cleanFloat(-b / (2 * a));
    const imag = cleanFloat(Math.sqrt(-disc) / (2 * Math.abs(a)));
    return {
      rootType: 'complex',
      discriminant: disc,
      roots: [
        `x₁ = ${formatResult(real)} + ${formatResult(imag)}i`,
        `x₂ = ${formatResult(real)} - ${formatResult(imag)}i`
      ]
    };
  }
}

export function calculatePermutation(n, r) {
  if (n < 0 || r < 0 || !Number.isInteger(n) || !Number.isInteger(r)) throw new Error('Must be positive integers');
  if (r > n) return 0;
  return factorial(n) / factorial(n - r);
}

export function calculateCombination(n, r) {
  if (n < 0 || r < 0 || !Number.isInteger(n) || !Number.isInteger(r)) throw new Error('Must be positive integers');
  if (r > n) return 0;
  return factorial(n) / (factorial(r) * factorial(n - r));
}

export function calculateStatistics(numbers) {
  if (!numbers || numbers.length === 0) throw new Error('Empty list');
  const sorted = [...numbers].sort((a, b) => a - b);
  const count = sorted.length;
  const sum = sorted.reduce((acc, curr) => acc + curr, 0);
  const mean = sum / count;

  let median;
  const mid = Math.floor(count / 2);
  if (count % 2 === 0) {
    median = (sorted[mid - 1] + sorted[mid]) / 2;
  } else {
    median = sorted[mid];
  }

  let variance = 0;
  if (count > 1) {
    const sumSq = sorted.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0);
    variance = sumSq / (count - 1);
  }

  return {
    count,
    sum: cleanFloat(sum),
    mean: cleanFloat(mean),
    median: cleanFloat(median),
    min: cleanFloat(sorted[0]),
    max: cleanFloat(sorted[count - 1]),
    stdDev: cleanFloat(Math.sqrt(variance))
  };
}
