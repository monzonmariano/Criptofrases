//------------------------ Archivo: App.jsx ------------------------------
//----------- Este archivo se convierte en el "director de orquesta". 



// Archivo: src/App.jsx
import React, { useState, useEffect } from 'react';

// Centralizamos los componentes aquí para la simplicidad de un solo archivo
const sanitizeInput = (cryptogram, clues) => {
  const sanitizedCryptogram = cryptogram
    .replace(/\s*-\s*/g, '-')
    .trim()
    .replace(/\s+/g, ' ');

  const sanitizedClues = clues ? clues.trim().toLowerCase().replace(/\s/g, '') : '';
  return { sanitizedCryptogram, sanitizedClues };
};

// Componente para resolver un criptograma
const SolveCryptogramForm = ({ handleApiCall, userId }) => {
  const [cryptogram, setCryptogram] = useState('');
  const [clues, setClues] = useState('');
  const [solution, setSolution] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSolution(null);
    setErrorMessage('');
    setShowErrorModal(false);

    const { sanitizedCryptogram, sanitizedClues } = sanitizeInput(cryptogram, clues);

    const data = await handleApiCall('/api/solve', {
      cryptogram: sanitizedCryptogram,
      clues: sanitizedClues,
      user_id: userId
    });

    if (data) {
      if (data.solution) {
        setSolution(data.solution);
      } else if (data.error) {
        setErrorMessage(data.error);
        setShowErrorModal(true);
      }
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md space-y-4">
      <h2 className="text-2xl font-semibold text-gray-800 text-center">Resolver Criptograma</h2>
      <p className="text-gray-600 text-sm text-center">Ingresa tu criptograma para que la IA lo resuelva.</p>
      <textarea
        value={cryptogram}
        onChange={(e) => setCryptogram(e.target.value)}
        placeholder="Escribe el criptograma aquí...(EJemplo: 2-3 6-4-8-8-4 2-1 9-10 7-10-5-11-7-3)"
        className="w-full h-32 p-3 text-gray-700 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
        required
      />
      <input
        type="text"
        value={clues}
        onChange={(e) => setClues(e.target.value)}
        placeholder="Pistas (Ejemplo: 2=s, 4=m, 7=a ...)"
        className="w-full p-3 text-gray-700 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      />
      <button type="submit" disabled={isLoading} className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition transform hover:scale-105 disabled:bg-gray-400">
        {isLoading ? 'Resolviendo...' : 'Resolver'}
      </button>
      {solution && (
        <div className="mt-4 p-4 bg-green-100 border border-green-300 text-green-800 rounded-lg">
          <h3 className="font-semibold">Solución:</h3>
          <p className="whitespace-pre-wrap">{solution}</p>
        </div>
      )}
      {showErrorModal && <Modal message={errorMessage} onClose={() => setShowErrorModal(false)} />}
    </form>
  );
};

// Componente para encontrar un autor
const FindAuthorForm = ({ handleApiCall, userId }) => {
  const [phrase, setPhrase] = useState('');
  const [author, setAuthor] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthor(null);
    setErrorMessage('');
    setShowErrorModal(false);
    
    const { sanitizedCryptogram } = sanitizeInput(phrase, '');

    const data = await handleApiCall('/api/author', { phrase: sanitizedCryptogram, user_id: userId });
    if (data) {
      if (data.author) {
        setAuthor(data.author);
      } else if (data.error) {
        setErrorMessage(data.error);
        setShowErrorModal(true);
      }
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
        <div className="mt-4 p-4 bg-green-100 border border-green-300 text-green-800 rounded-lg">
          <h3 className="font-semibold">Autor:</h3>
          <p className="whitespace-pre-wrap">{author}</p>
        </div>
      )}
      {showErrorModal && <Modal message={errorMessage} onClose={() => setShowErrorModal(false)} />}
    </form>
  );
};

