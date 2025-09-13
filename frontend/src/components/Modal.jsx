import React from 'react';

const Modal = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 shadow-xl max-w-sm w-full">
        <p className="text-center text-gray-800 mb-4">{message}</p>
        <div className="flex justify-center space-x-4">
          <button onClick={onCancel} className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition">
            Cancelar
          </button>
          <button onClick={onConfirm} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
            Borrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
