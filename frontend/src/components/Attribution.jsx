// src/components/Attribution.jsx
import React from 'react';

// Un icono más claro que representa "imagen" o "galería"
const PhotoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Z" /></svg>;


// Ahora el componente recibe la función onNextImage como prop
function Attribution({ currentImage, onNextImage }) {
  if (!currentImage) return null; // No mostrar nada si no hay imagen

  return (
    // Hemos combinado la info y el botón en un solo contenedor flex
    <div className="fixed bottom-4 right-4 flex items-center gap-3 bg-black/40 backdrop-blur-sm p-2 pr-3 rounded-full shadow-lg max-w-xs text-white">
      
      {/* Botón de cambio de imagen, ahora integrado */}
      <button 
        onClick={onNextImage} 
        className="flex-shrink-0 bg-white/20 p-2 rounded-full hover:bg-white/40 transition-colors duration-300" 
        aria-label="Cambiar imagen de fondo"
      >
        <PhotoIcon />
      </button>

      {/* Información de la imagen */}
      <div className="text-xs text-left truncate">
        <p className="font-bold truncate" title={currentImage.title}>{currentImage.title}</p>
        <a href={currentImage.url} target="_blank" rel="noopener noreferrer" className="hover:underline truncate">
          por {currentImage.artist}
        </a>
      </div>
    </div>
  );
}

export default Attribution;