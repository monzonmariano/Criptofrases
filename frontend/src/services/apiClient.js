// src/services/apiClient.js
import axios from 'axios';

// La URL base de nuestro backend.
// En desarrollo, apunta a nuestro contenedor Docker.
const API_BASE_URL = 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Llama al endpoint /solve del backend.
 * @param {string} cryptogram - El criptograma a resolver.
 * @param {object} clues - Un objeto con las pistas.
 * @returns {Promise<object>} La respuesta de la API.
 */
export const solveCryptogram = (cryptogram, clues) => {
  const payload = {
    user_id: 'frontend_user', // Podemos hacer esto dinámico más adelante
    cryptogram,
    clues,
  };
  return apiClient.post('/solve', payload);
};

/**
 * Llama al endpoint /author del backend.
 * @param {string} phrase - La frase para buscar su autor.
 * @returns {Promise<object>} La respuesta de la API.
 */
export const findAuthorOfPhrase = (phrase) => {
  const payload = {
    user_id: 'frontend_user',
    phrase,
  };
  return apiClient.post('/author', payload);
};

/**
 * Llama al endpoint GET /history del backend.
 * @param {string} userId - El ID del usuario.
 * @returns {Promise<object>} La respuesta de la API con el historial.
 */
export const getUserHistory = (userId) => {
  // Para peticiones GET, los parámetros se pasan en la URL
  return apiClient.get(`/history?user_id=${userId}`);
};

/**
 * Llama al endpoint POST /delete-entry del backend.
 * @param {number} entryId - El ID de la entrada a borrar.
 * @param {string} userId - El ID del usuario propietario.
 * @returns {Promise<object>} La respuesta de la API.
 */
export const deleteHistoryEntry = (entryId, userId) => {
  const payload = {
    user_id: userId,
    entry_id: entryId,
  };
  return apiClient.post('/delete-entry', payload);
};

/**
 * Llama al endpoint POST /generate del backend.
 * @param {string} theme - El tema para la frase a generar.
 * @returns {Promise<object>} La respuesta de la API con el nuevo criptograma.
 */
export const generateCryptogram = (theme) => {
  const payload = {
    user_id: 'frontend_user',
    theme,
  };
  return apiClient.post('/generate', payload);
};

// Aquí añadiremos las llamadas para los otros servicios en el futuro.