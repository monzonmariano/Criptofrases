// src/App.jsx
import React, { useState } from 'react';
import CryptoSolverView from './views/CryptoSolverView';
import AuthorFinderView from './views/AuthorFinderView';
import HistoryView from './views/HistoryView';
import GeneratorView from './views/GeneratorView'; // <-- 1. Importamos la nueva vista

function App() {
  const [activeView, setActiveView] = useState('solver');

  const commonButtonStyles = "px-4 py-2 text-sm sm:px-6 sm:py-2 sm:text-base rounded-md font-semibold transition";
  const activeButtonStyles = "bg-blue-600 text-white";
  const inactiveButtonStyles = "bg-gray-200 text-gray-700 hover:bg-gray-300";

  return (
    <div className="min-h-screen bg-gray-100 w-full p-4 sm:p-8">
      <nav className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-8">
        <button 
          onClick={() => setActiveView('solver')}
          className={`${commonButtonStyles} ${activeView === 'solver' ? activeButtonStyles : inactiveButtonStyles}`}
        >
          Solver
        </button>
        {/* 2. AÑADIMOS EL NUEVO BOTÓN */}
        <button
          onClick={() => setActiveView('generator')}
          className={`${commonButtonStyles} ${activeView === 'generator' ? activeButtonStyles : inactiveButtonStyles}`}
        >
          Generador
        </button>
        <button
          onClick={() => setActiveView('author')}
          className={`${commonButtonStyles} ${activeView === 'author' ? activeButtonStyles : inactiveButtonStyles}`}
        >
          Buscador de Autor
        </button>
        <button
          onClick={() => setActiveView('history')}
          className={`${commonButtonStyles} ${activeView === 'history' ? activeButtonStyles : inactiveButtonStyles}`}
        >
          Historial
        </button>
      </nav>

      <main>
        {activeView === 'solver' && <CryptoSolverView />}
        {activeView === 'generator' && <GeneratorView />}
        {activeView === 'author' && <AuthorFinderView />}
        {activeView === 'history' && <HistoryView />}
      </main>
    </div>
  );
}

export default App;