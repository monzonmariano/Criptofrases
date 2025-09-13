//------------------------------ Archivo: History.jsx ----------------------------------------
//----------------- Este componente es el encargado de mostrar el historial. ----------------
// ----Ya no tiene la lógica de fetch, sino que recibe el array de history como un prop de App.jsx,
//-------------------  que a su vez se actualiza con onSnapshot-----------------------------------

import React from 'react';
import Modal from './Modal';

const History = ({ history, isLoadingHistory, handleDeleteEntry, handleDeleteAll }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4">Historial de Interacciones</h2>
      <div className="flex justify-end mb-4">
        <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition">
          Borrar todo el historial
        </button>
      </div>
      {isLoadingHistory ? (
        <div className="text-center text-gray-500">Cargando historial...</div>
      ) : history.length === 0 ? (
        <div className="text-center text-gray-500">Tu historial está vacío.</div>
      ) : (
        <ul className="space-y-4">
          {history.sort((a,b) => b.timestamp - a.timestamp).map((entry) => (
            <li key={entry.id} className="p-4 bg-gray-100 rounded-lg shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-xs">
                    {entry.timestamp ? new Date(entry.timestamp.toDate()).toLocaleString() : 'Fecha no disponible'}
                  </p>
                  <p className="font-bold text-lg text-gray-800">
                    {entry.is_cryptogram ? 'Criptograma:' : 'Autor:'}
                  </p>
                  <p className="text-gray-700 mt-1 whitespace-pre-wrap">
                    {entry.content}
                  </p>
                  <p className="mt-2 font-bold text-gray-800">
                    {entry.is_cryptogram ? 'Solución:' : 'Autor encontrado:'}
                  </p>
                  <p className="text-blue-600 mt-1 whitespace-pre-wrap font-mono">
                    {entry.result}
                  </p>
                </div>
                <button onClick={() => handleDeleteEntry(entry.id)} className="text-red-500 hover:text-red-700 transition">
                  &times;
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      {showModal && (
        <Modal 
          message="¿Estás seguro de que quieres borrar todo el historial? Esta acción no se puede deshacer."
          onConfirm={handleDeleteAll}
          onCancel={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default History;
