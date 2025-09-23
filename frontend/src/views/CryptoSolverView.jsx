// src/views/CryptoSolverView.jsx
import React from 'react';

function CryptoSolverView({ state, setState, onSubmit }) {
  const handleCryptogramChange = (e) => setState(prev => ({ ...prev, cryptogram: e.target.value }));

  const handleClueChange = (index, field, value) => {
    const newClues = state.clues.map((clue, i) => {
      // Si este es el elemento que queremos cambiar...
      if (i === index) {
        // ...devolvemos un objeto COMPLETAMENTE NUEVO con el valor actualizado.
        return { ...clue, [field]: value };
      }
      // Para todos los demás, los devolvemos sin cambios.
      return clue;
    });
    // Ahora le pasamos a React un array 100% nuevo, y detectará el cambio sin problemas.
    setState(prev => ({ ...prev, clues: newClues }));
  };
  
  const handleAddClue = () => setState(prev => ({ ...prev, clues: [...prev.clues, { num: '', letter: '' }] }));
  const handleRemoveClue = (index) => setState(prev => ({ ...prev, clues: prev.clues.filter((_, i) => i !== index) }));
  const handlePrevSolution = () => setState(prev => ({ ...prev, activeIndex: Math.max(0, prev.activeIndex - 1) }));
  const handleNextSolution = () => setState(prev => ({ ...prev, activeIndex: Math.min(prev.solutions.length - 1, prev.activeIndex + 1) }));

  const handleSubmit = (e) => {
    e.preventDefault();

    // --- EXPRESIÓN REGULAR MEJORADA ---
    // Esta nueva regla es mucho más estricta y valida la estructura "número-número".
    const validPattern = /^\d+(-\d+)*(\s\d+(-\d+)*)*$/;

    // La lógica de validación ahora usa el nuevo patrón.
    if (state.cryptogram.trim() === '' || validPattern.test(state.cryptogram)) {
      onSubmit();
    } else {
      setState(prev => ({ ...prev, error: 'Formato inválido. Usa un formato como "1-2 3-4-5".' }));
    }
  };

  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-200 mb-6 text-center">Crypto Solver</h1>
      <form onSubmit={handleSubmit}>
        {/* ... (resto del JSX sin cambios) ... */}
        <div className="mb-4">
          <label htmlFor="cryptogram" className="block text-gray-300 font-bold mb-2">Criptograma</label>
          <textarea id="cryptogram" className="w-full p-3 bg-slate-800/50 text-white placeholder-gray-400 border border-slate-600 rounded-md focus:ring-2 focus:ring-blue-500 transition" rows="5" placeholder="Pega tu criptograma aquí. Ej: 1-2 3-4-5-1-6..." value={state.cryptogram} onChange={handleCryptogramChange} />
        </div>
        <div className="mb-6">
          <label className="block text-gray-300 font-bold mb-2">Pistas (Opcional)</label>
          {state.clues.map((clue, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <input type="text" placeholder="Nº" className="w-16 p-2 bg-slate-800/50 text-white text-center border border-slate-600 rounded-md" value={clue.num} onChange={(e) => handleClueChange(index, 'num', e.target.value)} />
              <span className="font-bold text-gray-300">=</span>
              <input type="text" placeholder="Letra" maxLength="1" className="w-16 p-2 bg-slate-800/50 text-white text-center border border-slate-600 rounded-md" value={clue.letter} onChange={(e) => handleClueChange(index, 'letter', e.target.value)} />
              <button type="button" onClick={() => handleRemoveClue(index)} className="text-red-500 font-bold hover:text-red-400">X</button>
            </div>
          ))}
          <button type="button" onClick={handleAddClue} className="mt-2 px-4 py-2 bg-slate-600/50 text-gray-200 rounded-md hover:bg-slate-700/70">+</button>
        </div>
        <button type="submit" disabled={state.isLoading} className="w-full px-6 py-3 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 disabled:bg-blue-300 transition-all">
          {state.isLoading ? 'Resolviendo...' : 'Resolver'}
        </button>
      </form>
      <div className="mt-8">
        {state.error && <div className="p-4 bg-red-500/20 text-red-300 rounded-md">{state.error}</div>}
        {state.solutions.length > 0 && (
           <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-200">Soluciones Encontradas</h2>
              {state.solutions.length > 1 && (
                <div className="flex items-center space-x-4">
                  <button onClick={handlePrevSolution} disabled={state.activeIndex === 0} className="px-4 py-2 bg-slate-600/50 text-gray-200 rounded-md disabled:opacity-50 hover:bg-slate-700/70">Anterior</button>
                  <span className="font-semibold text-gray-300">{state.activeIndex + 1} / {state.solutions.length}</span>
                  <button onClick={handleNextSolution} disabled={state.activeIndex === state.solutions.length - 1} className="px-4 py-2 bg-slate-600/50 text-gray-200 rounded-md disabled:opacity-50 hover:bg-slate-700/70">Siguiente</button>
                </div>
              )}
            </div>
            <div className="p-4 bg-green-500/10 text-green-300 rounded-md font-mono text-lg break-words">
              {state.solutions[state.activeIndex].solution}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CryptoSolverView;