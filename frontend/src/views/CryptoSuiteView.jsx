// src/views/CryptoSuiteView.jsx
import React, { useState } from 'react';

import CryptoSolverView from './CryptoSolverView';
import GeneratorView from './GeneratorView';
import AuthorFinderView from './AuthorFinderView';

function CryptoSuiteView({ gameState, setGameState, handlers }) {
  const [activeTab, setActiveTab] = useState('solver');

  // --- NAVEGACIÓN INTERNA (SIN CAMBIOS) ---
  const SubNavBar = () => {
    const commonButtonStyles = "px-4 py-2 text-sm sm:px-6 sm:py-2 sm:text-base rounded-md font-semibold transition-all duration-300 ease-out";
    const activeButtonStyles = "bg-blue-600 text-white shadow-lg";
    const inactiveButtonStyles = "bg-slate-700/50 text-gray-300 hover:bg-slate-600/70";

    return (
      <nav className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-8">
        <button onClick={() => setActiveTab('solver')} className={`${commonButtonStyles} ${activeTab === 'solver' ? activeButtonStyles : inactiveButtonStyles}`}>Solver</button>
        <button onClick={() => setActiveTab('generator')} className={`${commonButtonStyles} ${activeTab === 'generator' ? activeButtonStyles : inactiveButtonStyles}`}>Generador</button>
        <button onClick={() => setActiveTab('author')} className={`${commonButtonStyles} ${activeTab === 'author' ? activeButtonStyles : inactiveButtonStyles}`}>Buscador de Autor</button>
      </nav>
    );
  };
  
  // --- INICIO DE LA CORRECCIÓN ---
  // Se crean funciones específicas para actualizar cada parte del estado.
  // Esto evita la cadena de funciones que causaba el error.

  const setSolverState = (updater) => {
    // 1. Calcula el nuevo estado para 'solver'
    const newSolverState = typeof updater === 'function' ? updater(gameState.solver) : updater;
    // 2. Llama a la función de App.jsx con el objeto 'cryptogram' completo y actualizado
    setGameState({ ...gameState, solver: newSolverState });
  };
  
  const setGeneratorState = (updater) => {
    const newGeneratorState = typeof updater === 'function' ? updater(gameState.generator) : updater;
    setGameState({ ...gameState, generator: newGeneratorState });
  };
  
  const setAuthorFinderState = (updater) => {
    const newAuthorFinderState = typeof updater === 'function' ? updater(gameState.authorFinder) : updater;
    setGameState({ ...gameState, authorFinder: newAuthorFinderState });
  };

  // --- FIN DE LA CORRECCIÓN ---


  // --- Renderizado de la Pestaña Activa ---
  const renderActiveTab = () => {
    switch(activeTab) {
      case 'solver':
        return <CryptoSolverView 
                 state={gameState.solver}
                 setState={setSolverState}
                 onSubmit={handlers.onSolve}
               />;
      case 'generator':
        return <GeneratorView
                 state={gameState.generator}
                 setState={setGeneratorState}
                 onGenerateByTheme={handlers.onGenerateByTheme}
                 onGenerateCustom={handlers.onGenerateCustom}
               />;
      case 'author':
        return <AuthorFinderView
                 state={gameState.authorFinder}
                 setState={setAuthorFinderState}
                 onSubmit={handlers.onFindAuthor}
               />;
      default: return null;
    }
  };

  return (
    <div>
      <SubNavBar />
      {renderActiveTab()}
    </div>
  );
}

export default CryptoSuiteView;