// Componente para generar un criptograma
const GenerateCryptogramForm = ({ handleApiCall, userId }) => {
  const [phrase, setPhrase] = useState('');
  const [cryptogram, setCryptogram] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setCryptogram(null);
    setErrorMessage('');
    setShowErrorModal(false);

    const { sanitizedCryptogram } = sanitizeInput(phrase, '');

    const data = await handleApiCall('/api/generate', { phrase: sanitizedCryptogram, user_id: userId });
    if (data) {
      if (data.cryptogram) {
        setCryptogram(data.cryptogram);
      } else if (data.error) {
        setErrorMessage(data.error);
        setShowErrorModal(true);
      }
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md space-y-4">
      <h2 className="text-2xl font-semibold text-gray-800 text-center">Generar Criptograma</h2>
      <p className="text-gray-600 text-sm text-center">Convierte cualquier frase en un criptograma.</p>
      <textarea
        value={phrase}
        onChange={(e) => setPhrase(e.target.value)}
        placeholder="Escribe la frase para el criptograma aquí..."
        className="w-full h-32 p-3 text-gray-700 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
        required
      />
      <button type="submit" disabled={isLoading} className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition transform hover:scale-105 disabled:bg-gray-400">
        {isLoading ? 'Generando...' : 'Generar'}
      </button>
      {cryptogram && (
        <div className="mt-4 p-4 bg-green-100 border border-green-300 text-green-800 rounded-lg">
          <h3 className="font-semibold">Criptograma Generado:</h3>
          <p className="whitespace-pre-wrap">{cryptogram}</p>
        </div>
      )}
      {showErrorModal && <Modal message={errorMessage} onClose={() => setShowErrorModal(false)} />}
    </form>
  );
};

// Componente para el historial
const History = ({ handleApiCall, userId, onEntryDeleted, key }) => {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoading(true);
      setHistory([]);
      setErrorMessage('');
      setShowErrorModal(false);

      const data = await handleApiCall(`/api/history?user_id=${userId}`, null, 'GET');
      if (data) {
        if (data.history) {
          setHistory(data.history);
        } else if (data.error) {
          setErrorMessage(data.error);
          setShowErrorModal(true);
        }
      }
      setIsLoading(false);
    };

    fetchHistory();
  }, [userId, key, handleApiCall]);

  const handleDeleteClick = (entry) => {
    setEntryToDelete(entry);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    setShowModal(false);
    if (entryToDelete) {
      const data = await handleApiCall(`/api/delete-entry`, { entry_id: entryToDelete.id, user_id: userId }, 'DELETE');
      if (data) {
        if (data.message) {
          onEntryDeleted();
        } else if (data.error) {
          setErrorMessage(data.error);
          setShowErrorModal(true);
        }
      }
    }
  };

  const clearAllHistory = async () => {
    const data = await handleApiCall('/api/clear-history', { user_id: userId }, 'DELETE');
    if (data) {
      if (data.message) {
        onEntryDeleted();
      } else if (data.error) {
        setErrorMessage(data.error);
        setShowErrorModal(true);
      }
    }
  };

  const renderEntry = (entry) => (
    <li key={entry.id} className="bg-gray-100 p-4 rounded-lg shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-800 break-words">Contenido: {entry.content}</p>
        <p className="text-sm text-gray-600 break-words mt-1">
          Resultado: {entry.result}
        </p>
        <p className="text-xs text-gray-500 mt-1">Tipo: {entry.is_cryptogram ? 'Criptograma' : 'Autor'}</p>
      </div>
      <button
        onClick={() => handleDeleteClick(entry)}
        className="text-red-500 hover:text-red-700 transition self-end sm:self-center"
        aria-label="Borrar entrada"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </li>
  );

  if (isLoading) {
    return (
      <div className="text-center text-gray-500">Cargando historial...</div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-md space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-4 sm:space-y-0">
        <h2 className="text-2xl font-semibold text-gray-800 text-center sm:text-left">Historial</h2>
        {history.length > 0 && (
          <button
            onClick={clearAllHistory}
            className="w-full sm:w-auto py-2 px-4 bg-red-600 text-white font-bold rounded-lg shadow-lg hover:bg-red-700 transition transform hover:scale-105"
          >
            Borrar Todo el Historial
          </button>
        )}
      </div>
      {history.length > 0 ? (
        <ul className="space-y-4">
          {history.map(renderEntry)}
        </ul>
      ) : (
        <p className="text-gray-500 text-center">Tu historial está vacío. ¡Empieza a descifrar o generar!</p>
      )}
      {showModal && (
        <Modal
          message="¿Estás seguro de que quieres borrar esta entrada? Esta acción no se puede deshacer."
          onConfirm={confirmDelete}
          onCancel={() => setShowModal(false)}
        />
      )}
      {showErrorModal && <Modal message={errorMessage} onClose={() => setShowErrorModal(false)} />}
    </div>
  );
};

