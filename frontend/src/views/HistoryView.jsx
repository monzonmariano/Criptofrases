// src/views/HistoryView.jsx
import React, { useState } from 'react';

// 1. Importamos las herramientas que necesitamos de 'date-fns'
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale'; // Importamos el "diccionario" en español

// 1. Re-importamos las funciones necesarias del apiClient para el borrado
import { deleteHistoryEntry, clearUserHistory } from '../services/apiClient';

// --- Iconos para cada tipo de juego (sin cambios) ---
const GameIcon = ({ entry }) => {
  if (entry.is_cryptogram) {
    return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-blue-400"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z" /></svg>
  }
  return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-green-400"><path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9 3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5 5.25 5.25" /></svg>
};

function HistoryView({ state, fetchHistory }) {
  // El estado 'showAll' se mantiene aquí, es local a esta vista.
  const [showAll, setShowAll] = useState(false);

  const handleViewDetails = (entry) => {
    alert(`Futura función: Ver detalles de la partida con ID: ${entry.id}`);
  };

  // 2. Lógica de borrado individual restaurada y funcional
  const handleDelete = async (entryId) => {
    if (window.confirm('¿Estás seguro de que quieres borrar esta entrada?')) {
      try {
        await deleteHistoryEntry(entryId);
        fetchHistory(); // Refresca la lista de historial
      } catch (err) {
        alert('Error: No se pudo borrar la entrada.');
      }
    }
  };

  // 3. Lógica para limpiar todo el historial, restaurada y funcional
  const handleClearAll = async () => {
    if (window.confirm('¿Estás seguro de que quieres borrar TODO tu historial? Esta acción no se puede deshacer.')) {
      try {
        await clearUserHistory();
        fetchHistory(); // Refresca la lista (que ahora estará vacía)
      } catch (err) {
        alert('Error: No se pudo limpiar el historial.');
      }
    }
  };


  if (state.isLoading) return <div className="text-center text-gray-300">Cargando historial...</div>;
  // 2. Filtramos el historial ANTES de mostrarlo.
  //    Solo nos quedamos con las entradas que son resoluciones de criptogramas.
  const filteredHistory = state.history.filter(entry => entry.is_cryptogram);
  
  // Ahora, el botón de "mostrar todo" se basa en la lista ya filtrada.
  const entriesToShow = showAll ? filteredHistory : filteredHistory.slice(0, 3);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-gray-200">Mi Actividad</h1>
        {/* Este botón ahora solo aparece si hay entradas FILTRADAS */}
        {filteredHistory.length > 0 && (
          <button onClick={handleClearAll} className="px-4 py-2 bg-red-800/70 text-red-200 rounded-md hover:bg-red-700 transition">
            Limpiar Todo
          </button>
        )}
      </div>

      {state.error && <div className="p-4 bg-red-500/20 text-red-300 rounded-md">{state.error}</div>}
      
      {/* Mensaje de "vacío" ahora se basa en la lista FILTRADA */}
      {!state.error && filteredHistory.length === 0 && (
        <p className="text-center text-gray-400">Aún no has resuelto ningún criptograma.</p>
      )}

      {!state.error && filteredHistory.length > 0 && (
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          {entriesToShow.map(entry => (
            <div key={entry.id} className="bg-slate-800/60 p-4 rounded-lg shadow-md flex items-center space-x-4 transition-all hover:bg-slate-700/80">
              <div className="flex-shrink-0"><GameIcon entry={entry} /></div>

              <div className="flex-grow min-w-0">
                <p className="font-bold text-gray-200 truncate">{entry.is_cryptogram ? 'Criptograma Resuelto' : 'Búsqueda de Autor'}</p>
                
                {/* 3. Usamos la función para mostrar el tiempo dinámico */}
                <p className="text-sm text-gray-400">
                  {/* El backend debe enviar 'created_at' como un string de fecha (ej: "2025-09-23T03:22:00Z") */}
                  {entry.created_at ? formatDistanceToNow(new Date(entry.created_at), { addSuffix: true, locale: es }) : 'Fecha desconocida'}
                </p> 
                
                <div className="text-xs text-gray-300 bg-black/20 p-2 mt-2 rounded font-mono break-words">{entry.result}</div>
              </div>
              {/* Añadimos la clase 'flex-shrink-0' a este contenedor */}
              <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0">
                <button onClick={() => handleViewDetails(entry)} className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition">Ver Detalles</button>
                <button onClick={() => handleDelete(entry.id)} className="px-3 py-1 bg-red-800/70 text-red-200 rounded text-sm hover:bg-red-700 transition">Borrar</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* El botón "Mostrar todo" ahora se basa en la longitud de la lista FILTRADA */}
      {!state.error && filteredHistory.length > 3 && (
        <div className="text-center mt-6">
          <button onClick={() => setShowAll(!showAll)} className="px-6 py-2 bg-slate-600/50 text-gray-200 rounded-md hover:bg-slate-700/70 transition">
            {showAll ? 'Mostrar menos' : `Mostrar todo (${filteredHistory.length} entradas)`}
          </button>
        </div>
      )}
    </div>
  );
}

export default HistoryView;