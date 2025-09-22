// src/views/GeneratorView.jsx
import React, { useState } from 'react';
import { generateCryptogram } from '../services/apiClient';

function GeneratorView() {
  const [theme, setTheme] = useState('filosofia'); // Tema por defecto
  const [generatedData, setGeneratedData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const themes = ['filosofia', 'ciencia', 'arte', 'tecnologia', 'sabiduria', 'historia'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setGeneratedData(null);
    try {
      const response = await generateCryptogram(theme);
      setGeneratedData(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Ocurrió un error.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto bg-gray-50 rounded-xl shadow-md">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Generador de Criptofrases</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="theme-select" className="block text-gray-700 font-bold mb-2">
            Elige un Tema
          </label>
          <select
            id="theme-select"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
          >
            {themes.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
          </select>
        </div>
        <button type="submit" disabled={isLoading} className="w-full px-6 py-3 bg-green-600 text-white font-bold rounded-md hover:bg-green-700 disabled:bg-green-300 transition-all">
          {isLoading ? 'Generando...' : 'Generar Nuevo Criptograma'}
        </button>
      </form>

      {/* Área de Resultados */}
      <div className="mt-8">
        {error && <div className="p-4 bg-red-100 text-red-700 rounded-md">{error}</div>}
        {generatedData && (
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-gray-700">Frase Original:</h3>
              <p className="p-2 bg-gray-100 rounded-md italic">"{generatedData.original_phrase}"</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-700">Criptograma Generado:</h3>
              <p className="p-2 bg-gray-100 rounded-md font-mono break-words">{generatedData.cryptogram}</p>
            </div>
             <div>
              <h3 className="font-bold text-gray-700">Pistas:</h3>
              <p className="p-2 bg-yellow-100 rounded-md font-mono">{JSON.stringify(generatedData.clues)}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default GeneratorView;