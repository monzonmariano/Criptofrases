//----------------------- Archivo: SolveCryptogramForm -----------------------------------
// este componente  depende de handleApiCall para comunicarse con el backend, eliminando la lógica de fetch de su interior.

import React, { useState } from 'react';
import { sanitizeInput } from '../utils/sanitizeInput';

const SolveCryptogramForm = ({ userId, handleApiCall }) => {
  const [cryptogram, setCryptogram] = useState('');
  const [clues, setClues] = useState('');
  const [solution, setSolution] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSolution(null);
    
    const { sanitizedCryptogram, sanitizedClues } = sanitizeInput(cryptogram, clues);

    const data = await handleApiCall('/api/solve', { cryptogram: sanitizedCryptogram, clues: sanitizedClues });
    if (data) {
      setSolution(data.solution);
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md space-y-4">
      <h2 className="text-2xl font-semibold text-gray-800 text-center">Resolver Criptograma</h2>
      <p className="text-gray-600 text-sm text-center">Ingresa tu criptograma para que la IA lo resuelva.</p>
      <textarea
        value={cryptogram}
        onChange={(e) => setCryptogram(e.target.value)}
        placeholder="Escribe el criptograma aquí..."
        className="w-full h-32 p-3 text-gray-700 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
        required
      />
      <input
        type="text"
        value={clues}
        onChange={(e) => setClues(e.target.value)}
        placeholder="Pistas (opcional)"
        className="w-full p-3 text-gray-700 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      />
      <button type="submit" disabled={isLoading} className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition transform hover:scale-105 disabled:bg-gray-400">
        {isLoading ? 'Resolviendo...' : 'Resolver'}
      </button>
      {solution && (
        <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-lg">
          <h3 className="font-semibold mb-1">Solución:</h3>
          <p className="whitespace-pre-wrap">{solution}</p>
        </div>
      )}
    </form>
  );
};

export default SolveCryptogramForm;
