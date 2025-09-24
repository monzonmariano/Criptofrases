// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BACKGROUND_IMAGES } from './config';
import { solveCryptogram, generateCryptogram, generateCryptogramFromUser, findAuthorOfPhrase, getUserHistory } from './services/apiClient';

// --- NUEVOS COMPONENTES ---
import LogicGamesView from './views/LogicGamesView';
import CryptoSuiteView from './views/CryptoSuiteView';
// -------------------------

import HistoryView from './views/HistoryView';
import BackgroundMusic from './components/BackgroundMusic';
import Attribution from './components/Attribution';
import HistoryDetailModal from './components/HistoryDetailModal';

const ChangeImageIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" /></svg>;
const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>;


function App() {
  // --- ESTADO DE NAVEGACIÓN PRINCIPAL ---
  const [activeGame, setActiveGame] = useState('menu'); // 'menu', 'cryptogram', 'history'
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const [modalData, setModalData] = useState(null);
  // --- NUEVO ESTADO CENTRALIZADO Y ANIDADO ---
  // Actualizamos la forma (shape) del estado inicial para el generador.
  const [gameState, setGameState] = useState({
    cryptogram: {
      solver: { cryptogram: '', clues: [{ num: '', letter: '' }], solutions: [], activeIndex: 0, isLoading: false, error: '' },
      generator: {
        // Ahora está dividido en dos sub-estados, uno para cada modo.
        ia: { theme: 'filosofia', generatedData: null, isLoading: false, error: '', isAnswerVisible: false },
        custom: { text: '', generatedData: null, isLoading: false, error: '' }
      },
      authorFinder: { phrase: '', author: '', isLoading: false, error: '' },
    },
    history: {
      items: [], isLoading: true, error: ''
    }
  });

  // --- LÓGICA DE NEGOCIO (HANDLERS) ---
  // Las funciones ahora usan setGameState para actualizar la parte correcta del estado.

  const handleSolveSubmit = async () => {
    const { cryptogram, clues } = gameState.cryptogram.solver;
    const cluesObject = clues.reduce((acc, clue) => {
      if (clue.num && clue.letter) { acc[clue.num] = clue.letter.toLowerCase(); }
      return acc;
    }, {});

    setGameState(prev => ({ ...prev, cryptogram: { ...prev.cryptogram, solver: { ...prev.cryptogram.solver, isLoading: true, error: '', solutions: [] }}}));
    try {
      const response = await solveCryptogram(cryptogram, cluesObject);
      setGameState(prev => ({ ...prev, cryptogram: { ...prev.cryptogram, solver: { ...prev.cryptogram.solver, solutions: response.data.solutions || [] }}}));
      fetchHistory(); // Vuelve a cargar el historial después de un éxito.
    } catch (err) {
      setGameState(prev => ({ ...prev, cryptogram: { ...prev.cryptogram, solver: { ...prev.cryptogram.solver, error: err.response?.data?.error || 'Ocurrió un error.' }}}));
    } finally {
      setGameState(prev => ({ ...prev, cryptogram: { ...prev.cryptogram, solver: { ...prev.cryptogram.solver, isLoading: false }}}));
    }
  };

  const handleGenerateByTheme = async () => {
    const { theme } = gameState.cryptogram.generator.ia;
    // La ruta correcta es 'prev.cryptogram.generator'
    setGameState(prev => ({ ...prev, cryptogram: { ...prev.cryptogram, generator: { ...prev.cryptogram.generator, ia: { ...prev.cryptogram.generator.ia, isLoading: true, error: '', generatedData: null } } } }));
    try {
      const response = await generateCryptogram(theme);
      setGameState(prev => ({ ...prev, cryptogram: { ...prev.cryptogram, generator: { ...prev.cryptogram.generator, ia: { ...prev.cryptogram.generator.ia, generatedData: response.data } } } }));
    } catch (err) {
      setGameState(prev => ({ ...prev, cryptogram: { ...prev.cryptogram, generator: { ...prev.cryptogram.generator, ia: { ...prev.cryptogram.generator.ia, error: err.response?.data?.error || 'Ocurrió un error.' } } } }));
    } finally {
      setGameState(prev => ({ ...prev, cryptogram: { ...prev.cryptogram, generator: { ...prev.cryptogram.generator, ia: { ...prev.cryptogram.generator.ia, isLoading: false } } } }));
    }
  };


  const handleGenerateCustom = async () => {
    const { text } = gameState.cryptogram.generator.custom;
    if (!text.trim()) {
      setGameState(prev => ({ ...prev, cryptogram: { ...prev.cryptogram, generator: { ...prev.cryptogram.generator, custom: { ...prev.cryptogram.generator.custom, error: 'El texto no puede estar vacío.' } } } }));
      return;
    }
    // La ruta correcta es 'prev.cryptogram.generator'
    setGameState(prev => ({ ...prev, cryptogram: { ...prev.cryptogram, generator: { ...prev.cryptogram.generator, custom: { ...prev.cryptogram.generator.custom, isLoading: true, error: '', generatedData: null } } } }));
    try {
      const response = await generateCryptogramFromUser(text);
      setGameState(prev => ({ ...prev, cryptogram: { ...prev.cryptogram, generator: { ...prev.cryptogram.generator, custom: { ...prev.cryptogram.generator.custom, generatedData: response.data } } } }));
      fetchHistory();
    } catch (err) {
      setGameState(prev => ({ ...prev, cryptogram: { ...prev.cryptogram, generator: { ...prev.cryptogram.generator, custom: { ...prev.cryptogram.generator.custom, error: err.response?.data?.error || 'Ocurrió un error.' } } } }));
    } finally {
      setGameState(prev => ({ ...prev, cryptogram: { ...prev.cryptogram, generator: { ...prev.cryptogram.generator, custom: { ...prev.cryptogram.generator.custom, isLoading: false } } } }));
    }
  };
  const handleAuthorSubmit = async () => {
    const { phrase } = gameState.cryptogram.authorFinder;
    setGameState(prev => ({ ...prev, cryptogram: { ...prev.cryptogram, authorFinder: { ...prev.cryptogram.authorFinder, isLoading: true, error: '', author: '' }}}));
    try {
      const response = await findAuthorOfPhrase(phrase);
      setGameState(prev => ({ ...prev, cryptogram: { ...prev.cryptogram, authorFinder: { ...prev.cryptogram.authorFinder, author: response.data.author }}}));
    } catch (err) {
      setGameState(prev => ({ ...prev, cryptogram: { ...prev.cryptogram, authorFinder: { ...prev.cryptogram.authorFinder, error: err.response?.data?.error || 'Ocurrió un error.' }}}));
    } finally {
      setGameState(prev => ({ ...prev, cryptogram: { ...prev.cryptogram, authorFinder: { ...prev.cryptogram.authorFinder, isLoading: false }}}));
    }
  };

  const fetchHistory = async () => {
    setGameState(prev => ({ ...prev, history: { ...prev.history, isLoading: true, error: '' }}));
    try {
      const response = await getUserHistory();
      setGameState(prev => ({ ...prev, history: { items: response.data.history || [], isLoading: false, error: '' }}));
    } catch (err) {
      setGameState(prev => ({ ...prev, history: { items: [], isLoading: false, error: 'No se pudo cargar el historial.' }}));
    }
  };

  // --- EFECTOS (SIN CAMBIOS GRANDES) ---
  useEffect(() => {
    if (activeGame === 'history') { fetchHistory(); }
  }, [activeGame]);

  useEffect(() => {
    if (BACKGROUND_IMAGES.length > 0) {
      setCurrentBgIndex(Math.floor(Math.random() * BACKGROUND_IMAGES.length));
    }
    const timer = setTimeout(() => setIsLoaded(true), 100);
    const interval = setInterval(() => handleNextImage(), 15000);
    return () => { clearTimeout(timer); clearInterval(interval); };
  }, []);
  
  const handleNextImage = () => {
    if (BACKGROUND_IMAGES.length > 1) {
      setCurrentBgIndex((prevIndex) => (prevIndex + 1) % BACKGROUND_IMAGES.length);
    }
  };

  // --- RENDERIZADO CONDICIONAL ---
  const renderActiveView = () => {
    switch(activeGame) {
      case 'menu': return <LogicGamesView onSelectGame={setActiveGame} />;
      case 'cryptogram':
        return <CryptoSuiteView 
                 gameState={gameState.cryptogram}
                 setGameState={(newState) => setGameState(prev => ({...prev, cryptogram: newState}))}
                 handlers={{
                   onSolve: handleSolveSubmit,
                   onGenerateByTheme: handleGenerateByTheme,
                   onGenerateCustom: handleGenerateCustom, // Pasamos el nuevo handler
                   onFindAuthor: handleAuthorSubmit
                 }}
               />;
      case 'history':
        return <HistoryView 
                 state={{...gameState.history, history: gameState.history.items}}
                 fetchHistory={fetchHistory}
                 // La clave es pasar onShowDetails como prop
                 onShowDetails={(entry) => setModalData(entry.details)}
               />;
      default: return <LogicGamesView onSelectGame={setActiveGame} />;
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 bg-cover bg-center bg-fixed">
      {BACKGROUND_IMAGES.length > 0 && (
        <div className="fixed inset-0 bg-cover bg-center transition-opacity duration-1000" style={{ backgroundImage: `url(${BACKGROUND_IMAGES[currentBgIndex].src})` }} />
      )}
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 max-w-7xl mx-auto p-4 sm:p-8">
        {/* --- NAVEGACIÓN PRINCIPAL SIMPLIFICADA --- */}
        <header className={`flex justify-between items-center mb-8 transition-all duration-700 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5'}`}>
          <button 
            onClick={() => setActiveGame('menu')} 
            className="flex items-center gap-2 px-4 py-2 text-base rounded-md font-semibold transition-all duration-300 ease-out bg-white/70 backdrop-blur-sm text-gray-800 hover:bg-white"
            aria-label="Volver al menú de juegos"
          >
            <HomeIcon />
            <span className="hidden sm:inline">Juegos de Lógica</span>
          </button>
          
          <button 
            onClick={() => setActiveGame('history')}
            className={`px-4 py-2 text-base rounded-md font-semibold transition-all duration-300 ease-out ${activeGame === 'history' ? 'bg-blue-600 text-white shadow-lg' : 'bg-white/70 backdrop-blur-sm text-gray-800 hover:bg-white'}`}
          >
            Mi Historial
          </button>
        </header>

        <main>
          <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-lg p-4 sm:p-8 text-white">
            {renderActiveView()}
          </div>
        </main>

        {/* Renderiza el modal CONDICIONALMENTE al final */}
        {modalData && <HistoryDetailModal data={modalData} onClose={() => setModalData(null)} />}

        <BackgroundMusic />
        
        <div className="fixed bottom-4 right-4 flex items-center space-x-4">
            {/* 1. Pasamos el handler 'handleNextImage' al componente Attribution */}
            <Attribution 
              currentImage={BACKGROUND_IMAGES.length > 0 ? BACKGROUND_IMAGES[currentBgIndex] : null} 
              onNextImage={handleNextImage}
            />
            {/* 2. Eliminamos el botón antiguo que estaba aquí */}
        </div>
      </div>
    </div>
  );
}

export default App;