// Componente para la ventana modal
const Modal = ({ message, onConfirm, onCancel, onClose }) => {
  if (onConfirm) {
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
  } else {
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg p-6 shadow-xl max-w-sm w-full">
          <p className="text-center text-gray-800 mb-4">{message}</p>
          <div className="flex justify-center">
            <button onClick={onClose} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
              OK
            </button>
          </div>
        </div>
      </div>
    );
  }
};


export default function App() {
  const [currentView, setCurrentView] = useState('solve');
  const [userId, setUserId] = useState(null);
  const [historyKey, setHistoryKey] = useState(0);

  // Inicializar userId con un UUID o usar uno existente del localStorage
  useEffect(() => {
    let storedUserId = localStorage.getItem('app_user_id');
    if (!storedUserId) {
      storedUserId = `user-${crypto.randomUUID()}`;
      localStorage.setItem('app_user_id', storedUserId);
    }
    setUserId(storedUserId);
  }, []);

  const handleApiCall = async (endpoint, payload, method = 'POST') => {
    try {
      const headers = { 'Content-Type': 'application/json' };
      const config = {
        method,
        headers,
        body: payload ? JSON.stringify(payload) : null,
      };

      const response = await fetch(endpoint, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Error en la solicitud a ${endpoint}`);
      }

      onNewInteraction(); // Dispara la actualización del historial
      return data;
    } catch (error) {
      console.error(error);
      return { error: error.message };
    }
  };
  
  const onNewInteraction = () => {
    setHistoryKey(prevKey => prevKey + 1);
  };

  const navItemClass = (view) => 
    `py-2 px-4 rounded-lg font-medium transition-colors ${
      currentView === view 
        ? 'bg-blue-500 text-white shadow-md' 
        : 'text-gray-600 hover:bg-gray-100'
    }`;
  
  const renderContent = () => {
    switch (currentView) {
      case 'solve':
        return <SolveCryptogramForm handleApiCall={handleApiCall} userId={userId} />;
      case 'author':
        return <FindAuthorForm handleApiCall={handleApiCall} userId={userId} />;
      case 'generate':
        return <GenerateCryptogramForm handleApiCall={handleApiCall} userId={userId} />;
      case 'history':
        return <History handleApiCall={handleApiCall} userId={userId} onEntryDeleted={onNewInteraction} key={historyKey} />;
      default:
        return <div>Vista no encontrada.</div>;
    }
  };

  if (!userId) {
    return <div className="flex items-center justify-center min-h-screen bg-gray-100">Cargando...</div>;
  }

  return (
    <div className="flex flex-col items-center p-4 sm:p-8 bg-gray-100 min-h-screen">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap');
        body { font-family: 'Inter', sans-serif; background-color: #f3f4f6; }
      `}</style>
      <script src="https://cdn.tailwindcss.com"></script>
      
      <header className="mb-8 text-center">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-2">Criptogramas & Autores</h1>
        <p className="text-lg text-gray-600">Herramienta impulsada por IA para descifrar, encontrar y crear textos.</p>
        <p className="text-xs text-gray-400 mt-2">
          ID de Usuario: <span className="font-mono text-gray-600">{userId}</span>
        </p>
      </header>

      <nav className="flex space-x-2 bg-white p-2 rounded-xl shadow-md mb-8">
        <button onClick={() => setCurrentView('solve')} className={navItemClass('solve')}>
          Resolver
        </button>
        <button onClick={() => setCurrentView('author')} className={navItemClass('author')}>
          Autor
        </button>
        <button onClick={() => setCurrentView('generate')} className={navItemClass('generate')}>
          Generar
        </button>
        <button onClick={() => setCurrentView('history')} className={navItemClass('history')}>
          Historial
        </button>
      </nav>

      <main className="w-full max-w-2xl">
        {renderContent()}
      </main>
    </div>
  );
}