import React, { useState, useEffect, useCallback } from 'react';
import { cleanFloat, formatResult } from '../utils/math.js';

export function Practice() {
  const [problem, setProblem] = useState(null);
  const [answer, setAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState(null);

  const nextProblem = useCallback(() => {
    const list = [
      { q: '√144 + 7²', a: 12 + 49 },
      { q: 'sin(30°) × 40', a: 20 },
      { q: '4! + 6', a: 30 },
      { q: '2^5 - 12', a: 20 },
      { q: '√169 - 3²', a: 4 },
      { q: '5! / 4', a: 30 },
      { q: 'cos(60°) × 50', a: 25 },
      { q: '3³ + 4²', a: 43 }
    ];
    const item = list[Math.floor(Math.random() * list.length)];
    setProblem(item);
    setAnswer('');
    setStatus(null);
  }, []);

  useEffect(() => {
    nextProblem();
  }, [nextProblem]);

  const handleCheck = (e) => {
    e.preventDefault();
    if (!problem || !answer.trim()) return;
    const num = parseFloat(answer.trim());
    if (Math.abs(num - problem.a) < 0.05) {
      setStatus('correct');
      setScore((s) => s + 1);
    } else {
      setStatus('wrong');
    }
  };

  return (
    <div className="flex flex-col gap-3 text-xs text-[#202124] dark:text-[#e8eaed]">
      <div className="flex justify-between items-center text-[#70757a] dark:text-[#9aa0a6] pb-1 border-b border-[#dadce0] dark:border-[#3c4043]">
        <span>Mental calculation practice</span>
        <span>Score: {score}</span>
      </div>

      {problem && (
        <form onSubmit={handleCheck} className="flex flex-col gap-2.5">
          <div className="text-base font-medium py-1">
            {problem.q} = ?
          </div>

          <div className="flex gap-2">
            <input
              type="number"
              step="any"
              autoFocus
              placeholder="Your answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="flex-1 border border-[#dadce0] dark:border-[#3c4043] rounded px-2.5 py-1.5 bg-white dark:bg-[#303134]"
            />
            {status !== 'correct' ? (
              <button
                type="submit"
                className="bg-[#1a73e8] dark:bg-[#8ab4f8] text-white dark:text-[#202124] px-4 py-1.5 rounded font-medium cursor-pointer"
              >
                Check
              </button>
            ) : (
              <button
                type="button"
                onClick={nextProblem}
                className="bg-[#137333] dark:bg-[#81c995] text-white dark:text-[#202124] px-4 py-1.5 rounded font-medium cursor-pointer"
              >
                Next
              </button>
            )}
          </div>

          {status === 'correct' && (
            <div className="text-[#137333] dark:text-[#81c995]">
              Correct. Result is {problem.a}.
            </div>
          )}

          {status === 'wrong' && (
            <div className="text-[#d93025] dark:text-[#f28b82]">
              Incorrect. Try again.
            </div>
          )}
        </form>
      )}
    </div>
  );
}
