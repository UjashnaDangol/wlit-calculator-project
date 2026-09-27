import React from 'react';

export function Display({ expression, result, error }) {
  return (
    <div className="border border-[#dadce0] dark:border-[#3c4043] rounded-lg p-3 bg-white dark:bg-[#202124] mb-3 text-right">
      <div className="text-xs text-[#70757a] dark:text-[#9aa0a6] h-5 overflow-x-auto whitespace-nowrap">
        {expression || ''}
      </div>

      <div className="text-3xl text-[#202124] dark:text-[#e8eaed] font-normal tracking-normal overflow-x-auto whitespace-nowrap mt-1 leading-none">
        {error ? (
          <span className="text-sm text-[#d93025] dark:text-[#f28b82]">{error}</span>
        ) : (
          result || '0'
        )}
      </div>
    </div>
  );
}
