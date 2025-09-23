// src/services/userService.js

const USER_ID_KEY = 'cryptofrases_user_id';

/**
 * Obtiene el ID de usuario único del localStorage.
 * Si no existe, crea uno nuevo, lo guarda y lo devuelve.
 * @returns {string} El ID de usuario único.
 */
export const getUserId = () => {
  let userId = localStorage.getItem(USER_ID_KEY);

  if (!userId) {
    // crypto.randomUUID() es la forma moderna y segura de generar
    // un identificador único y aleatorio en el navegador.
    userId = crypto.randomUUID();
    localStorage.setItem(USER_ID_KEY, userId);
  }

  return userId;
};