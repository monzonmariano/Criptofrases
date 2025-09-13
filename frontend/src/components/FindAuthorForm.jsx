//----------------------- Archivo: FindAuthorForm.jsx --------------------
// -------Este componente ya no hace la llamada a la API directamente. ---------------
// ---------En su lugar, usa la función handleApiCall que se le pasa como prop----------


import React, { useState } from 'react';
import { sanitizeInput } from '../utils/sanitizeInput';

const FindAuthorForm = ({ userId, handleApiCall }) => {
  const [phrase, setPhrase] = useState('');
  const [author, setAuthor] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthor(null);
    
    const { sanitizedCryptogram } = sanitizeInput(phrase, '');

    const data = await handleApiCall('/api/author', { phrase: sanitizedCryptogram });
    if (data) {
      setAuthor(data.author);
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md space-y-4">
      <h2 className="text-2xl font-semibold text-gray-800 text-center">Encontrar Autor</h2>
      <p className="text-gray-600 text-sm text-center">Escribe una frase y la IA te dirá el autor más probable.</p>
      <textarea
        value={phrase}
        onChange={(e) => setPhrase(e.target.value)}
        placeholder="Escribe la frase aquí..."
        className="w-full h-32 p-3 text-gray-700 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
        required
      />
      <button type="submit" disabled={isLoading} className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition transform hover:scale-105 disabled:bg-gray-400">
        {isLoading ? 'Buscando...' : 'Encontrar Autor'}
      </button>
      {author && (
        <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-lg">
          <h3 className="font-semibold mb-1">Autor:</h3>
          <p className="whitespace-pre-wrap">{author}</p>
        </div>
      )}
    </form>
  );
};

export default FindAuthorForm;
