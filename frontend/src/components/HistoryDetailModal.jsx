// src/components/HistoryDetailModal.jsx

import React, { useState, useEffect } from 'react';

// El componente recibe los 'datos' a mostrar y una función para 'cerrarse'
function HistoryDetailModal({ data, onClose }) {
  // --- LÓGICA DE ANIMACIÓN MEJORADA ---
  const [isClosing, setIsClosing] = useState(false);
  // Nuevo estado para controlar la animación de entrada
  const [isMounted, setIsMounted] = useState(false);

  // Efecto para la animación de ENTRADA
  useEffect(() => {
    // Montamos el componente después de un instante para que el navegador
    // pueda registrar el estado inicial (transparente) y animar al estado final (opaco).
    const entryTimer = setTimeout(() => setIsMounted(true), 10);
    return () => clearTimeout(entryTimer);
  }, []); // El array vacío [] asegura que esto solo se ejecute una vez, al montar.

  // Efecto para la animación de SALIDA
  useEffect(() => {
    if (isClosing) {
      const exitTimer = setTimeout(() => {
        onClose(); // Llama a la función de cierre real después de 300ms
      }, 100); 
      return () => clearTimeout(exitTimer);
    }
  }, [isClosing, onClose]);

  const handleClose = () => {
    setIsClosing(true);
  };

  if (!data) return null;

  // --- FIN DE LA LÓGICA DE ANIMACIÓN ---

  return (
    // Fondo oscuro semitransparente que cubre toda la pantalla
    <div 
      className={`fixed inset-0 flex items-center justify-center z-50 p-4 transition-opacity duration-100 ${isMounted && !isClosing ? 'opacity-100' : 'opacity-0'}`}
      onClick={handleClose}
    >
      {/* El contenedor del modal tendrá transición de opacidad y escala */}
      <div 
        className={`bg-slate-800 text-white rounded-xl shadow-lg w-full max-w-2xl max-h-[80vh] p-6 flex flex-col transition-all duration-100 ease-in-out ${isMounted && !isClosing ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
        onClick={(e) => e.stopPropagation()} 
      >
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <h2 className="text-2xl font-bold text-blue-400">Detalles de la Actividad</h2>
          <button onClick={handleClose} className="text-3xl font-bold text-gray-400 hover:text-white transition-colors">&times;</button>
        </div>
        {/* Contenido que se puede scrollear si es muy largo */}
        <div className="overflow-y-auto pr-2">
          {/* Sección Criptograma Original */}
          <div className="mb-4">
            <h3 className="font-bold text-gray-300">Criptograma Original:</h3>
            <p className="p-2 mt-1 bg-black/20 rounded-md font-mono break-words">{data.cryptogram_str || data.original_phrase}</p>
          </div>

          {/* Sección Pistas (solo para resoluciones) */}
          {data.clues_used && (
            <div className="mb-4">
              <h3 className="font-bold text-gray-300">Pistas Usadas:</h3>
              <p className="p-2 mt-1 bg-black/20 rounded-md font-mono">
                {Object.keys(data.clues_used).length > 0 ? JSON.stringify(data.clues_used) : 'Ninguna'}
              </p>
            </div>
          )}
          
          {/* Sección Soluciones (solo para resoluciones) */}
          {data.solutions && (
            <div>
              <h3 className="font-bold text-gray-300">Soluciones Encontradas:</h3>
              <div className="space-y-2 mt-1">
                {data.solutions.map((sol, index) => (
                  <div key={index} className={`p-2 rounded-md font-mono ${index === 0 ? 'bg-green-500/20 text-green-300' : 'bg-slate-700/50'}`}>
                    {index + 1}. {sol.solution}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sección Clave de Solución (solo para creaciones del usuario) */}
          {data.solution_key && (
             <div>
              <h3 className="font-bold text-gray-300">Clave de Solución:</h3>
              <p className="p-2 mt-1 bg-black/20 rounded-md font-mono break-words">
                {JSON.stringify(data.solution_key)}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HistoryDetailModal;