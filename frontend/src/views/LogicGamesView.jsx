// src/views/LogicGamesView.jsx
import React from 'react';

// Un componente reutilizable para cada tarjeta de juego
const GameCard = ({ title, description, gameId, onSelectGame }) => (
  <div 
    className="bg-slate-800/50 p-6 rounded-lg shadow-lg hover:bg-slate-700/70 hover:shadow-blue-500/20 transition-all duration-300 cursor-pointer"
    onClick={() => onSelectGame(gameId)}
  >
    <h2 className="text-2xl font-bold text-blue-400 mb-2">{title}</h2>
    <p className="text-gray-300">{description}</p>
  </div>
);

function LogicGamesView({ onSelectGame }) {
  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-200 mb-8 text-center">
        Bienvenido al Hub de Juegos de Lógica
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GameCard 
          title="Criptofrases"
          description="Resuelve, genera y descubre autores de frases encriptadas. Un desafío para tu mente deductiva."
          gameId="cryptogram"
          onSelectGame={onSelectGame}
        />
        <GameCard 
          title="Sudoku Express (Próximamente)"
          description="El clásico juego de números. Rellena la cuadrícula sin repetir dígitos. ¡Nuevos puzzles cada día!"
          gameId="sudoku" // Este ID se usará en el futuro
          onSelectGame={() => alert('¡Juego en desarrollo! Vuelve pronto.')} // Placeholder
        />
        <GameCard 
          title="¿Quién es Quién? (Próximamente)"
          description="Adivina el personaje misterioso haciendo preguntas de sí o no. Un test a tu capacidad de descarte."
          gameId="whoiswho"
          onSelectGame={() => alert('¡Juego en desarrollo! Vuelve pronto.')}
        />
        <GameCard 
          title="Pictologic (Próximamente)"
          description="Usa la lógica para revelar una imagen oculta coloreando celdas según los números en los laterales."
          gameId="pictologic"
          onSelectGame={() => alert('¡Juego en desarrollo! Vuelve pronto.')}
        />
      </div>
    </div>
  );
}

export default LogicGamesView;