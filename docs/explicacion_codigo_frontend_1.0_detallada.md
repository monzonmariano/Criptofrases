1. El Cerebro de la Aplicación: src/App.jsx

Este archivo es el componente más importante. Controla qué se ve en la pantalla y gestiona todos los datos.
JavaScript

// src/App.jsx

// Importamos React y sus "Hooks" (useState, useEffect), que son herramientas
// para darle memoria y ciclo de vida a nuestros componentes.
import React, { useState, useEffect } from 'react';

// Importamos configuraciones y componentes que hemos creado.
import { BACKGROUND_IMAGES } from './config';
import { solveCryptogram, generateCryptogram, findAuthorOfPhrase, getUserHistory } from './services/apiClient';
import LogicGamesView from './views/LogicGamesView';
import CryptoSuiteView from './views/CryptoSuiteView';
import HistoryView from './views/HistoryView';
import BackgroundMusic from './components/BackgroundMusic';
import Attribution from './components/Attribution';

// Pequeños componentes para los iconos. Son funciones que devuelven SVG (gráficos vectoriales).
const ChangeImageIcon = () => (/* ... código SVG ... */);
const HomeIcon = () => (/* ... código SVG ... */);

// --- INICIA EL COMPONENTE PRINCIPAL 'App' ---
function App() {
  // --- "useState": La Memoria del Componente ---
  // `useState` nos da una variable y una función para actualizarla. React volverá a dibujar
  // la pantalla cada vez que esta variable cambie.

  // 'activeGame' guarda qué vista principal estamos mostrando ('menu', 'cryptogram', etc.)
  const [activeGame, setActiveGame] = useState('menu');
  // 'isLoaded' es para una pequeña animación de entrada.
  const [isLoaded, setIsLoaded] = useState(false);
  // 'currentBgIndex' controla qué imagen de fondo se muestra.
  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  // 'gameState' es un GRAN objeto que contiene TODA la información de los juegos.
  // Tener todo en un solo lugar lo hace muy organizado.
  const [gameState, setGameState] = useState({
    cryptogram: { // Datos específicos del juego de criptogramas
      solver: { cryptogram: '', clues: [{ num: '', letter: '' }], solutions: [], activeIndex: 0, isLoading: false, error: '' },
      generator: { theme: 'filosofia', generatedData: null, isAnswerVisible: false, isLoading: false, error: '' },
      authorFinder: { phrase: '', author: '', isLoading: false, error: '' },
    },
    history: { // Datos para la vista de historial
      items: [], isLoading: true, error: ''
    }
  });

  // --- LÓGICA DE NEGOCIO (Funciones que "hacen cosas") ---
  // Estas funciones se comunican con el backend a través del apiClient.
  // Son 'async' porque tienen que "esperar" la respuesta del servidor.

  const handleSolveSubmit = async () => {
    // 1. Pone el estado en 'cargando'.
    setGameState(prev => ({ ...prev, cryptogram: { ...prev.cryptogram, solver: { ...prev.cryptogram.solver, isLoading: true, error: '', solutions: [] }}}));
    try {
      // 2. Llama al 'mensajero' (apiClient) para que pida la solución al backend.
      const response = await solveCryptogram(gameState.cryptogram.solver.cryptogram, /*... clues ...*/);
      // 3. Si todo va bien, guarda la solución en el estado.
      setGameState(prev => ({ ...prev, cryptogram: { ...prev.cryptogram, solver: { ...prev.cryptogram.solver, solutions: response.data.solutions || [] }}}));
    } catch (err) {
      // 4. Si hay un error, lo guarda en el estado para mostrar un mensaje.
      setGameState(prev => ({ ...prev, cryptogram: { ...prev.cryptogram, solver: { ...prev.cryptogram.solver, error: err.response?.data?.error || 'Ocurrió un error.' }}}));
    } finally {
      // 5. Quita el estado de 'cargando', sin importar si hubo éxito o error.
      setGameState(prev => ({ ...prev, cryptogram: { ...prev.cryptogram, solver: { ...prev.cryptogram.solver, isLoading: false }}}));
    }
  };
  // (Las funciones handleGenerateSubmit, handleAuthorSubmit, y fetchHistory siguen el mismo patrón)

  // --- "useEffect": Acciones en el Ciclo de Vida ---
  // El código dentro de un `useEffect` se ejecuta "después" de que el componente se dibuja.
  // Es perfecto para tareas como pedir datos a una API.

  // Este useEffect se ejecuta CADA VEZ que la variable 'activeGame' cambia.
  useEffect(() => {
    if (activeGame === 'history') {
      fetchHistory(); // Si el usuario va a la vista de historial, cargamos los datos.
    }
  }, [activeGame]); // El `[activeGame]` le dice a React: "solo re-ejecuta esto si 'activeGame' cambia".

  // Este useEffect se ejecuta UNA SOLA VEZ, cuando el componente aparece por primera vez.
  // (Porque su array de dependencias `[]` está vacío).
  useEffect(() => {
    // Lógica para la animación de entrada y el carrusel de imágenes de fondo.
    const timer = setTimeout(() => setIsLoaded(true), 100);
    const interval = setInterval(() => handleNextImage(), 15000); // Cambia la imagen cada 15s
    return () => { clearTimeout(timer); clearInterval(interval); }; // Limpieza al desmontar
  }, []);

  // --- JSX: Lo que se Dibuja en Pantalla ---
  // Esto parece HTML, pero es JSX. Nos permite mezclar lógica de JavaScript con la estructura de la página.

  // Esta función decide qué componente principal mostrar basado en 'activeGame'.
  const renderActiveView = () => {
    switch(activeGame) {
      case 'menu': return <LogicGamesView onSelectGame={setActiveGame} />;
      case 'cryptogram': return <CryptoSuiteView /*... pasa datos y funciones ...*/ />;
      case 'history': return <HistoryView /*... pasa datos y funciones ...*/ />;
      default: return <LogicGamesView onSelectGame={setActiveGame} />;
    }
  };

  return (
    // --- Estilos con Tailwind CSS ---
    // `className` es como el atributo `class` de HTML.
    // Las clases como 'min-h-screen', 'w-full', 'bg-gradient-to-br' son "clases de utilidad" de Tailwind.
    // Cada una hace una sola cosa:
    // - `min-h-screen`: Altura mínima = 100% de la altura de la pantalla.
    // - `w-full`: Ancho = 100%.
    // - `bg-gradient-to-br`: Fondo con un gradiente hacia abajo a la derecha.
    // - `from-slate-900`: Color de inicio del gradiente.
    // - `fixed`: Posición fija en la pantalla (no se mueve con el scroll).
    // - `inset-0`: Ocupa todo el espacio (top: 0, right: 0, bottom: 0, left: 0).
    // - `bg-black/60`: Fondo negro con 60% de opacidad.
    // - `relative`, `z-10`: Para controlar el apilamiento de capas (el contenido va por encima del fondo).
    <div className="min-h-screen w-full ...">
      {/* Fondo con imagen */}
      <div className="fixed inset-0 ..." style={{ backgroundImage: `url(...)` }} />
      {/* Capa oscura semitransparente sobre la imagen */}
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 ...">
        {/* Encabezado con los botones de navegación principales */}
        <header className="...">
          <button onClick={() => setActiveGame('menu')} ...>
            <HomeIcon />
            <span>Juegos de Lógica</span>
          </button>
          {/* ... más botones */}
        </header>

        <main>
          {/* El contenedor principal con efecto de "vidrio esmerilado" */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl ...">
            {/* Aquí llamamos a la función que decide qué vista mostrar */}
            {renderActiveView()}
          </div>
        </main>
        
        {/* Componentes de la UI que siempre son visibles */}
        <BackgroundMusic />
        <Attribution ... />
      </div>
    </div>
  );
}

export default App;

2. El Mensajero: src/services/apiClient.js

Este archivo centraliza toda la comunicación con el backend. Usa la librería Axios para hacer las peticiones HTTP más fáciles.
JavaScript

// src/services/apiClient.js
import axios from 'axios';
import { getUserId } from './userService'; // Importa la función que obtiene el ID del usuario

// La URL base de nuestro backend. En producción, esto debería ser la URL del servidor real.
const API_BASE_URL = 'http://localhost:8080/api';

// Creamos una "instancia" de Axios con configuración predeterminada.
// Así no tenemos que repetir la URL base y las cabeceras en cada llamada.
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- Definimos una función por cada "Endpoint" de la API ---
// Cada función prepara los datos (el 'payload') y llama al método correspondiente
// de Axios (post, get, etc.).

export const solveCryptogram = (cryptogram, clues) => {
  const payload = {
    user_id: getUserId(), // Obtenemos el ID único del usuario para el historial
    cryptogram,
    clues,
  };
  // Hace una petición POST a 'http://localhost:8080/api/solve'
  return apiClient.post('/solve', payload);
};

// (Las otras funciones como findAuthorOfPhrase, generateCryptogram, etc.,
// siguen exactamente el mismo patrón).

3. La Identidad del Usuario: src/services/userService.js

Un servicio muy simple para darle a cada visitante un ID único y anónimo, para que el backend pueda guardar su historial personal.
JavaScript

// src/services/userService.js

// El nombre de la clave que usaremos para guardar el ID en el navegador.
const USER_ID_KEY = 'cryptofrases_user_id';

/**
 * Obtiene el ID de usuario del localStorage del navegador.
 * localStorage es una pequeña "base de datos" que persiste aunque se cierre la pestaña.
 * Si no existe un ID, crea uno nuevo, lo guarda y lo devuelve.
 */
export const getUserId = () => {
  // 1. Intenta leer el ID guardado.
  let userId = localStorage.getItem(USER_ID_KEY);

  // 2. Si no hay nada (`userId` es null)...
  if (!userId) {
    // 3. ...crea un nuevo ID universalmente único y seguro.
    userId = crypto.randomUUID();
    // 4. Y lo guarda en el localStorage para la próxima vez.
    localStorage.setItem(USER_ID_KEY, userId);
  }

  // 5. Devuelve el ID, ya sea el que encontró o el que acaba de crear.
  return userId;
};

4. La Sala de Juegos: src/views/LogicGamesView.jsx

Este es el menú principal. Su única responsabilidad es mostrar los juegos disponibles y decirle a App.jsx cuál ha seleccionado el usuario.
JavaScript

// src/views/LogicGamesView.jsx
import React from 'react';

// Creamos un sub-componente reutilizable para las tarjetas de los juegos.
// Recibe sus datos a través de "props" (title, description, etc.).
const GameCard = ({ title, description, gameId, onSelectGame }) => (
  // Al hacer clic, llama a la función `onSelectGame` que recibió de su padre,
  // pasándole el ID del juego seleccionado.
  <div 
    className="bg-slate-800/50 p-6 rounded-lg ... cursor-pointer"
    onClick={() => onSelectGame(gameId)}
  >
    <h2 className="text-2xl font-bold text-blue-400 mb-2">{title}</h2>
    <p className="text-gray-300">{description}</p>
  </div>
);

function LogicGamesView({ onSelectGame }) {
  return (
    <div>
      <h1 className="text-4xl ...">
        Bienvenido al Hub de Juegos de Lógica
      </h1>
      {/* `grid` y `grid-cols-1` de Tailwind crean un layout de rejilla.
          `md:grid-cols-2` significa: "en pantallas medianas ('md') o más grandes,
          usa 2 columnas". Esto es la base del diseño responsivo. */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GameCard 
          title="Criptofrases"
          description="..."
          gameId="cryptogram"
          onSelectGame={onSelectGame} // Pasa la función directamente a la tarjeta
        />
        <GameCard 
          title="Sudoku Express (Próximamente)"
          description="..."
          gameId="sudoku"
          onSelectGame={() => alert('¡Juego en desarrollo!')}
        />
        {/* ... más juegos */}
      </div>
    </div>
  );
}

export default LogicGamesView;

5. El Contenedor de Criptogramas: src/views/CryptoSuiteView.jsx

Este componente actúa como un "gerente" para todo lo relacionado con criptogramas. Muestra las pestañas (Solver, Generador, Buscador) y renderiza la vista correcta.
JavaScript

// src/views/CryptoSuiteView.jsx
import React, { useState } from 'react';

// Importa las tres vistas que va a gestionar.
import CryptoSolverView from './CryptoSolverView';
import GeneratorView from './GeneratorView';
import AuthorFinderView from './AuthorFinderView';

// Recibe el estado de los criptogramas (`gameState`), la función para actualizarlo
// (`setGameState`) y los `handlers` (las funciones que llaman a la API) desde App.jsx.
function CryptoSuiteView({ gameState, setGameState, handlers }) {
  // Tiene su PROPIO `useState` para algo que solo le importa a él:
  // qué pestaña interna está activa.
  const [activeTab, setActiveTab] = useState('solver');

  // ... (código del SubNavBar) ...

  // --- Lógica para pasar los datos correctamente al hijo ---
  // Estas funciones se aseguran de que cuando una vista hija (como GeneratorView)
  // quiera actualizar su estado, se actualice la parte correcta del gran objeto
  // `gameState` en App.jsx.
  const setSolverState = (updater) => {
    const newSolverState = typeof updater === 'function' ? updater(gameState.solver) : updater;
    setGameState({ ...gameState, solver: newSolverState });
  };
  // (setGeneratorState y setAuthorFinderState son idénticas en su lógica)

  // Decide qué componente-vista renderizar basado en `activeTab`.
  const renderActiveTab = () => {
    switch(activeTab) {
      case 'solver':
        return <CryptoSolverView 
                 state={gameState.solver} // Le pasa solo la porción de estado que necesita
                 setState={setSolverState} // Le pasa la función específica para actualizarse
                 onSubmit={handlers.onSolve} // Le pasa la función para enviar el formulario
               />;
      // (Los otros casos hacen lo mismo para Generator y AuthorFinder)
    }
  };

  return (
    <div>
      <SubNavBar />
      {renderActiveTab()}
    </div>
  );
}

export default CryptoSuiteView;


 los demas archivos como CryptoSolverView.jsx, GeneratorView.jsx, etc. tienen la logica como estos views que explicamos 

 eciben state, setState y onSubmit y los usan para controlar los campos del formulario y los botones