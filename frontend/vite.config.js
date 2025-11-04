// frontend/vite.config.js

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // --- ¡CONFIGURACIÓN DEL PROXY PARA ARREGLAR CORS! ---
    proxy: {
      '/api': {
        // Redirige todas las peticiones que empiezan por /api a tu backend Python
        target: 'http://localhost:8080', 
        changeOrigin: true, // Cambia el encabezado 'Origin' para el backend
        secure: false,      // No usamos SSL localmente
        rewrite: (path) => path.replace(/^\/api/, '/api'), // Mantiene el /api
      },
    },
    // --- FIN DEL PROXY ---
  },
});