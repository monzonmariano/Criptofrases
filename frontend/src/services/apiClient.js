// src/services/apiClient.js
import axios from 'axios';
import { getUserId } from './userService'; 


const API_BASE_URL = import.meta.env.VITE_API_URL;
console.log("LA API BASE URL ES:", API_BASE_URL);

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- CRIPTOGRAMAS ---
export const solveCryptogram = (cryptogram, clues) => {
  const payload = {
    user_id: getUserId(), 
    cryptogram,
    clues,
  };
  return apiClient.post('/solve', payload);
};

export const findAuthorOfPhrase = (phrase) => {
  const payload = {
    user_id: getUserId(),
    phrase,
  };
  return apiClient.post('/author/local', payload);
};

export const generateCryptogram = (theme) => {
    const payload = {
        user_id: getUserId(), 
        theme,
    };
    return apiClient.post('/generate', payload);
};

export const generateCryptogramFromUser = (text) => {
    const payload = {
        user_id: getUserId(),
        text,
    };
    return apiClient.post('/generate/custom', payload);
};

// --- SUDOKU ---
export const generateSudoku = (difficulty) => {
  const payload = {
    difficulty: difficulty || 0.5, 
  };
  return apiClient.post('/sudoku/generate', payload);
};

export const solveSudoku = (board) => {
  const payload = {
    board: board,
  };
  return apiClient.post('/sudoku/solve', payload);
};

// --- HISTORIAL ---
export const getUserHistory = () => {
  const userId = getUserId(); 
  return apiClient.get(`/history?user_id=${userId}`);
};

export const deleteHistoryEntry = (entryId) => {
  const payload = {
    user_id: getUserId(), 
    entry_id: entryId,
  };
  return apiClient.post('/delete-entry', payload);
};

export const clearUserHistory = () => {
  const payload = {
    user_id: getUserId(),
  };
  return apiClient.post('/clear-history', payload);
};

// --- ¡NUEVAS FUNCIONES DE GUARDADO DE SUDOKU! ---
export const saveSudokuGame = (boardState) => {
  const payload = {
    user_id: getUserId(),
    game_state: boardState // Enviamos el objeto { board, originalBoard, solution }
  };
  return apiClient.post('/sudoku/save', payload);
};

export const clearSudokuGame = () => {
  const payload = {
    user_id: getUserId(),
  };
  return apiClient.post('/sudoku/clear', payload);
};

// --- ¡NUEVAS FUNCIONES DE GUARDADO DE CRIPTOGRAMA! ---
export const saveActiveCryptogram = (gameData) => {
  const payload = {
    user_id: getUserId(),
    game_data: gameData // Enviamos el objeto { theme, cryptogram, ... }
  };
  // ¡IMPORTANTE! Asegúrate de que esta ruta coincida con tu api.py
  // (Mi código de backend usaba /cryptogram/save y /cryptogram/clear)
  return apiClient.post('/cryptogram/save', payload);
};

export const clearActiveCryptogram = () => {
  const payload = {
    user_id: getUserId(),
  };
  return apiClient.post('/cryptogram/clear', payload);
};