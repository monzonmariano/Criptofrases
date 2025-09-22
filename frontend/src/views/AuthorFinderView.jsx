// src/views/AuthorFinderView.jsx
import React, { useState } from 'react';
import { findAuthorOfPhrase } from '../services/apiClient';

function AuthorFinderView() {
  const [phrase, setPhrase] = useState('');
  const [author, setAuthor] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setAuthor('');
    try {
      const response = await findAuthorOfPhrase(phrase);
      setAuthor(response.data.author);
    } catch (err) {
      setError(err.response?.data?.error || 'Ocurrió un error.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto bg-gray-50 rounded-xl shadow-md">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Buscador de Autor</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="phrase" className="block text-gray-700 font-bold mb-2">Frase Célebre</label>
          <textarea
            id="phrase"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 transition"
            rows="4"
            placeholder="Escribe aquí la frase cuyo autor quieres encontrar..."
            value={phrase}
            onChange={(e) => setPhrase(e.target.value)}
          />
        </div>
        <button type="submit" disabled={isLoading} className="w-full px-6 py-3 bg-teal-600 text-white font-bold rounded-md hover:bg-teal-700 disabled:bg-teal-300 transition-all">
          {isLoading ? 'Buscando...' : 'Encontrar Autor'}
        </button>
      </form>

      {/* Área de Resultados */}
      <div className="mt-8">
        {error && <div className="p-4 bg-red-100 text-red-700 rounded-md">{error}</div>}
        {author && (
          <div className="p-4 bg-indigo-100 text-indigo-800 rounded-md">
            <p className="font-bold text-lg">{author}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AuthorFinderView;