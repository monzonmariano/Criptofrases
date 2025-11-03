// src/views/SudokuView.jsx
import React, { useState } from 'react';

// --- Componente Interno para la Cuadrícula ---
const SudokuGrid = ({ board, onCellChange, originalBoard }) => {
  if (!board) return null;

  return (
    <div className="grid grid-cols-9 gap-px bg-slate-600 w-full max-w-md mx-auto aspect-square rounded-md overflow-hidden shadow-lg">
      {board.map((row, r_idx) =>
        row.map((cell, c_idx) => {
          // Comprobamos si la celda era parte del puzzle original
          const isGiven = originalBoard[r_idx][c_idx] !== 0;
          
          return (
            <input
              key={`${r_idx}-${c_idx}`}
              type="text"
              maxLength="1"
              value={cell === 0 ? '' : cell}
              onChange={(e) => onCellChange(r_idx, c_idx, e.target.value)}
              disabled={isGiven} // Las celdas del puzzle original no se editan
              className={`
                w-full h-full aspect-square text-center text-xl sm:text-3xl font-bold
                ${isGiven ? 'bg-slate-700 text-green-300' : 'bg-slate-800/80 text-white focus:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500'}
                ${(c_idx === 2 || c_idx === 5) ? 'border-r-2 border-slate-500' : ''}
                ${(r_idx === 2 || r_idx === 5) ? 'border-b-2 border-slate-500' : ''}
              `}
            />
          );
        })
      )}
    </div>
  );
};

// --- Componente Principal de la Vista ---
function SudokuView({ gameState, handlers }) {
  const [difficulty, setDifficulty] = useState(0.5);
  const { board, originalBoard, isLoading, error } = gameState;

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-4xl font-bold text-gray-200 mb-6 text-center">Sudoku Solver</h1>
      
      {/* --- Panel de Control --- */}
      <div className="flex flex-wrap justify-center gap-4 mb-6 p-4 bg-slate-800/50 rounded-lg w-full max-w-md">
        <div className="flex-1 min-w-[150px]">
          <label className="block text-xs text-gray-400 mb-1">Dificultad</label>
          <select 
            value={difficulty} 
            onChange={(e) => setDifficulty(parseFloat(e.target.value))}
            className="w-full p-2 bg-slate-700 text-white rounded-md"
          >
            <option value={0.3}>Fácil</option>
            <option value={0.5}>Medio</option>
            <option value={0.7}>Difícil</option>
          </select>
        </div>
        
        <button
          onClick={() => handlers.onGenerate(difficulty)}
          disabled={isLoading}
          className="px-6 py-3 bg-green-600 text-white font-bold rounded-md hover:bg-green-700 disabled:bg-green-300 transition-all"
        >
          {isLoading ? 'Generando...' : 'Nuevo Puzzle'}
        </button>

        <button
          onClick={handlers.onSolve}
          disabled={isLoading || !board}
          className="px-6 py-3 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 disabled:bg-blue-300 transition-all"
        >
          {isLoading ? 'Resolviendo...' : 'Resolver'}
        </button>
      </div>

      {error && <div className="p-4 mb-4 bg-red-500/20 text-red-300 rounded-md w-full max-w-md">{error}</div>}

      {/* --- El Tablero --- */}
      {board && (
        <SudokuGrid 
          board={board}
          originalBoard={originalBoard} // Pasamos el tablero original para deshabilitar celdas
          onCellChange={handlers.onCellChange}
        />
      )}
    </div>
  );
}

export default SudokuView;