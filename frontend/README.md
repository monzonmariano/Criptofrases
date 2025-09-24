# Criptofrases & Logic Hub - Frontend (v1.0)

¡Bienvenido al frontend de Criptofrases & Logic Hub! Esta es una aplicación web moderna construida con **React** y estilizada con **Tailwind CSS**. Está diseñada como una interfaz de usuario interactiva, atractiva y escalable para una variedad of de juegos de lógica, comunicándose con un potente backend de Python.

## Características

* **Hub de Juegos**: Una pantalla de bienvenida para seleccionar entre diferentes juegos de lógica, preparada para futuras expansiones.
* **Suite de Criptogramas Completa**:
    * **Solver**: Resuelve criptogramas complejos usando pistas.
    * **Generador Dual**: Permite generar criptogramas con IA (por temas) o crear uno personalizado a partir de tu propio texto.
* **Historial de Actividad Inteligente**:
    * Guarda un registro de los criptogramas resueltos y creados por el usuario.
    * Filtra automáticamente la actividad para mostrar solo lo relevante para el usuario.
    * **Vista de Detalles**: Un modal animado que muestra la información completa de una actividad, incluyendo todas las soluciones posibles.
* **Experiencia Inmersiva**: Música de fondo ambiental, carrusel de imágenes y una interfaz de usuario pulida con animaciones suaves.
* **Diseño Responsivo**: Se adapta perfectamente a dispositivos móviles y de escritorio.

## ¿Cómo "Piensa" la Aplicación? La Arquitectura de React

[cite_start]Esta aplicación sigue un patrón de diseño profesional y fácil de entender, basado en el flujo de datos unidireccional. [cite: 7]

1.  **El Cerebro (`App.jsx`)**: Es el componente principal que orquesta todo. [cite_start]Mantiene en su "memoria" (el estado `gameState`) toda la información importante: qué juego está activo, los datos del solver, los datos de los dos modos del generador, el historial, y si el modal de detalles está abierto. [cite: 7]
2.  **Los Gerentes (`CryptoSuiteView.jsx`)**: Son componentes que gestionan un área específica. [cite_start]`CryptoSuiteView` controla las pestañas del Solver, Generador y Buscador de Autor, mostrando el componente correcto según la selección del usuario. [cite: 1]
3.  **Las Vistas ("Tontas" o Presentacionales)**: Componentes como `CryptoSolverView.jsx` o `GeneratorView.jsx` son los "trabajadores". No tienen memoria propia sobre los datos de la aplicación. Su único trabajo es:
    * [cite_start]Mostrar la información que reciben de su gerente (vía **props**). [cite: 7]
    * [cite_start]Avisar al gerente cuando el usuario hace algo (como hacer clic en un botón), llamando a una función que también recibieron por **props**. [cite: 7]
4.  [cite_start]**El Mensajero (`apiClient.js`)**: Es el único archivo que tiene permitido hablar con el servidor. [cite: 7] [cite_start]Cuando el "Cerebro" necesita datos (como cargar el historial), le pide al "Mensajero" que haga la llamada a la API. [cite: 7]

[cite_start]Este flujo, siempre de padres a hijos, hace que la aplicación sea predecible, robusta y fácil de ampliar. [cite: 1]

## Conceptos Clave de React Utilizados

* **`useState` (La Memoria)**: Usamos este "Hook" para darle memoria a los componentes. Lo ves en `App.jsx` para el estado global de la aplicación, pero también localmente en componentes como `GeneratorView.jsx` (para recordar qué pestaña está activa) o `HistoryDetailModal.jsx` (para controlar las animaciones de entrada y salida).
* **`useEffect` (El Temporizador/Vigilante)**: Este "Hook" nos permite ejecutar código *después* de que algo se haya renderizado. Lo usamos para:
    * [cite_start]**Cargar datos**: En `App.jsx`, vigila la variable `activeGame` y, si cambia a `'history'`, dispara la llamada a la API para cargar el historial. [cite: 7]
    * **Animaciones**: En `HistoryDetailModal.jsx`, lo usamos para crear las animaciones de entrada y salida, esperando a que las transiciones CSS terminen.
* **Props (La Comunicación)**: Son la forma en que los componentes padres se comunican con sus hijos, pasándoles tanto datos para mostrar como funciones para ejecutar. [cite_start]Es la base del flujo unidireccional. [cite: 7]

## Estructura de Archivos

frontend/
├── src/
│   ├── components/       # Piezas de UI reutilizables (Modal, Música, Atribución)
│   ├── services/         # Lógica no visual (apiClient.js, userService.js)
│   ├── views/            # Componentes principales que representan "páginas" o secciones
│   ├── App.jsx           # El componente raíz que une todo
│   └── index.css         # Estilos globales y custom de Tailwind
│
├── public/               # Archivos estáticos (imágenes, música, favicon)
└── index.html            # El punto de entrada de la aplicación

## Instalación y Puesta en Marcha

Este frontend está diseñado para funcionar en conjunto con el backend del proyecto.

1.  **Navega a la carpeta del frontend**:
    ```bash
    cd frontend
    ```

2.  **Instala las dependencias**: Esto descarga todas las librerías de React y otras herramientas necesarias.
    ```bash
    npm install
    ```

3.  **Inicia el servidor de desarrollo**: Esto levanta la aplicación en `http://localhost:5173` y la recargará automáticamente cada vez que hagas un cambio en el código.
    ```bash
    npm run dev
    ```

¡Y listo! Asegúrate de que el backend también esté corriendo (`docker compose up --build`) para que la aplicación sea completamente funcional.

