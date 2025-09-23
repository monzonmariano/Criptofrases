# Criptofrases & Logic Hub - Frontend

¡Bienvenido al frontend de Criptofrases & Logic Hub! Esta es una aplicación web moderna construida con [React](https.reactjs.org/) y estilizada con [Tailwind CSS](https.tailwindcss.com/). Está diseñada para ser una interfaz de usuario interactiva, atractiva y fácil de usar para una variedad de juegos de lógica, comunicándose con un potente backend de Python.

## Características

* **Hub de Juegos**: Una pantalla de bienvenida para seleccionar entre diferentes juegos de lógica.
* **Suite de Criptogramas**: Incluye un Solver, un Generador de frases por IA y un Buscador de Autores.
* **Experiencia Inmersiva**: Con música de fondo ambiental y un carrusel de imágenes para crear una atmósfera de "café de jazz".
* **Persistencia de Usuario**: Guarda el historial de tus partidas en una base de datos.
* **Diseño Responsivo**: Se adapta perfectamente a dispositivos móviles y de escritorio.

## ¿Cómo funciona? La Arquitectura de React

Esta aplicación sigue un patrón de diseño profesional y fácil de entender:

1.  **El Cerebro (`App.jsx`)**: Este es el componente principal. Mantiene en su "memoria" (el estado) toda la información importante: qué juego está activo, los datos del criptograma, el historial, etc..
2.  **Los Contenedores (`CryptoSuiteView.jsx`)**: Son como "gerentes de departamento". Organizan un conjunto de herramientas relacionadas. Por ejemplo, `CryptoSuiteView` gestiona las pestañas del Solver, Generador y Buscador de Autores.
3.  **Las Vistas ("Tontas") (`CryptoSolverView.jsx`, etc.)**: Son los "trabajadores". No tienen memoria propia. Su único trabajo es mostrar la información que les da su gerente y avisarle cuando el usuario hace algo (como hacer clic en un botón).
4.  **El Mensajero (`apiClient.js`)**: Es el único archivo que tiene permitido hablar con el servidor (el backend). Cuando el "Cerebro" necesita datos, le pide al "Mensajero" que los vaya a buscar.

Este flujo de datos, siempre desde arriba hacia abajo, hace que la aplicación sea predecible y fácil de ampliar con nuevos juegos.

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

¡Y listo! Asegúrate de que el backend también esté corriendo (con `docker compose up --build`) para que la aplicación sea completamente funcional.