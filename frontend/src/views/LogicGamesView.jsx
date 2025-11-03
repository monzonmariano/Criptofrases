import React from 'react';

// --- Este es el componente que me pasaste ---
// El 'onClick' ya está aquí, llamando a la prop 'onSelectGame'
const GameCard = ({ title, description, gameId, onSelectGame }) => (
  <div 
    className="bg-slate-800/50 p-6 rounded-lg shadow-lg hover:bg-slate-700/70 hover:shadow-blue-500/20 transition-all duration-300 cursor-pointer"
    onClick={() => onSelectGame(gameId)}
  >
    <h2 className="text-2xl font-bold text-blue-400 mb-2">{title}</h2>
    <p className="text-gray-300">{description}</p>
  </div>
);


// --- Este es el componente principal de la vista ---
// Recibe 'onSelectGame' como prop desde App.jsx
function LogicGamesView({ onSelectGame }) {
  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center bg-yellow-400 p-2 rounded">JUEGOS (TEST v5)</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* --- 1. Tarjeta de Criptogramas --- */}
        <GameCard 
          title="Crypto Suite"
          description="Resuelve y genera criptogramas, o encuentra el autor de una frase."
          gameId="cryptogram" 
          onSelectGame={onSelectGame} 
        />

        {/* --- 2. Tarjeta de Sudoku --- */}
        <GameCard 
          title="Sudoku"
          description="Genera puzzles nuevos o usa nuestro solver de backtracking para resolverlos."
          gameId="sudoku" 
          onSelectGame={onSelectGame} 
        />
        
        {/* --- 3. (Próximamente) 'Quién es Quién' --- */}
        {/* <GameCard 
            title="¿Quién es Quién?"
            description="El clásico juego de adivinar el personaje. (Próximamente)"
            gameId="whoswho" 
            onSelectGame={onSelectGame} 
          /> 
        */}

      </div>
    </div>
  );
}

export default LogicGamesView;