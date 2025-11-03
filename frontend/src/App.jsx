import { useState, useEffect } from 'react';
// ¡Asegúrate de que estas importaciones son correctas!
import { 
  solveCryptogram, generateCryptogram, generateCryptogramFromUser, 
  findAuthorOfPhrase, getUserHistory, deleteHistoryEntry, clearUserHistory,
  generateSudoku, solveSudoku 
} from './services/apiClient';
import { getUserId } from './services/userService'; 

import Header from './components/Header';
import Footer from './components/Footer';
import MusicPlayer from './components/MusicPlayer';
import BackgroundSlider from './components/BackgroundSlider';
import LogicGamesView from './views/LogicGamesView';
import CryptoSuiteView from './views/CryptoSuiteView';
import HistoryView from './views/HistoryView';
import SudokuView from './views/SudokuView'; // <-- Importación de Sudoku
import Modal from './components/Modal';

function App() {
  const [activeGame, setActiveGame] = useState('menu');
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  // --- ESTADO CENTRALIZADO ---
  const [gameState, setGameState] = useState({
    cryptogram: {
      solver: { cryptogram: '', clues: [{ num: '', letter: '' }], solutions: [], activeIndex: 0, isLoading: false, error: '' },
      generator: {
        ia: { theme: 'filosofia', generatedData: null, isLoading: false, error: null, isAnswerVisible: false },
        custom: { text: '', generatedData: null, isLoading: false, error: null }
      },
      authorFinder: { phrase: '', author: '', isLoading: false, error: '' },
    },
    history: {
      items: [], isLoading: true, error: ''
    },
    // --- Estado de Sudoku (Cargado desde localStorage) ---
    sudoku: {
      board: JSON.parse(localStorage.getItem('sudoku_board')) || null,
      originalBoard: JSON.parse(localStorage.getItem('sudoku_originalBoard')) || null,
      solution: JSON.parse(localStorage.getItem('sudoku_solution')) || null,
      isGenerating: false,
      isSolving: false,
      error: ''
    }
  });

  // --- Handlers de Criptogramas (Tu código) ---
  const handleSolveSubmit = async () => {
    setGameState(prev => ({
      ...prev,
      cryptogram: { ...prev.cryptogram, solver: { ...prev.cryptogram.solver, isLoading: true, error: '', solutions: [] }}
    }));
    try {
      const { cryptogram, clues } = gameState.cryptogram.solver;
      const formattedClues = clues.reduce((acc, clue) => {
        if (clue.num && clue.letter) {
          acc[clue.num] = clue.letter;
        }
        return acc;
      }, {});
      
      const response = await solveCryptogram(cryptogram, formattedClues);
      
      setGameState(prev => ({
        ...prev,
        cryptogram: { ...prev.cryptogram, solver: { ...prev.cryptogram.solver, solutions: response.data.solutions, activeIndex: 0, isLoading: false }}
      }));
    } catch (err) {
      setGameState(prev => ({
        ...prev,
        cryptogram: { ...prev.cryptogram, solver: { ...prev.cryptogram.solver, isLoading: false, error: 'No se pudo encontrar una solución.' }}
      }));
    }
  };

  const handleGenerateByTheme = async () => {
    setGameState(prev => ({
      ...prev,
      cryptogram: { ...prev.cryptogram, generator: { ...prev.cryptogram.generator, ia: { ...prev.cryptogram.generator.ia, isLoading: true, error: null }}}
    }));
    try {
      const response = await generateCryptogram(gameState.cryptogram.generator.ia.theme);
      setGameState(prev => ({
        ...prev,
        cryptogram: { ...prev.cryptogram, generator: { ...prev.cryptogram.generator, ia: { ...prev.cryptogram.generator.ia, generatedData: response.data, isLoading: false }}}
      }));
    } catch (err) {
      setGameState(prev => ({
        ...prev,
        cryptogram: { ...prev.cryptogram, generator: { ...prev.cryptogram.generator, ia: { ...prev.cryptogram.generator.ia, isLoading: false, error: 'No se pudo generar el criptograma.' }}}
      }));
    }
  };

  const handleGenerateCustom = async () => {
    setGameState(prev => ({
      ...prev,
      cryptogram: { ...prev.cryptogram, generator: { ...prev.cryptogram.generator, custom: { ...prev.cryptogram.generator.custom, isLoading: true, error: null }}}
    }));
    try {
      const response = await generateCryptogramFromUser(gameState.cryptogram.generator.custom.text);
      setGameState(prev => ({
        ...prev,
        cryptogram: { ...prev.cryptogram, generator: { ...prev.cryptogram.generator, custom: { ...prev.cryptogram.generator.custom, generatedData: response.data, isLoading: false }}}
      }));
    } catch (err) {
      setGameState(prev => ({
        ...prev,
        cryptogram: { ...prev.cryptogram, generator: { ...prev.cryptogram.generator, custom: { ...prev.cryptogram.generator.custom, isLoading: false, error: 'No se pudo crear el criptograma.' }}}
      }));
    }
  };

  const handleFindAuthor = async () => {
    setGameState(prev => ({
      ...prev,
      cryptogram: { ...prev.cryptogram, authorFinder: { ...prev.cryptogram.authorFinder, isLoading: true, error: '' }}
    }));
    try {
      const response = await findAuthorOfPhrase(gameState.cryptogram.authorFinder.phrase);
      setGameState(prev => ({
        ...prev,
        cryptogram: { ...prev.cryptogram, authorFinder: { ...prev.cryptogram.authorFinder, author: response.data.author, isLoading: false }}
      }));
    } catch (err) {
      setGameState(prev => ({
        ...prev,
        cryptogram: { ...prev.cryptogram, authorFinder: { ...prev.cryptogram.authorFinder, isLoading: false, error: 'No se pudo encontrar el autor.' }}
      }));
    }
  };


  // --- Handlers de Historial (Tu código) ---
  const loadHistory = async () => {
    setIsHistoryModalOpen(true);
    setGameState(prev => ({ ...prev, history: { ...prev.history, isLoading: true, error: '' }}));
    try {
      const response = await getUserHistory(getUserId());
      setGameState(prev => ({ ...prev, history: { ...prev.history, items: response.data.history, isLoading: false }}));
    } catch (err) {
      setGameState(prev => ({ ...prev, history: { ...prev.history, isLoading: false, error: 'No se pudo cargar el historial.' }}));
    }
  };

  const handleDeleteEntry = async (entryId) => {
    try {
      await deleteHistoryEntry(entryId);
      loadHistory(); // Recarga el historial
    } catch (err) {
      setGameState(prev => ({ ...prev, history: { ...prev.history, error: 'No se pudo borrar la entrada.' }}));
    }
  };

  const handleClearHistory = async () => {
    try {
      await clearUserHistory();
      loadHistory(); // Recarga el historial (ahora vacío)
    } catch (err) {
      setGameState(prev => ({ ...prev, history: { ...prev.history, error: 'No se pudo borrar el historial.' }}));
    }
  };


  // --- Handlers de Sudoku (Completos y Corregidos) ---
  
  const handleGenerateSudoku = async (difficulty) => {
    setGameState(prev => ({ ...prev, sudoku: { ...prev.sudoku, isGenerating: true, error: '' }}));
    try {
      const response = await generateSudoku(difficulty);
      const newBoard = response.data.board;
      const newSolution = response.data.solution; 

      localStorage.setItem('sudoku_board', JSON.stringify(newBoard));
      localStorage.setItem('sudoku_originalBoard', JSON.stringify(newBoard));
      localStorage.setItem('sudoku_solution', JSON.stringify(newSolution));

      setGameState(prev => ({ 
        ...prev, 
        sudoku: { 
          ...prev.sudoku, 
          board: newBoard, 
          originalBoard: newBoard, 
          solution: newSolution,
          isGenerating: false
        }
      }));
    } catch (err) {
      console.error("Error al procesar el sudoku:", err); 
      const errorMsg = err.response?.data?.error || 'No se pudo generar el puzzle.';
      setGameState(prev => ({ ...prev, sudoku: { ...prev.sudoku, isGenerating: false, error: errorMsg }}));
    }
  };

  const handleSolveSudoku = async () => {
    const { originalBoard } = gameState.sudoku;
    if (!originalBoard) return;

    setGameState(prev => ({ ...prev, sudoku: { ...prev.sudoku, isSolving: true, error: '' }}));
    try {
      const response = await solveSudoku(originalBoard); 
      
      localStorage.removeItem('sudoku_board');
      localStorage.removeItem('sudoku_originalBoard');
      localStorage.removeItem('sudoku_solution');

      setGameState(prev => ({ 
        ...prev, 
        sudoku: { 
          ...prev.sudoku, 
          board: response.data.solved_board, 
          originalBoard: null,
          solution: null,
          isSolving: false
        }
      }));
    } catch (err) {
      console.error("Error al procesar el sudoku:", err);
      const errorMsg = err.response?.data?.error || 'Este puzzle no tiene solución.';
      setGameState(prev => ({ ...prev, sudoku: { ...prev.sudoku, isSolving: false, error: errorMsg }}));
    }
  };
  
  // --- ARREGLO DEL BUG DE onCellChange ---
  const handleSudokuCellChange = (r, c, value) => {
    
    // --- CLÁUSULA DE GUARDA (FIX 1) ---
    // Si el tablero no existe, no hagas nada.
    if (!gameState.sudoku.board) {
      console.error("onCellChange llamado sin tablero (board)");
      return;
    }

    const num = value === '' ? 0 : parseInt(value);
    if (isNaN(num) || num < 0 || num > 9) return;

    const newBoard = JSON.parse(JSON.stringify(gameState.sudoku.board));
    
    // Esta línea ahora es segura gracias a la cláusula de guarda
    newBoard[r][c] = num;

    localStorage.setItem('sudoku_board', JSON.stringify(newBoard));

    setGameState(prev => ({
      ...prev,
      sudoku: { ...prev.sudoku, board: newBoard }
    }));
  };

  const handleSudokuHint = () => {
    const { board, solution } = gameState.sudoku;
    if (!board || !solution) return;

    let found = false;
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (board[r][c] === 0) {
          const hintValue = solution[r][c];
          const newBoard = JSON.parse(JSON.stringify(board));
          newBoard[r][c] = hintValue;

          localStorage.setItem('sudoku_board', JSON.stringify(newBoard));
          setGameState(prev => ({
            ...prev,
            sudoku: { ...prev.sudoku, board: newBoard }
          }));
          
          found = true;
          break;
        }
      }
      if (found) break;
    }
  };


  // --- Renderizado y Navegación ---
  const renderActiveView = () => {
    switch(activeGame) {
      case 'menu': return <LogicGamesView onSelectGame={setActiveGame} />;
      case 'cryptogram':
        return <CryptoSuiteView 
                 gameState={gameState.cryptogram}
                 setGameState={(updater) => setGameState(prev => ({ ...prev, cryptogram: updater(prev.cryptogram) }))}
                 handlers={{
                   onSolve: handleSolveSubmit,
                   onGenerateByTheme: handleGenerateByTheme,
                   onGenerateCustom: handleGenerateCustom,
                   onFindAuthor: handleFindAuthor
                 }}
               />;
      case 'sudoku':
      return <SudokuView
               gameState={gameState.sudoku}
               handlers={{
                 onGenerate: handleGenerateSudoku,
                 onSolve: handleSolveSudoku,
                 onCellChange: handleSudokuCellChange,
                 onHint: handleSudokuHint
               }}
             />;
      case 'history':
        return <HistoryView 
                 historyState={gameState.history} 
                 onDelete={handleDeleteEntry} 
                 onClear={handleClearHistory} 
               />;
      default: return <LogicGamesView onSelectGame={setActiveGame} />;
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-slate-900 text-gray-200 font-sans overflow-hidden z-10">
      <BackgroundSlider />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header onHistoryClick={loadHistory} onHomeClick={() => setActiveGame('menu')} />
        
        <main className="flex-grow container mx-auto px-4 py-8">
          {renderActiveView()}
        </main>
        
        <Footer />
        <MusicPlayer />
      </div>

      <Modal isOpen={isHistoryModalOpen} onClose={() => setIsHistoryModalOpen(false)}>
        {renderActiveView()}
      </Modal>
    </div>
  );
}

export default App;