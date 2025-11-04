// src/views/HistoryView.jsx
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

// --- ¡NUEVA TARJETA DE SUDOKU! ---
const SudokuCard = ({ game, onLoad }) => {
  const timeAgo = formatDistanceToNow(new Date(game.last_played), { addSuffix: true, locale: es });
  return (
    <div className="bg-blue-900/50 p-4 rounded-lg shadow-lg border border-blue-700">
      <h3 className="text-xl font-bold text-blue-300">Sudoku en Progreso</h3>
      <p className="text-gray-300 mb-4">Guardado {timeAgo}</p>
      <button
        onClick={onLoad}
        className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-all"
      >
        Continuar Partida
      </button>
    </div>
  );
};

// --- ¡NUEVA TARJETA DE CRIPTOGRAMA! ---
const CryptogramCard = ({ game, onLoad }) => {
  const timeAgo = formatDistanceToNow(new Date(game.last_played), { addSuffix: true, locale: es });
  return (
    <div className="bg-green-900/50 p-4 rounded-lg shadow-lg border border-green-700">
      <h3 className="text-xl font-bold text-green-300">Criptograma en Progreso</h3>
      <p className="text-gray-300">Tema: <span className="font-semibold">{game.theme}</span></p>
      <p className="font-mono text-gray-400 text-sm truncate ...">{game.cryptogram}</p>
      <p className="text-gray-300 mb-4">Guardado {timeAgo}</p>
      <button
        onClick={onLoad}
        className="w-full px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition-all"
      >
        Continuar Partida
      </button>
    </div>
  );
};


// --- Tarjeta de Criptograma Completado (Existente) ---
const CryptoEntryCard = ({ entry, onShowDetails }) => {
  const timeAgo = formatDistanceToNow(new Date(entry.timestamp), { addSuffix: true, locale: es });
  
  let title = entry.key_phrase || 'Entrada Desconocida'; // Título por defecto
  let description = "Criptograma Completado";

  try {
    // Intentamos parsear el campo 'details' (que viene como JSON string)
    const details = entry.details ? JSON.parse(entry.details) : {};
    
    if (details.original_phrase) {
        // Generador de Usuario: Usamos la frase que generó
        title = `"${details.original_phrase.substring(0, 30)}..."`;
        description = "Generado por el usuario";
    } else if (details.cryptogram_str && details.solutions && details.solutions.length > 0) {
        // Solver: Usamos la primera solución
        title = `Resuelto: "${details.solutions[0].solution.substring(0, 30)}..."`;
        description = "Resuelto por el Solver";
    }

  } catch(e) {
    // Si el JSON falla, usamos el key_phrase feo
    description = 'Datos Antiguos/Inválidos';
  }

  return (
    <div className="bg-slate-800/50 p-4 rounded-lg shadow-lg border border-slate-700 flex justify-between items-center">
      <div>
        <h3 className="text-lg font-semibold text-gray-200">{title}</h3>
        <p className="text-sm text-gray-400">{description} - {timeAgo}</p>
      </div>
      {entry.details && (
         <button
          onClick={() => onShowDetails(entry.details)}
          className="px-3 py-1 bg-slate-600 text-white text-sm font-semibold rounded-md hover:bg-slate-700 transition-all"
        >
          Ver Detalles
        </button>
      )}
    </div>
  );
};


// --- VISTA PRINCIPAL (MODIFICADA) ---
// (Recibe 'onLoadCryptogram' desde App.jsx)
function HistoryView({ state, fetchHistory, onShowDetails, onLoadSudoku, onLoadCryptogram }) {
  
  // 'state' ahora contiene: items, activeSudoku, activeCryptogram, isLoading, error
  const { items, activeSudoku, activeCryptogram, isLoading, error } = state;

  if (isLoading) {
    return <div className="text-center text-gray-400 animate-pulse">Cargando historial...</div>;
  }

  if (error) {
    return <div className="p-4 bg-red-500/20 text-red-300 rounded-md">{error}</div>;
  }

  // Comprobamos si no hay NADA
  const isEmpty = (!items || items.length === 0) && !activeSudoku && !activeCryptogram;

  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-200 mb-8 text-center">Mi Historial</h1>
      
      {isEmpty ? (
        <p className="text-center text-gray-400">No tienes partidas guardadas ni historial de criptogramas.</p>
      ) : (
        <div className="space-y-6">
          
          {/* --- SECCIÓN DE JUEGOS ACTIVOS --- */}
          {(activeSudoku || activeCryptogram) && (
             <div>
                <h2 className="text-2xl font-semibold text-gray-300 mb-4 border-b border-gray-600 pb-2">Partidas Guardadas</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeSudoku && (
                    <SudokuCard game={activeSudoku} onLoad={onLoadSudoku} />
                  )}
                  {activeCryptogram && (
                    <CryptogramCard game={activeCryptogram} onLoad={onLoadCryptogram} />
                  )}
                </div>
             </div>
          )}

          {/* --- SECCIÓN DE CRIPTOGRAMAS COMPLETADOS --- */}
          {items && items.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-300 mb-4 border-b border-gray-600 pb-2">Historial de Entradas</h2>
              <div className="space-y-4">
                {items.map(entry => (
                  <CryptoEntryCard 
                    key={entry.id} 
                    entry={entry} 
                    onShowDetails={onShowDetails}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default HistoryView;