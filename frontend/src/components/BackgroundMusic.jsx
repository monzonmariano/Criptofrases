// src/components/BackgroundMusic.jsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MUSIC_TRACKS } from '../config';

// --- Iconos (sin cambios) ---
const PlayIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" /></svg>;
const PauseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" /></svg>;
const NextIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>;
const PrevIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>;

function BackgroundMusic() {
  // --- Lógica del componente (sin cambios) ---
  const [isPlaying, setIsPlaying] = useState(false);
  const [userHasInteracted, setUserHasInteracted] = useState(false);
  const audioRef = useRef(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [volume, setVolume] = useState(0.5);

  const playNextTrack = useCallback(() => {
    if (MUSIC_TRACKS.length > 1) {
      setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % MUSIC_TRACKS.length);
    }
  }, []);

  const playPrevTrack = useCallback(() => {
    if (MUSIC_TRACKS.length > 1) {
      setCurrentTrackIndex((prevIndex) => (prevIndex - 1 + MUSIC_TRACKS.length) % MUSIC_TRACKS.length);
    }
  }, []);

  useEffect(() => {
    if (MUSIC_TRACKS.length > 0) {
      setCurrentTrackIndex(Math.floor(Math.random() * MUSIC_TRACKS.length));
    }
  }, []);
  
  useEffect(() => {
    const audio = audioRef.current;
    if (isPlaying && userHasInteracted) {
      audio.play().catch(e => console.error("Error al reproducir audio:", e));
    } else {
      audio.pause();
    }
  }, [isPlaying, currentTrackIndex, userHasInteracted]);
  
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);
  
  useEffect(() => {
    const audio = audioRef.current;
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => { if (!audio.ended) setIsPlaying(false); };
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, []);

  const handleFirstInteraction = () => {
    if (!userHasInteracted) {
      setUserHasInteracted(true);
      setIsPlaying(true);
    }
  };

  const togglePlayPause = () => {
    if (!userHasInteracted) {
      handleFirstInteraction();
    } else {
      setIsPlaying(!isPlaying);
    }
  };
  
  const handleVolumeChange = (e) => {
    setVolume(parseFloat(e.target.value));
  };

  // --- NUEVO: Obtener los datos de la pista actual ---
  // Guardamos en una variable el objeto completo de la canción que se está reproduciendo.
  const currentTrack = MUSIC_TRACKS.length > 0 ? MUSIC_TRACKS[currentTrackIndex] : null;

  return (
    <>
      <audio 
        ref={audioRef} 
        src={currentTrack ? currentTrack.src : ''} 
        onEnded={playNextTrack}
        muted={!userHasInteracted}
      />
      {!userHasInteracted && (
        <div 
          className="fixed inset-0 bg-black/70 flex flex-col items-center justify-center z-50 cursor-pointer"
          onClick={handleFirstInteraction}
        >
          <div className="text-white text-2xl font-bold animate-pulse">Haz clic para activar la experiencia de sonido</div>
          <div className="text-white/70 mt-2">(Recomendado para una mejor inmersión)</div>
        </div>
      )}
      {userHasInteracted && (
        // --- CONTENEDOR PRINCIPAL MODIFICADO ---
        // Cambiamos a `rounded-xl` para que se ajuste mejor al nuevo contenido.
        <div className="fixed bottom-4 left-4 flex items-center space-x-4 bg-black/40 backdrop-blur-sm p-3 rounded-xl shadow-lg animate-fade-in">
          
          {/* Controles de reproducción */}
          <button onClick={playPrevTrack} className="p-2 text-gray-500 hover:bg-gray-200 rounded-full transition" aria-label="Previous Track"><PrevIcon /></button>
          <button onClick={togglePlayPause} className="p-2 text-gray-500 hover:bg-gray-200 rounded-full transition" aria-label="Play/Pause">
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </button>
          <button onClick={playNextTrack} className="p-2 text-gray-700 hover:bg-gray-200 rounded-full transition" aria-label="Next Track"><NextIcon /></button>
          
          {/* Control de volumen */}
          <input type="range" min="0" max="1" step="0.01" value={volume} onChange={handleVolumeChange} className="w-24 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer" aria-label="Volume"/>

          {/* --- NUEVO: Bloque de información de la pista --- */}
          {currentTrack && (
            // 1. Contenedor "ventana": Oculta lo que se sale de su área
            <div className="hidden sm:block w-48 overflow-hidden"> 
              
              {/* 2. Contenedor "flexible" que se va a mover */}
              <div className="flex animate-marquee">

                {/* 3. El contenido se duplica para un bucle infinito y perfecto */}
                {/* Bloque 1 (visible al inicio) */}
                <div className="flex-shrink-0 w-48 pr-4">
                  <p className="text-sm font-bold text-slate-400 whitespace-nowrap" title={currentTrack.title}>
                    {currentTrack.title}
                  </p>
                  <a href={currentTrack.url} target="_blank" rel="noopener noreferrer" className="text-xs text-slate-200 hover:underline whitespace-nowrap">
                    por {currentTrack.artist}
                  </a>
                </div>
                
                {/* Bloque 2 (copia para el bucle) */}
                <div className="flex-shrink-0 w-48 pr-4">
                   <p className="text-sm font-bold text-slate-200 whitespace-nowrap" title={currentTrack.title}>
                    {currentTrack.title}
                  </p>
                  <a href={currentTrack.url} target="_blank" rel="noopener noreferrer" className="text-xs text-slate-200 hover:underline whitespace-nowrap">
                    por {currentTrack.artist}
                  </a>
                </div>

              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default BackgroundMusic;