export const CONSTANTS = {
  pi: { symbol: 'π', name: 'Pi', value: Math.PI },
  e: { symbol: 'e', name: 'Euler', value: Math.E },
  phi: { symbol: 'φ', name: 'Golden Ratio', value: (1 + Math.sqrt(5)) / 2 },
  sqrt2: { symbol: '√2', name: 'Square root of 2', value: Math.SQRT2 },
  sqrt3: { symbol: '√3', name: 'Square root of 3', value: Math.sqrt(3) },
  ln2: { symbol: 'ln(2)', name: 'ln(2)', value: Math.LN2 },
  ln10: { symbol: 'ln(10)', name: 'ln(10)', value: Math.LN10 }
};

export function toRadians(angle, mode) {
  if (mode === 'DEG') return (angle * Math.PI) / 180;
  if (mode === 'GRAD') return (angle * Math.PI) / 200;
  return angle;
}

export function fromRadians(rad, mode) {
  if (mode === 'DEG') return (rad * 180) / Math.PI;
  if (mode === 'GRAD') return (rad * 200) / Math.PI;
  return rad;
}

export function cleanFloat(num) {
  if (!Number.isFinite(num)) return num;
  if (Math.abs(num) < 1e-14) return 0;
  return parseFloat(num.toPrecision(12));
}

export function calculateSin(val, mode) {
  if (mode === 'DEG') {
    const norm = ((val % 360) + 360) % 360;
    if (norm === 0 || norm === 180 || norm === 360) return 0;
    if (norm === 90) return 1;
    if (norm === 270) return -1;
  } else if (mode === 'GRAD') {
    const norm = ((val % 400) + 400) % 400;
    if (norm === 0 || norm === 200 || norm === 400) return 0;
    if (norm === 100) return 1;
    if (norm === 300) return -1;
  }
  return cleanFloat(Math.sin(toRadians(val, mode)));
}

export function calculateCos(val, mode) {
  if (mode === 'DEG') {
    const norm = ((val % 360) + 360) % 360;
    if (norm === 90 || norm === 270) return 0;
    if (norm === 0 || norm === 360) return 1;
    if (norm === 180) return -1;
  } else if (mode === 'GRAD') {
    const norm = ((val % 400) + 400) % 400;
    if (norm === 100 || norm === 300) return 0;
    if (norm === 0 || norm === 400) return 1;
    if (norm === 200) return -1;
  }
  return cleanFloat(Math.cos(toRadians(val, mode)));
}

export function calculateTan(val, mode) {
  if (mode === 'DEG') {
    const norm = ((val % 360) + 360) % 360;
    if (norm === 90 || norm === 270) throw new Error('Undefined');
    if (norm === 0 || norm === 180 || norm === 360) return 0;
    if (norm === 45 || norm === 225) return 1;
    if (norm === 135 || norm === 315) return -1;
  } else if (mode === 'GRAD') {
    const norm = ((val % 400) + 400) % 400;
    if (norm === 100 || norm === 300) throw new Error('Undefined');
    if (norm === 0 || norm === 200 || norm === 400) return 0;
  }
  const cosVal = Math.cos(toRadians(val, mode));
  if (Math.abs(cosVal) < 1e-15) throw new Error('Undefined');
  return cleanFloat(Math.tan(toRadians(val, mode)));
}

export function calculateAsin(val, mode) {
  if (val < -1 || val > 1) throw new Error('Domain error');
  return cleanFloat(fromRadians(Math.asin(val), mode));
}

export function calculateAcos(val, mode) {
  if (val < -1 || val > 1) throw new Error('Domain error');
  return cleanFloat(fromRadians(Math.acos(val), mode));
}

export function calculateAtan(val, mode) {
  return cleanFloat(fromRadians(Math.atan(val), mode));
}

export function factorial(n) {
  if (!Number.isInteger(n) || n < 0) throw new Error('Invalid factorial');
  if (n > 170) throw new Error('Overflow');
  if (n === 0 || n === 1) return 1;
  let res = 1;
  for (let i = 2; i <= n; i++) res *= i;
  return res;
}

export function formatResult(num) {
  if (Number.isNaN(num)) return 'Error';
  if (!Number.isFinite(num)) return num > 0 ? 'Infinity' : '-Infinity';

  const cleaned = cleanFloat(num);
  if (cleaned === 0) return '0';

  const abs = Math.abs(cleaned);
  if (abs >= 1e12 || (abs > 0 && abs < 1e-7)) {
    return cleaned.toExponential(6).replace(/\.?0+e/, 'e');
  }

  let str = cleaned.toString();
  if (str.includes('.')) {
    const parts = str.split('.');
    if (parts[1].length > 8) {
      str = cleaned.toFixed(8).replace(/\.?0+$/, '');
    }
  }
  return str;
}
