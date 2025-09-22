// src/views/CryptoSolverView.jsx
import React, { useState } from 'react';
import { solveCryptogram } from '../services/apiClient';

function CryptoSolverView() {
  // --- ESTADOS DEL COMPONENTE ---
  const [cryptogram, setCryptogram] = useState('');
  const [clues, setClues] = useState([{ num: '', letter: '' }]);
  const [solutions, setSolutions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeIndex, setActiveIndex] = useState(0); // NUEVO: El índice de la solución que estamos viendo

  // --- MANEJADORES DE EVENTOS ---
  const handleClueChange = (index, field, value) => {
    const newClues = [...clues];
    newClues[index][field] = value;
    setClues(newClues);
  };

  const handleAddClue = () => {
    setClues([...clues, { num: '', letter: '' }]);
  };

  const handleRemoveClue = (index) => {
    const newClues = clues.filter((_, i) => i !== index);
    setClues(newClues);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');
    setSolutions([]);
    setActiveIndex(0); // NUEVO: Reseteamos el índice en cada nueva búsqueda

    const cluesObject = clues.reduce((acc, clue) => {
      if (clue.num && clue.letter) {
        acc[clue.num] = clue.letter;
      }
      return acc;
    }, {});

    try {
      const response = await solveCryptogram(cryptogram, cluesObject);
      setSolutions(response.data.solutions || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Ocurrió un error al contactar al servidor.');
      setSolutions([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // NUEVO: Funciones para navegar entre soluciones
  const handlePrevSolution = () => {
    setActiveIndex((prevIndex) => Math.max(0, prevIndex - 1));
  };

  const handleNextSolution = () => {
    setActiveIndex((prevIndex) => Math.min(solutions.length - 1, prevIndex + 1));
  };

  // --- RENDERIZADO (LO QUE SE VE EN PANTALLA) ---
  return (
    <div className="p-8 max-w-4xl mx-auto bg-gray-50 rounded-xl shadow-md">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Crypto Solver v1.0</h1>
      
      <form onSubmit={handleSubmit}>
        {/* ... (el formulario de cryptogram y clues se mantiene igual) ... */}
        <div className="mb-4">
          <label htmlFor="cryptogram" className="block text-gray-700 font-bold mb-2">Criptograma</label>
          <textarea id="cryptogram" className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 transition" rows="5" placeholder="Pega tu criptograma aquí. Ej: 1-2 3-4-5-1-6..." value={cryptogram} onChange={(e) => setCryptogram(e.target.value)} />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 font-bold mb-2">Pistas (Opcional)</label>
          {clues.map((clue, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <input type="text" placeholder="Nº" className="w-16 p-2 border rounded-md text-center" value={clue.num} onChange={(e) => handleClueChange(index, 'num', e.target.value)} />
              <span className="font-bold">=</span>
              <input type="text" placeholder="Letra" maxLength="1" className="w-16 p-2 border rounded-md text-center" value={clue.letter} onChange={(e) => handleClueChange(index, 'letter', e.target.value)} />
              <button type="button" onClick={() => handleRemoveClue(index)} className="text-red-500 font-bold">X</button>
            </div>
          ))}
          <button type="button" onClick={handleAddClue} className="mt-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">+</button>
        </div>
        <button type="submit" disabled={isLoading} className="w-full px-6 py-3 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 disabled:bg-blue-300 transition-all">
          {isLoading ? 'Resolviendo...' : 'Resolver'}
        </button>
      </form>

      {/* --- ÁREA DE RESULTADOS MEJORADA --- */}
      <div className="mt-8">
        {error && <div className="p-4 bg-red-100 text-red-700 rounded-md">{error}</div>}
        
        {solutions.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Soluciones Encontradas</h2>
              
              {/* NUEVO: Navegador de soluciones */}
              {solutions.length > 1 && (
                <div className="flex items-center space-x-4">
                  <button onClick={handlePrevSolution} disabled={activeIndex === 0} className="px-4 py-2 bg-gray-300 rounded-md disabled:opacity-50">Anterior</button>
                  <span className="font-semibold text-gray-700">{activeIndex + 1} / {solutions.length}</span>
                  <button onClick={handleNextSolution} disabled={activeIndex === solutions.length - 1} className="px-4 py-2 bg-gray-300 rounded-md disabled:opacity-50">Siguiente</button>
                </div>
              )}
            </div>

            {/* NUEVO: La solución mostrada ahora depende del activeIndex */}
            <div className="p-4 bg-green-100 text-green-800 rounded-md font-mono text-lg break-words">
              {solutions[activeIndex].solution}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CryptoSolverView;