// src/views/HistoryView.jsx
import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import { deleteHistoryEntry, clearUserHistory } from '../services/apiClient'

// --- Icono para el tipo de juego ---
const GameIcon = ({ entry }) => {
  // En el futuro, puedes añadir más 'case' para Sudoku, etc.
  switch(entry.entry_type) {
    case 'solver':
      // Icono de pieza de puzzle para "Resolver"
      return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-blue-400"><path strokeLinecap="round" strokeLinejoin="round" d="M14.25 6.087c0-1.731 1.018-3.137 2.25-3.137s2.25 1.406 2.25 3.137m0 0v9.75m0-9.75h-4.5m4.5 0v9.75m-4.5-9.75h-4.5m4.5 0v9.75m0 0h-4.5m4.5 0c0 1.731-1.018 3.137-2.25 3.137s-2.25-1.406-2.25-3.137m0 0h4.5m-4.5 0h-4.5m0 0v-9.75m0 9.75v-9.75m0 0h4.5m0 0c0-1.731 1.018-3.137 2.25-3.137s2.25 1.406 2.25 3.137m0 0v-9.75m0 9.75h-4.5" /></svg>
    case 'user_generator':
      // Icono de lápiz para "Crear"
      return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-green-400"><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>
    default:
      return null
  }
};

// --- Iconos para los botones de acción ---
const ViewIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.067-2.09.92-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>

function HistoryView({ state, fetchHistory, onShowDetails }) {
  const [showAll, setShowAll] = useState(false);

  const handleDelete = async (entryId) => {
    if (window.confirm('¿Estás seguro de que quieres borrar esta entrada?')) {
      try {
        await deleteHistoryEntry(entryId);
        fetchHistory();
      } catch (err) {
        alert('Error: No se pudo borrar la entrada.');
      }
    }
  };

  const handleClearAll = async () => {
    if (window.confirm('¿Estás seguro de que quieres borrar TODO tu historial? Esta acción no se puede deshacer.')) {
      try {
        await clearUserHistory();
        fetchHistory();
      } catch (err) {
        alert('Error: No se pudo limpiar el historial.');
      }
    }
  };
  
  const handleViewDetails = (entry) => {
    if (entry.details) {
      onShowDetails(entry);
    } else {
      alert("No hay detalles adicionales para esta entrada.");
    }
  };

  if (state.isLoading) return <div className="text-center text-gray-300">Cargando historial...</div>;
  
  // Filtra el historial para mostrar solo las actividades relevantes para el usuario
  const filteredHistory = state.history.filter(entry => 
    ['solver', 'user_generator'].includes(entry.entry_type)
  );
  
  const entriesToShow = showAll ? filteredHistory : filteredHistory.slice(0, 3);
  const titleMap = {
    solver: 'Criptograma Resuelto',
    user_generator: 'Criptograma Creado'
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-gray-200">Mi Actividad</h1>
        {filteredHistory.length > 0 && (
          <button onClick={handleClearAll} className="px-4 py-2 bg-red-800/70 text-red-200 rounded-md hover:bg-red-700 transition">
            Limpiar Todo
          </button>
        )}
      </div>

      {state.error && <div className="p-4 bg-red-500/20 text-red-300 rounded-md">{state.error}</div>}
      
      {!state.error && filteredHistory.length === 0 && (
        <p className="text-center text-gray-400">Aún no tienes actividad registrada.</p>
      )}

      {!state.error && filteredHistory.length > 0 && (
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          {entriesToShow.map(entry => (
            <div key={entry.id} className="bg-slate-800/60 p-4 rounded-lg shadow-md flex items-center space-x-4">
              <div className="flex-shrink-0">
                <GameIcon entry={entry} />
              </div>
              <div className="flex-grow min-w-0">
                <p className="font-bold text-gray-200 truncate">{titleMap[entry.entry_type] || 'Actividad'}</p>
                <p className="text-sm text-gray-400">
                  {entry.created_at ? formatDistanceToNow(new Date(entry.created_at), { addSuffix: true, locale: es }) : 'Fecha desconocida'}
                </p> 
                <div className="text-xs text-gray-300 bg-black/20 p-2 mt-2 rounded font-mono break-words">
                  {entry.result || (entry.details && (entry.details.cryptogram || entry.details.cryptogram_str))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0">
                {/* Botón Ver Detalles con Icono y Tooltip */}
                <div className="relative group">
                  <button onClick={() => handleViewDetails(entry)} className="p-2 bg-slate-700/50 rounded-full text-white/80 hover:text-white hover:bg-blue-600 transition-colors">
                    <ViewIcon />
                  </button>
                  <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/80 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    Ver Detalles
                  </span>
                </div>
                {/* Botón Borrar con Icono y Tooltip */}
                <div className="relative group">
                  <button onClick={() => handleDelete(entry.id)} className="p-2 bg-slate-700/50 rounded-full text-white/80 hover:text-white hover:bg-red-600 transition-colors">
                    <TrashIcon />
                  </button>
                  <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/80 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    Borrar
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredHistory.length > 3 && (
        <div className="text-center mt-6">
          <button 
            onClick={() => setShowAll(!showAll)}
            className="px-6 py-2 bg-slate-600/50 text-gray-200 rounded-md hover:bg-slate-700/70 transition"
          >
            {showAll ? 'Mostrar menos' : `Mostrar todo (${filteredHistory.length} entradas)`}
          </button>
        </div>
      )}
    </div>
  );
}

export default HistoryView;