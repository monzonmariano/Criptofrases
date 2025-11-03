import React, { useState } from 'react';

// --- Componente Interno Numpad ---
const Numpad = ({ onNumberClick, onClear, onClose }) => {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  
  return (
    // Fondo oscuro semi-transparente
    <div 
      className="fixed inset-0 bg-black/50 z-40 flex justify-center items-center"
      onClick={onClose} // Cierra si se hace clic fuera
    >
      {/* Contenedor del Numpad (evita que el clic se propague) */}
      <div 
        className="bg-slate-800 p-4 rounded-lg shadow-xl grid grid-cols-3 gap-3"
        onClick={(e) => e.stopPropagation()} 
      >
        {numbers.map(num => (
          <button
            key={num}
            onClick={() => onNumberClick(num)}
            className="w-16 h-16 text-3xl font-bold text-white bg-slate-700 rounded-md hover:bg-blue-600 transition-colors"
          >
            {num}
          </button>
        ))}
        {/* Botón de Borrar (X) */}
        <button
          onClick={onClear}
          className="w-16 h-16 text-3xl font-bold text-red-400 bg-slate-700 rounded-md hover:bg-red-600 transition-colors col-span-2"
        >
          Borrar (0)
        </button>
        {/* Botón de Cerrar */}
        <button
          onClick={onClose}
          className="w-16 h-16 text-xl font-bold text-gray-300 bg-slate-700 rounded-md hover:bg-slate-600 transition-colors"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};


// --- Componente Interno de la Cuadrícula (MODIFICADO Y ROBUSTECIDO) ---
const SudokuGrid = ({ board, onCellClick, originalBoard, solution, activeCell }) => {
  
  // --- CLÁUSULA DE GUARDA (FIX 2) ---
  // No intentes renderizar la cuadrícula si faltan datos esenciales.
  // Esto arregla el bug de la "Fila 1" y los fallos al cargar.
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
          const isActive = activeCell && activeCell[0] === r_idx && activeCell[1] === c_idx;

          return (
            <input
              key={`${r_idx}-${c_idx}`}
              type="text"
              value={cell === 0 ? '' : cell}
              disabled={isGiven}
              readOnly={!isGiven}
              onClick={() => !isGiven && onCellClick(r_idx, c_idx)}
              className={`
                w-full h-full aspect-square text-center text-xl sm:text-3xl font-bold cursor-pointer
                ${isGiven ? 'bg-slate-700 text-green-300' : 'bg-slate-800/80'}
                ${isWrong ? 'text-red-500' : 'text-white'}
                ${isActive ? 'ring-4 ring-blue-500 z-10' : ''}
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
  // Nuevo estado para saber qué celda está activa
  const [activeCell, setActiveCell] = useState(null); // Ej: [fila, columna]

  const { board, originalBoard, isGenerating, isSolving, error, solution } = gameState;

  // Creamos los handlers para el Numpad
  const handleNumpadClick = (num) => {
    if (activeCell) {
      handlers.onCellChange(activeCell[0], activeCell[1], num);
      setActiveCell(null); // Cierra el numpad
    }
  };

  const handleNumpadClear = () => {
    if (activeCell) {
      handlers.onCellChange(activeCell[0], activeCell[1], 0); // Envía un 0 (borrar)
      setActiveCell(null);
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* El Numpad se renderiza condicionalmente y flota sobre todo */}
      {activeCell && (
        <Numpad 
          onNumberClick={handleNumpadClick}
          onClear={handleNumpadClear}
          onClose={() => setActiveCell(null)}
        />
      )}

      <h1 className="text-4xl font-bold text-gray-200 mb-6 text-center">Sudoku Solver</h1>
      
      <p className="text-gray-300 text-center mb-6 max-w-md">
        Usa "Nuevo Puzzle" para empezar. Las casillas verdes son fijas.
        Usa "Resolver" para que nuestro algoritmo de backtracking lo solucione.
      </S>
      {/* --- Panel de Control (con Botón de Pista) --- */}
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

      {/* --- El Tablero (Ahora pasa el activeCell) --- */}
      {board && (
        <SudokuGrid 
          board={board}
          originalBoard={originalBoard}
          solution={solution}
          activeCell={activeCell}
          onCellClick={setActiveCell} // Pasa el setter para abrir el Numpad
        />
      )}
    </div>
  );
}

export default SudokuView;