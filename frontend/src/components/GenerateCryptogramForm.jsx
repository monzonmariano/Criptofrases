import React, { useState } from 'react';
import { sanitizeInput } from '../utils/sanitizeInput';

const GenerateCryptogramForm = ({ userId, handleApiCall }) => {
  const [phrase, setPhrase] = useState('');
  const [cryptogram, setCryptogram] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setCryptogram(null);
    
    const { sanitizedCryptogram } = sanitizeInput(phrase, '');

    const data = await handleApiCall('/api/generate', { phrase: sanitizedCryptogram });
    if (data) {
      setCryptogram(data.cryptogram);
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md space-y-4">
      <h2 className="text-2xl font-semibold text-gray-800 text-center">Generar Criptograma</h2>
      <p className="text-gray-600 text-sm text-center">Crea un criptograma a partir de una frase.</p>
      <textarea
        value={phrase}
        onChange={(e) => setPhrase(e.target.value)}
        placeholder="Escribe la frase aquí..."
        className="w-full h-32 p-3 text-gray-700 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
        required
      />
      <button type="submit" disabled={isLoading} className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition transform hover:scale-105 disabled:bg-gray-400">
        {isLoading ? 'Generando...' : 'Generar'}
      </button>
      {cryptogram && (
        <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-lg">
          <h3 className="font-semibold mb-1">Criptograma Generado:</h3>
          <p className="whitespace-pre-wrap">{cryptogram}</p>
        </div>
      )}
    </form>
  );
};

export default GenerateCryptogramForm;
