// src/services/apiClient.js
import axios from 'axios';
import { getUserId } from './userService'; 
const API_BASE_URL = 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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
  return apiClient.post('/author', payload);
};

export const generateCryptogram = (theme) => {
    const payload = {
        user_id: getUserId(), 
        theme,
    };
    return apiClient.post('/generate', payload);
};

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

/**
 * Llama al endpoint POST /clear-history del backend.
 * @returns {Promise<object>} La respuesta de la API.
 */
export const clearUserHistory = () => {
  const payload = {
    user_id: getUserId(),
  };
  return apiClient.post('/clear-history', payload);
};
