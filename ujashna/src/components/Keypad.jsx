import React, { useState } from 'react';

export function Keypad({
  angleMode,
  onToggleAngleMode,
  onAppend,
  onCalculate,
  onClear,
  onAllClear,
  lastResult
}) {
  const [isInv, setIsInv] = useState(false);

  const btnBase = "h-9 sm:h-10 text-xs sm:text-sm font-normal rounded cursor-pointer transition-colors duration-100 flex items-center justify-center select-none";
  const numBtn = `${btnBase} bg-[#f1f3f4] hover:bg-[#e8eaed] active:bg-[#dadce0] text-[#202124] dark:bg-[#3c4043] dark:hover:bg-[#474a4d] dark:active:bg-[#5f6368] dark:text-[#e8eaed]`;
  const fnBtn = `${btnBase} bg-[#dadce0] hover:bg-[#d2d5d9] active:bg-[#bdc1c6] text-[#3c4043] dark:bg-[#303134] dark:hover:bg-[#3c4043] dark:active:bg-[#474a4d] dark:text-[#bdc1c6]`;
  const opBtn = `${btnBase} bg-[#dadce0] hover:bg-[#d2d5d9] active:bg-[#bdc1c6] text-[#3c4043] dark:bg-[#303134] dark:hover:bg-[#3c4043] dark:active:bg-[#474a4d] dark:text-[#bdc1c6] text-base`;
  const eqBtn = `${btnBase} bg-[#1a73e8] hover:bg-[#1b66c9] active:bg-[#174ea6] text-white dark:bg-[#8ab4f8] dark:hover:bg-[#93bbf8] dark:active:bg-[#aecbfa] dark:text-[#202124] text-base font-medium`;

  return (
    <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
      <div className="flex bg-[#dadce0] dark:bg-[#303134] rounded p-0.5 text-xs text-[#3c4043] dark:text-[#bdc1c6]">
        <button
          onClick={() => onToggleAngleMode('RAD')}
          className={`flex-1 rounded py-1 ${angleMode === 'RAD' ? 'bg-white dark:bg-[#3c4043] font-semibold text-[#202124] dark:text-[#e8eaed] shadow-xs' : ''}`}
        >
          Rad
        </button>
        <div className="w-[1px] bg-[#bdc1c6] dark:bg-[#5f6368] my-1" />
        <button
          onClick={() => onToggleAngleMode('DEG')}
          className={`flex-1 rounded py-1 ${angleMode === 'DEG' ? 'bg-white dark:bg-[#3c4043] font-semibold text-[#202124] dark:text-[#e8eaed] shadow-xs' : ''}`}
        >
          Deg
        </button>
      </div>

      <button onClick={() => onAppend('!')} className={fnBtn}>x!</button>
      <button onClick={() => onAppend('(')} className={fnBtn}>(</button>
      <button onClick={() => onAppend(')')} className={fnBtn}>)</button>
      <button onClick={() => onAppend('%')} className={fnBtn}>%</button>
      <button onClick={onAllClear} className={fnBtn}>AC</button>
      <button onClick={onClear} className={fnBtn}>CE</button>

      <button
        onClick={() => setIsInv(!isInv)}
        className={`${fnBtn} ${isInv ? 'bg-[#c2e7ff] text-[#001d35] dark:bg-[#004a77] dark:text-[#c2e7ff] font-medium' : ''}`}
      >
        Inv
      </button>

      {!isInv ? (
        <button onClick={() => onAppend('sin(')} className={fnBtn}>sin</button>
      ) : (
        <button onClick={() => onAppend('asin(')} className={fnBtn}>sin⁻¹</button>
      )}

      {!isInv ? (
        <button onClick={() => onAppend('ln(')} className={fnBtn}>ln</button>
      ) : (
        <button onClick={() => onAppend('exp(')} className={fnBtn}>eˣ</button>
      )}

      <button onClick={() => onAppend('7')} className={numBtn}>7</button>
      <button onClick={() => onAppend('8')} className={numBtn}>8</button>
      <button onClick={() => onAppend('9')} className={numBtn}>9</button>
      <button onClick={() => onAppend('÷')} className={opBtn}>÷</button>

      <button onClick={() => onAppend('π')} className={fnBtn}>π</button>

      {!isInv ? (
        <button onClick={() => onAppend('cos(')} className={fnBtn}>cos</button>
      ) : (
        <button onClick={() => onAppend('acos(')} className={fnBtn}>cos⁻¹</button>
      )}

      {!isInv ? (
        <button onClick={() => onAppend('log(')} className={fnBtn}>log</button>
      ) : (
        <button onClick={() => onAppend('10^(')} className={fnBtn}>10ˣ</button>
      )}

      <button onClick={() => onAppend('4')} className={numBtn}>4</button>
      <button onClick={() => onAppend('5')} className={numBtn}>5</button>
      <button onClick={() => onAppend('6')} className={numBtn}>6</button>
      <button onClick={() => onAppend('×')} className={opBtn}>×</button>

      <button onClick={() => onAppend('e')} className={fnBtn}>e</button>

      {!isInv ? (
        <button onClick={() => onAppend('tan(')} className={fnBtn}>tan</button>
      ) : (
        <button onClick={() => onAppend('atan(')} className={fnBtn}>tan⁻¹</button>
      )}

      {!isInv ? (
        <button onClick={() => onAppend('sqrt(')} className={fnBtn}>√</button>
      ) : (
        <button onClick={() => onAppend('^2')} className={fnBtn}>x²</button>
      )}

      <button onClick={() => onAppend('1')} className={numBtn}>1</button>
      <button onClick={() => onAppend('2')} className={numBtn}>2</button>
      <button onClick={() => onAppend('3')} className={numBtn}>3</button>
      <button onClick={() => onAppend('-')} className={opBtn}>−</button>

      <button
        onClick={() => {
          if (lastResult) onAppend(lastResult);
        }}
        className={fnBtn}
        title="Last Answer"
      >
        Ans
      </button>

      <button onClick={() => onAppend('e')} className={fnBtn}>EXP</button>
      <button onClick={() => onAppend('^')} className={fnBtn}>xʸ</button>
      <button onClick={() => onAppend('0')} className={numBtn}>0</button>
      <button onClick={() => onAppend('.')} className={numBtn}>.</button>
      <button onClick={onCalculate} className={eqBtn}>=</button>
      <button onClick={() => onAppend('+')} className={opBtn}>+</button>
    </div>
  );
}
