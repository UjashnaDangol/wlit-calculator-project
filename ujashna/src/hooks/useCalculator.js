import { useState, useEffect, useCallback } from 'react';
import { evaluateExpression } from '../utils/evaluator.js';
import { formatResult } from '../utils/math.js';

export function useCalculator() {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('0');
  const [error, setError] = useState(null);
  const [isCalculated, setIsCalculated] = useState(false);
  const [steps, setSteps] = useState([]);

  const [angleMode, setAngleModeState] = useState(() => {
    return localStorage.getItem('calc_angle_mode') || 'DEG';
  });

  const [memory, setMemoryState] = useState(() => {
    const saved = localStorage.getItem('calc_memory');
    return saved ? parseFloat(saved) : 0;
  });

  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('calc_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const setAngleMode = (mode) => {
    setAngleModeState(mode);
    localStorage.setItem('calc_angle_mode', mode);
  };

  const updateMemory = (val) => {
    setMemoryState(val);
    localStorage.setItem('calc_memory', val.toString());
  };

  useEffect(() => {
    localStorage.setItem('calc_history', JSON.stringify(history));
  }, [history]);

  const calculate = useCallback(() => {
    if (!expression || !expression.trim()) return;

    const res = evaluateExpression(expression, angleMode);
    if (res.success && res.formatted !== undefined) {
      setResult(res.formatted);
      setError(null);
      setIsCalculated(true);
      setSteps(res.steps || []);

      const item = {
        id: Date.now().toString(),
        expression,
        result: res.formatted,
        angleMode,
        timestamp: Date.now()
      };
      setHistory((prev) => [item, ...prev.slice(0, 49)]);
    } else {
      setError(res.error || 'Error');
    }
  }, [expression, angleMode]);

  const append = useCallback((str) => {
    setError(null);
    if (isCalculated) {
      const isOp = ['+', '-', '×', '÷', '*', '/', '^', '%', 'mod'].includes(str);
      if (isOp) {
        setExpression(result + str);
      } else {
        setExpression(str);
      }
      setIsCalculated(false);
      return;
    }
    setExpression((prev) => prev + str);
  }, [isCalculated, result]);

  const backspace = useCallback(() => {
    setError(null);
    if (isCalculated) {
      setIsCalculated(false);
    }
    setExpression((prev) => {
      if (!prev) return '';
      const match = prev.match(/([a-zA-Z]+|\u221A|\u221B)\($/);
      if (match) return prev.slice(0, -match[0].length);
      return prev.slice(0, -1);
    });
  }, [isCalculated]);

  const clear = useCallback(() => {
    setExpression('');
    setError(null);
    setIsCalculated(false);
  }, []);

  const allClear = useCallback(() => {
    setExpression('');
    setResult('0');
    setError(null);
    setIsCalculated(false);
    setSteps([]);
  }, []);

  const toggleSign = useCallback(() => {
    setError(null);
    if (isCalculated) {
      const num = parseFloat(result);
      if (!Number.isNaN(num)) {
        const negated = (-num).toString();
        setResult(negated);
        setExpression(negated);
        setIsCalculated(false);
      }
      return;
    }
    if (!expression) {
      setExpression('-');
      return;
    }
    if (expression.endsWith('-')) {
      setExpression(expression.slice(0, -1));
    } else {
      setExpression((prev) => prev + '(-');
    }
  }, [expression, isCalculated, result]);

  const memoryClear = useCallback(() => updateMemory(0), []);
  const memoryRecall = useCallback(() => append(formatResult(memory)), [memory, append]);
  const memoryStore = useCallback(() => updateMemory(parseFloat(result) || 0), [result]);
  const memoryAdd = useCallback(() => updateMemory(memory + (parseFloat(result) || 0)), [memory, result]);
  const memorySubtract = useCallback(() => updateMemory(memory - (parseFloat(result) || 0)), [memory, result]);

  const loadHistoryItem = useCallback((item) => {
    setExpression(item.expression);
    setResult(item.result);
    setError(null);
    setIsCalculated(false);
  }, []);

  const deleteHistoryItem = useCallback((id) => {
    setHistory((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const clearHistory = useCallback(() => setHistory([]), []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      if (e.key >= '0' && e.key <= '9') {
        e.preventDefault();
        append(e.key);
      } else if (e.key === '.') {
        e.preventDefault();
        append('.');
      } else if (e.key === '+') {
        e.preventDefault();
        append('+');
      } else if (e.key === '-') {
        e.preventDefault();
        append('-');
      } else if (e.key === '*') {
        e.preventDefault();
        append('×');
      } else if (e.key === '/') {
        e.preventDefault();
        append('÷');
      } else if (e.key === '^') {
        e.preventDefault();
        append('^');
      } else if (e.key === '(' || e.key === ')') {
        e.preventDefault();
        append(e.key);
      } else if (e.key === '%') {
        e.preventDefault();
        append('%');
      } else if (e.key === '!') {
        e.preventDefault();
        append('!');
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        calculate();
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        backspace();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        allClear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [append, calculate, backspace, allClear]);

  return {
    expression,
    setExpression,
    result,
    error,
    isCalculated,
    steps,
    angleMode,
    setAngleMode,
    memory,
    history,
    append,
    backspace,
    clear,
    allClear,
    calculate,
    toggleSign,
    memoryClear,
    memoryRecall,
    memoryStore,
    memoryAdd,
    memorySubtract,
    loadHistoryItem,
    deleteHistoryItem,
    clearHistory
  };
}
