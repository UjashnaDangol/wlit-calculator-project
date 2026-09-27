import React, { useState, useEffect } from 'react';
import { useCalculator } from './hooks/useCalculator.js';
import { Display } from './components/Display.jsx';
import { Keypad } from './components/Keypad.jsx';
import { History } from './components/History.jsx';
import { Tools } from './components/Tools.jsx';
import { Practice } from './components/Practice.jsx';

export function App() {
  const {
    expression,
    result,
    error,
    steps,
    angleMode,
    setAngleMode,
    history,
    append,
    clear,
    allClear,
    calculate,
    loadHistoryItem,
    deleteHistoryItem,
    clearHistory
  } = useCalculator();

  const [activeTab, setActiveTab] = useState('calc');
  const [showSteps, setShowSteps] = useState(false);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('google_calc_theme') || 'light';
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('google_calc_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((t) => (t === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#171717] py-6 px-3 flex flex-col items-center justify-start text-[#202124] dark:text-[#e8eaed]">
      <div className="w-full max-w-[640px] bg-white dark:bg-[#202124] border border-[#dadce0] dark:border-[#3c4043] rounded-lg p-3 sm:p-4 shadow-xs">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#dadce0] dark:border-[#3c4043]">
          <div className="flex items-center gap-4 text-xs font-normal">
            <button
              onClick={() => setActiveTab('calc')}
              className={`cursor-pointer pb-0.5 ${
                activeTab === 'calc'
                  ? 'border-b-2 border-[#1a73e8] dark:border-[#8ab4f8] text-[#1a73e8] dark:text-[#8ab4f8] font-medium'
                  : 'text-[#5f6368] dark:text-[#9aa0a6] hover:text-[#202124] dark:hover:text-[#e8eaed]'
              }`}
            >
              Calculator
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`cursor-pointer pb-0.5 ${
                activeTab === 'history'
                  ? 'border-b-2 border-[#1a73e8] dark:border-[#8ab4f8] text-[#1a73e8] dark:text-[#8ab4f8] font-medium'
                  : 'text-[#5f6368] dark:text-[#9aa0a6] hover:text-[#202124] dark:hover:text-[#e8eaed]'
              }`}
            >
              History {history.length > 0 && `(${history.length})`}
            </button>
            <button
              onClick={() => setActiveTab('tools')}
              className={`cursor-pointer pb-0.5 ${
                activeTab === 'tools'
                  ? 'border-b-2 border-[#1a73e8] dark:border-[#8ab4f8] text-[#1a73e8] dark:text-[#8ab4f8] font-medium'
                  : 'text-[#5f6368] dark:text-[#9aa0a6] hover:text-[#202124] dark:hover:text-[#e8eaed]'
              }`}
            >
              Tools
            </button>
            <button
              onClick={() => setActiveTab('practice')}
              className={`cursor-pointer pb-0.5 ${
                activeTab === 'practice'
                  ? 'border-b-2 border-[#1a73e8] dark:border-[#8ab4f8] text-[#1a73e8] dark:text-[#8ab4f8] font-medium'
                  : 'text-[#5f6368] dark:text-[#9aa0a6] hover:text-[#202124] dark:hover:text-[#e8eaed]'
              }`}
            >
              Practice
            </button>
          </div>

          <button
            onClick={toggleTheme}
            className="text-xs text-[#5f6368] dark:text-[#9aa0a6] hover:text-[#202124] dark:hover:text-[#e8eaed] cursor-pointer px-1.5 py-0.5 rounded hover:bg-[#f1f3f4] dark:hover:bg-[#303134]"
            title="Toggle theme"
          >
            {theme === 'light' ? 'Dark theme' : 'Light theme'}
          </button>
        </div>

        {activeTab === 'calc' && (
          <div>
            <Display expression={expression} result={result} error={error} />

            {steps && steps.length > 1 && (
              <div className="mb-2 text-xs text-[#70757a] dark:text-[#9aa0a6]">
                <button
                  onClick={() => setShowSteps(!showSteps)}
                  className="hover:underline cursor-pointer"
                >
                  {showSteps ? 'Hide steps' : 'Show calculation steps'}
                </button>
                {showSteps && (
                  <div className="mt-1 p-2 bg-[#f8f9fa] dark:bg-[#303134] rounded border border-[#dadce0] dark:border-[#3c4043] font-mono text-[11px] space-y-0.5">
                    {steps.map((s, i) => (
                      <div key={i}>{i + 1}. {s}</div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <Keypad
              angleMode={angleMode}
              onToggleAngleMode={setAngleMode}
              onAppend={append}
              onCalculate={calculate}
              onClear={clear}
              onAllClear={allClear}
              lastResult={result}
            />
          </div>
        )}

        {activeTab === 'history' && (
          <History
            history={history}
            onLoadItem={(item) => {
              loadHistoryItem(item);
              setActiveTab('calc');
            }}
            onDeleteItem={deleteHistoryItem}
            onClearHistory={clearHistory}
          />
        )}

        {activeTab === 'tools' && (
          <Tools
            onInsertValue={(val) => {
              append(val);
              setActiveTab('calc');
            }}
          />
        )}

        {activeTab === 'practice' && <Practice />}
      </div>

      <div className="mt-3 text-xs text-[#70757a] dark:text-[#9aa0a6] text-center">
        Keyboard shortcuts enabled • Type directly or use buttons
      </div>
    </div>
  );
}

export default App;
