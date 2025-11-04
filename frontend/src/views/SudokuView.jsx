// src/views/SudokuView.jsx
import React, { useState } from 'react';

// --- (HEMOS BORRADO EL COMPONENTE NUMPAD) ---

// --- Componente Interno de la Cuadrícula (MODIFICADO Y ROBUSTECIDO) ---
const SudokuGrid = ({ board, onCellChange, originalBoard, solution }) => {
  
  // --- CLÁUSULA DE GUARDA (FIX 2) ---
  // Arregla el bug de la "Fila 1" y los fallos al cargar.
  if (!board || !originalBoard || !solution) {
    return (
      <div className="flex justify-center items-center bg-slate-800/50 w-full max-w-md mx-auto aspect-square rounded-md shadow-lg">
        <p className="text-gray-400 animate-pulse">Genera un nuevo puzzle para empezar...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-9 gap-px bg-slate-600 w-full max-w-md mx-auto aspect-square rounded-md overflow-hidden shadow-lg">
      {board.map((row, r_idx) =>
        row.map((cell, c_idx) => {
          
          // Estas líneas ahora son seguras gracias a la cláusula de guarda
          const isGiven = originalBoard[r_idx][c_idx] !== 0;
          const isWrong = cell !== 0 && !isGiven && solution[r_idx][c_idx] !== cell;

          return (
            <input
              key={`${r_idx}-${c_idx}`}
              type="text" // <-- Tipo texto para permitir el teclado numérico del móvil
              inputMode="numeric" // <-- Sugiere un teclado numérico en móviles
              pattern="[1-9]*" // <-- Validación HTML
              maxLength="1"
              value={cell === 0 ? '' : cell}
              disabled={isGiven}
              
              // --- ¡¡¡AQUÍ ESTÁ EL ARREGLO!!! ---
              // Cambiado de 'handlers.onCellChange' a solo 'onCellChange'
              onChange={(e) => onCellChange(r_idx, c_idx, e.target.value)}
              // ----------------------------------

              className={`
                w-full h-full aspect-square text-center text-xl sm:text-3xl font-bold
                ${isGiven ? 'bg-slate-700 text-green-300' : 'bg-slate-800/80 focus:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500'}
                ${isWrong ? 'text-red-500' : 'text-white'}
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


// --- Componente Principal de la Vista (SIMPLIFICADO) ---
function SudokuView({ gameState, handlers }) {
  const [difficulty, setDifficulty] = useState(0.5);
  // --- (HEMOS BORRADO activeCell y los handlers del Numpad) ---

  const { board, originalBoard, isGenerating, isSolving, error, solution, successMessage } = gameState;

  return (
    <div className="flex flex-col items-center">
      {/* --- (HEMOS BORRADO EL RENDERIZADO DEL NUMPAD) --- */}

      <h1 className="text-4xl font-bold text-gray-200 mb-6 text-center">Sudoku Solver</h1>
      
      <p className="text-gray-300 text-center mb-6 max-w-md">
        Usa "Nuevo Puzzle" para empezar. Las casillas verdes son fijas.
        Usa "Resolver" para que nuestro algoritmo de backtracking lo solucione.
      </p>
      
      {/* --- MENSAJE DE ÉXITO --- */}
      {successMessage && (
        <div className="p-4 mb-4 bg-green-500/20 text-green-300 rounded-md w-full max-w-lg text-center font-bold text-lg animate-pulse">
          {successMessage}
        </div>
      )}

      {/* --- Panel de Control (sin cambios) --- */}
      <div className="flex flex-wrap justify-center gap-4 mb-6 p-4 bg-slate-800/50 rounded-lg w-full max-w-lg">
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
          disabled={isGenerating || isSolving}
          className="px-6 py-3 bg-green-600 text-white font-bold rounded-md hover:bg-green-700 disabled:bg-green-300 transition-all"
        >
          {isGenerating ? 'Generando...' : 'Nuevo Puzzle'}
        </button>

        <button
          onClick={handlers.onHint}
          disabled={isGenerating || isSolving || !board}
          className="px-4 py-2 bg-yellow-600 text-white font-semibold rounded-md hover:bg-yellow-700 disabled:bg-yellow-300 transition-all"
        >
          Pista
        </button>

        <button
          onClick={handlers.onSolve}
          disabled={isGenerating || isSolving || !board}
          className="px-6 py-3 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 disabled:bg-blue-300 transition-all"
        >
          {isSolving ? 'Resolviendo...' : 'Resolver'}
        </button>
      </div>

      {error && <div className="p-4 mb-4 bg-red-500/20 text-red-300 rounded-md w-full max-w-lg">{error}</div>}

      {/* --- El Tablero (Ahora sin lógica de Numpad) --- */}
      <SudokuGrid 
        board={board}
        originalBoard={originalBoard}
        solution={solution}
        onCellChange={handlers.onCellChange} // <-- Pasamos el handler onCellChange
      />
    </div>
  );
}

export default SudokuView;