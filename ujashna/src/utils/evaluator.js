import {
  calculateSin,
  calculateCos,
  calculateTan,
  calculateAsin,
  calculateAcos,
  calculateAtan,
  factorial,
  cleanFloat,
  formatResult,
  CONSTANTS
} from './math.js';

const PRECEDENCE = {
  '+': 2,
  '-': 2,
  '*': 3,
  '/': 3,
  '%': 3,
  'mod': 3,
  '^': 4,
  'u-': 5
};

const FUNCTION_NAMES = [
  'sin', 'cos', 'tan',
  'asin', 'acos', 'atan',
  'sinh', 'cosh', 'tanh',
  'log', 'ln',
  'sqrt', 'cbrt', 'abs',
  'exp', 'inv'
];

export function normalizeExpression(expr) {
  let s = (expr || '').trim();
  s = s.replace(/×/g, '*');
  s = s.replace(/÷/g, '/');
  s = s.replace(/−/g, '-');
  s = s.replace(/√\(/g, 'sqrt(');
  s = s.replace(/√([0-9.a-zA-Zπeφ]+)/g, 'sqrt($1)');
  s = s.replace(/∛\(/g, 'cbrt(');
  s = s.replace(/∛([0-9.a-zA-Zπeφ]+)/g, 'cbrt($1)');
  return s;
}

export function tokenize(rawExpr) {
  const expr = normalizeExpression(rawExpr);
  const tokens = [];
  let i = 0;

  const isDigit = (c) => /[0-9]/.test(c);
  const isAlpha = (c) => /[a-zA-Zπeφ]/.test(c);

  while (i < expr.length) {
    const char = expr[i];

    if (/\s/.test(char)) {
      i++;
      continue;
    }

    if (isDigit(char) || (char === '.' && isDigit(expr[i + 1] || ''))) {
      let numStr = '';
      while (i < expr.length && (isDigit(expr[i]) || expr[i] === '.')) {
        numStr += expr[i];
        i++;
      }
      if (i < expr.length && (expr[i] === 'e' || expr[i] === 'E') && isDigit(expr[i + 1] || '')) {
        numStr += expr[i++];
        if (expr[i] === '+' || expr[i] === '-') numStr += expr[i++];
        while (i < expr.length && isDigit(expr[i])) numStr += expr[i++];
      }
      tokens.push({ type: 'NUMBER', value: numStr });
      continue;
    }

    if (char === 'π' || (char === 'e' && !isAlpha(expr[i + 1] || '')) || char === 'φ') {
      const val = char === 'π' ? CONSTANTS.pi.value.toString() :
                  char === 'e' ? CONSTANTS.e.value.toString() :
                  CONSTANTS.phi.value.toString();
      tokens.push({ type: 'NUMBER', value: val });
      i++;
      continue;
    }

    if (isAlpha(char)) {
      let word = '';
      while (i < expr.length && isAlpha(expr[i])) {
        word += expr[i++];
      }
      if (word === 'mod') {
        tokens.push({ type: 'OP', value: 'mod' });
      } else if (FUNCTION_NAMES.includes(word)) {
        tokens.push({ type: 'FUNC', value: word });
      } else if (word === 'pi') {
        tokens.push({ type: 'NUMBER', value: Math.PI.toString() });
      } else {
        throw new Error(`Unknown function: ${word}`);
      }
      continue;
    }

    if (char === '!') {
      tokens.push({ type: 'POSTFIX', value: '!' });
      i++;
      continue;
    }
    if (char === '%') {
      tokens.push({ type: 'POSTFIX', value: '%' });
      i++;
      continue;
    }

    if (char === '(') {
      tokens.push({ type: 'LPAREN', value: '(' });
      i++;
      continue;
    }
    if (char === ')') {
      tokens.push({ type: 'RPAREN', value: ')' });
      i++;
      continue;
    }

    if (['+', '-', '*', '/', '^'].includes(char)) {
      const prev = tokens[tokens.length - 1];
      const isUnary = !prev || prev.type === 'OP' || prev.type === 'LPAREN';
      if (isUnary) {
        if (char === '-') tokens.push({ type: 'OP', value: 'u-' });
      } else {
        tokens.push({ type: 'OP', value: char });
      }
      i++;
      continue;
    }

    throw new Error(`Unrecognized symbol: ${char}`);
  }

  const expanded = [];
  for (let j = 0; j < tokens.length; j++) {
    const curr = tokens[j];
    const prev = expanded[expanded.length - 1];
    if (prev) {
      const needsMultiply =
        (prev.type === 'NUMBER' && curr.type === 'LPAREN') ||
        (prev.type === 'NUMBER' && curr.type === 'FUNC') ||
        (prev.type === 'RPAREN' && curr.type === 'LPAREN') ||
        (prev.type === 'RPAREN' && curr.type === 'NUMBER') ||
        (prev.type === 'RPAREN' && curr.type === 'FUNC') ||
        (prev.type === 'POSTFIX' && curr.type === 'NUMBER') ||
        (prev.type === 'POSTFIX' && curr.type === 'LPAREN') ||
        (prev.type === 'POSTFIX' && curr.type === 'FUNC');
      if (needsMultiply) {
        expanded.push({ type: 'OP', value: '*' });
      }
    }
    expanded.push(curr);
  }

  return expanded;
}

export function shuntingYard(tokens) {
  const outputQueue = [];
  const operatorStack = [];

  for (const token of tokens) {
    if (token.type === 'NUMBER' || token.type === 'POSTFIX') {
      outputQueue.push(token);
    } else if (token.type === 'FUNC' || token.type === 'LPAREN') {
      operatorStack.push(token);
    } else if (token.type === 'OP') {
      const p1 = PRECEDENCE[token.value] || 0;
      const isRightAssoc = token.value === '^' || token.value === 'u-';

      while (operatorStack.length > 0) {
        const top = operatorStack[operatorStack.length - 1];
        if (top.type === 'OP') {
          const p2 = PRECEDENCE[top.value] || 0;
          if ((!isRightAssoc && p1 <= p2) || (isRightAssoc && p1 < p2)) {
            outputQueue.push(operatorStack.pop());
          } else {
            break;
          }
        } else if (top.type === 'FUNC') {
          outputQueue.push(operatorStack.pop());
        } else {
          break;
        }
      }
      operatorStack.push(token);
    } else if (token.type === 'RPAREN') {
      let matched = false;
      while (operatorStack.length > 0) {
        const top = operatorStack.pop();
        if (top.type === 'LPAREN') {
          matched = true;
          break;
        }
        outputQueue.push(top);
      }
      if (!matched) throw new Error('Mismatched parentheses');
      if (operatorStack.length > 0 && operatorStack[operatorStack.length - 1].type === 'FUNC') {
        outputQueue.push(operatorStack.pop());
      }
    }
  }

  while (operatorStack.length > 0) {
    const top = operatorStack.pop();
    if (top.type === 'LPAREN' || top.type === 'RPAREN') throw new Error('Mismatched parentheses');
    outputQueue.push(top);
  }

  return outputQueue;
}

export function evaluateRPN(rpn, angleMode) {
  const stack = [];
  const steps = [];

  for (const token of rpn) {
    if (token.type === 'NUMBER') {
      const val = parseFloat(token.value);
      if (Number.isNaN(val)) throw new Error('Invalid number');
      stack.push(val);
    } else if (token.type === 'POSTFIX') {
      if (stack.length < 1) throw new Error('Syntax error');
      const val = stack.pop();
      let res = 0;
      if (token.value === '!') {
        res = factorial(val);
        steps.push(`${val}! = ${res}`);
      } else if (token.value === '%') {
        res = val / 100;
        steps.push(`${val}% = ${res}`);
      }
      stack.push(res);
    } else if (token.type === 'OP') {
      if (token.value === 'u-') {
        if (stack.length < 1) throw new Error('Syntax error');
        const a = stack.pop();
        steps.push(`-(${a}) = ${-a}`);
        stack.push(-a);
        continue;
      }
      if (stack.length < 2) throw new Error('Incomplete expression');
      const b = stack.pop();
      const a = stack.pop();
      let res = 0;
      let sym = token.value;

      switch (token.value) {
        case '+': res = a + b; break;
        case '-': res = a - b; break;
        case '*': res = a * b; sym = '×'; break;
        case '/':
          if (b === 0) throw new Error('Cannot divide by zero');
          res = a / b;
          sym = '÷';
          break;
        case '%':
        case 'mod':
          if (b === 0) throw new Error('Modulo by zero');
          res = a % b;
          break;
        case '^':
          if (a === 0 && b < 0) throw new Error('Negative power of zero');
          res = Math.pow(a, b);
          break;
        default: throw new Error(`Unknown operator: ${token.value}`);
      }
      const cleaned = cleanFloat(res);
      steps.push(`${formatResult(a)} ${sym} ${formatResult(b)} = ${formatResult(cleaned)}`);
      stack.push(cleaned);
    } else if (token.type === 'FUNC') {
      if (stack.length < 1) throw new Error('Missing argument');
      const a = stack.pop();
      let res = 0;
      switch (token.value) {
        case 'sin': res = calculateSin(a, angleMode); break;
        case 'cos': res = calculateCos(a, angleMode); break;
        case 'tan': res = calculateTan(a, angleMode); break;
        case 'asin': res = calculateAsin(a, angleMode); break;
        case 'acos': res = calculateAcos(a, angleMode); break;
        case 'atan': res = calculateAtan(a, angleMode); break;
        case 'sinh': res = cleanFloat(Math.sinh(a)); break;
        case 'cosh': res = cleanFloat(Math.cosh(a)); break;
        case 'tanh': res = cleanFloat(Math.tanh(a)); break;
        case 'log':
          if (a <= 0) throw new Error('Invalid logarithm argument');
          res = cleanFloat(Math.log10(a));
          break;
        case 'ln':
          if (a <= 0) throw new Error('Invalid logarithm argument');
          res = cleanFloat(Math.log(a));
          break;
        case 'sqrt':
          if (a < 0) throw new Error('Negative root undefined');
          res = cleanFloat(Math.sqrt(a));
          break;
        case 'cbrt': res = cleanFloat(Math.cbrt(a)); break;
        case 'abs': res = Math.abs(a); break;
        case 'exp': res = cleanFloat(Math.exp(a)); break;
        case 'inv':
          if (a === 0) throw new Error('Cannot divide by zero');
          res = cleanFloat(1 / a);
          break;
        default: throw new Error(`Unknown function: ${token.value}`);
      }
      steps.push(`${token.value}(${formatResult(a)}) = ${formatResult(res)}`);
      stack.push(res);
    }
  }

  if (stack.length !== 1) throw new Error('Syntax error');
  return { value: stack[0], steps };
}

export function evaluateExpression(expr, angleMode = 'DEG') {
  if (!expr || expr.trim() === '') {
    return { success: true, value: 0, formatted: '0', steps: [] };
  }
  try {
    const tokens = tokenize(expr);
    if (tokens.length === 0) return { success: true, value: 0, formatted: '0', steps: [] };
    const rpn = shuntingYard(tokens);
    const { value, steps } = evaluateRPN(rpn, angleMode);
    const cleaned = cleanFloat(value);
    return {
      success: true,
      value: cleaned,
      formatted: formatResult(cleaned),
      steps
    };
  } catch (err) {
    return {
      success: false,
      error: err.message || 'Error'
    };
  }
}
