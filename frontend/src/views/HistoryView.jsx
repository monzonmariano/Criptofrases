// src/views/HistoryView.jsx
import React, { useState, useEffect } from 'react';
import { getUserHistory, deleteHistoryEntry } from '../services/apiClient';

function HistoryView() {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const userId = 'frontend_user'; // Usamos un ID fijo por ahora

  // --- useEffect: El Hook para "Efectos Secundarios" ---
  // El código dentro de useEffect se ejecuta DESPUÉS de que el componente se renderiza.
  // Con el array vacío `[]`, solo se ejecuta UNA VEZ, cuando el componente "nace".
  // Es el lugar perfecto para hacer llamadas a la API.
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await getUserHistory(userId);
        setHistory(response.data.history || []);
      } catch (err) {
        setError('No se pudo cargar el historial.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [userId]); // El array de dependencias. Se re-ejecuta si userId cambia.

  const handleDelete = async (entryId) => {
    try {
      await deleteHistoryEntry(entryId, userId);
      // Actualizamos el estado local para quitar la entrada borrada,
      // sin necesidad de volver a pedir toda la lista al servidor.
      setHistory(history.filter(entry => entry.id !== entryId));
    } catch (err) {
      setError('No se pudo borrar la entrada.');
    }
  };

  if (isLoading) return <div className="text-center">Cargando historial...</div>;
  if (error) return <div className="p-4 bg-red-100 text-red-700 rounded-md">{error}</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">Mi Historial</h1>
      
      {history.length === 0 ? (
        <p className="text-center text-gray-500">Aún no tienes actividad registrada.</p>
      ) : (
        <div className="space-y-4">
          {history.map(entry => (
            <div key={entry.id} className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">{entry.is_cryptogram ? 'Criptograma' : 'Búsqueda de Autor'}</p>
                <p className="font-mono text-gray-800 break-all"><strong>Entrada:</strong> {entry.content}</p>
                <p className="font-mono text-green-700 break-all"><strong>Resultado:</strong> {entry.result}</p>
                {entry.author && <p className="text-sm text-blue-600"><strong>Autor:</strong> {entry.author}</p>}
              </div>
              <button onClick={() => handleDelete(entry.id)} className="ml-4 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition">
                Borrar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default HistoryView;