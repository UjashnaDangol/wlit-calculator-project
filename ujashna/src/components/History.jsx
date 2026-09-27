import React from 'react';

export function History({ history, onLoadItem, onDeleteItem, onClearHistory }) {
  if (!history || history.length === 0) {
    return (
      <div className="py-8 text-center text-xs text-[#70757a] dark:text-[#9aa0a6]">
        Your calculation history will appear here.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 max-h-72 overflow-y-auto pr-1">
      <div className="flex justify-between items-center pb-2 border-b border-[#dadce0] dark:border-[#3c4043] text-xs text-[#70757a] dark:text-[#9aa0a6]">
        <span>Recent calculations</span>
        <button
          onClick={onClearHistory}
          className="hover:text-[#202124] dark:hover:text-[#e8eaed] cursor-pointer"
        >
          Clear all
        </button>
      </div>

      {history.map((item) => (
        <div
          key={item.id}
          onClick={() => onLoadItem(item)}
          className="p-2 rounded hover:bg-[#f1f3f4] dark:hover:bg-[#303134] cursor-pointer flex justify-between items-center group text-xs text-right"
        >
          <div className="flex-1 overflow-hidden">
            <div className="text-[#70757a] dark:text-[#9aa0a6] truncate">{item.expression}</div>
            <div className="text-sm font-medium text-[#202124] dark:text-[#e8eaed] truncate">
              = {item.result}
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDeleteItem(item.id);
            }}
            className="opacity-0 group-hover:opacity-100 ml-2 text-[#70757a] hover:text-[#d93025] p-1 cursor-pointer"
            title="Delete"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
