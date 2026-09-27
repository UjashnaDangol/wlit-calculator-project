import React, { useState } from 'react';
import { solveQuadratic, calculateStatistics } from '../utils/solver.js';
import { formatResult } from '../utils/math.js';

export function Tools({ onInsertValue }) {
  const [activeTab, setActiveTab] = useState('quadratic');

  const [a, setA] = useState('1');
  const [b, setB] = useState('-5');
  const [c, setC] = useState('6');
  const [quadResult, setQuadResult] = useState(null);

  const [statsInput, setStatsInput] = useState('10, 15, 20, 25, 30');
  const [statsResult, setStatsResult] = useState(null);

  const handleSolveQuad = (e) => {
    e.preventDefault();
    const na = parseFloat(a);
    const nb = parseFloat(b);
    const nc = parseFloat(c);
    if (!Number.isNaN(na) && !Number.isNaN(nb) && !Number.isNaN(nc)) {
      setQuadResult(solveQuadratic(na, nb, nc));
    }
  };

  const handleCalculateStats = (e) => {
    e.preventDefault();
    const parts = statsInput
      .split(/[\s,]+/)
      .filter((p) => p.trim() !== '')
      .map((p) => parseFloat(p));
    if (parts.length > 0 && !parts.some((n) => Number.isNaN(n))) {
      try {
        setStatsResult(calculateStatistics(parts));
      } catch {
        setStatsResult(null);
      }
    }
  };

  return (
    <div className="flex flex-col gap-3 text-xs text-[#202124] dark:text-[#e8eaed]">
      <div className="flex gap-2 border-b border-[#dadce0] dark:border-[#3c4043] pb-1 text-[#70757a] dark:text-[#9aa0a6]">
        <button
          onClick={() => setActiveTab('quadratic')}
          className={`pb-1 px-1 cursor-pointer ${activeTab === 'quadratic' ? 'border-b-2 border-[#1a73e8] dark:border-[#8ab4f8] text-[#1a73e8] dark:text-[#8ab4f8] font-medium' : ''}`}
        >
          Quadratic Solver
        </button>
        <button
          onClick={() => setActiveTab('stats')}
          className={`pb-1 px-1 cursor-pointer ${activeTab === 'stats' ? 'border-b-2 border-[#1a73e8] dark:border-[#8ab4f8] text-[#1a73e8] dark:text-[#8ab4f8] font-medium' : ''}`}
        >
          Statistics
        </button>
      </div>

      {activeTab === 'quadratic' ? (
        <form onSubmit={handleSolveQuad} className="flex flex-col gap-2.5">
          <div className="text-[#70757a] dark:text-[#9aa0a6]">
            ax² + bx + c = 0
          </div>
          <div className="flex gap-2">
            <input
              type="number"
              step="any"
              placeholder="a"
              value={a}
              onChange={(e) => setA(e.target.value)}
              required
              className="flex-1 border border-[#dadce0] dark:border-[#3c4043] rounded px-2 py-1 bg-white dark:bg-[#303134] text-center"
            />
            <input
              type="number"
              step="any"
              placeholder="b"
              value={b}
              onChange={(e) => setB(e.target.value)}
              required
              className="flex-1 border border-[#dadce0] dark:border-[#3c4043] rounded px-2 py-1 bg-white dark:bg-[#303134] text-center"
            />
            <input
              type="number"
              step="any"
              placeholder="c"
              value={c}
              onChange={(e) => setC(e.target.value)}
              required
              className="flex-1 border border-[#dadce0] dark:border-[#3c4043] rounded px-2 py-1 bg-white dark:bg-[#303134] text-center"
            />
            <button
              type="submit"
              className="bg-[#1a73e8] dark:bg-[#8ab4f8] text-white dark:text-[#202124] px-3 py-1 rounded font-medium cursor-pointer"
            >
              Solve
            </button>
          </div>

          {quadResult && (
            <div className="bg-[#f8f9fa] dark:bg-[#303134] p-2.5 rounded border border-[#dadce0] dark:border-[#3c4043] flex flex-col gap-1">
              <span className="font-medium">Roots:</span>
              {quadResult.roots.map((r, i) => (
                <div key={i} className="flex justify-between items-center">
                  <span>{r}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const match = r.match(/=\s*([0-9.-]+)/);
                      if (match) onInsertValue(match[1]);
                    }}
                    className="text-[#1a73e8] dark:text-[#8ab4f8] hover:underline cursor-pointer"
                  >
                    Insert
                  </button>
                </div>
              ))}
            </div>
          )}
        </form>
      ) : (
        <form onSubmit={handleCalculateStats} className="flex flex-col gap-2">
          <textarea
            rows={2}
            value={statsInput}
            onChange={(e) => setStatsInput(e.target.value)}
            className="w-full border border-[#dadce0] dark:border-[#3c4043] rounded p-2 bg-white dark:bg-[#303134]"
            placeholder="Enter numbers separated by commas..."
          />
          <button
            type="submit"
            className="self-start bg-[#1a73e8] dark:bg-[#8ab4f8] text-white dark:text-[#202124] px-3 py-1 rounded font-medium cursor-pointer"
          >
            Calculate
          </button>

          {statsResult && (
            <div className="grid grid-cols-2 gap-2 bg-[#f8f9fa] dark:bg-[#303134] p-2.5 rounded border border-[#dadce0] dark:border-[#3c4043]">
              <div>Mean: <strong className="text-[#1a73e8] dark:text-[#8ab4f8]">{formatResult(statsResult.mean)}</strong></div>
              <div>Median: <strong>{formatResult(statsResult.median)}</strong></div>
              <div>Std Dev: <strong>{formatResult(statsResult.stdDev)}</strong></div>
              <div>Count: <strong>{statsResult.count}</strong></div>
            </div>
          )}
        </form>
      )}
    </div>
  );
}
