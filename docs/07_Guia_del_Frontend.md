# Documento 7: Guía del Frontend - Cómo "Piensa" una Aplicación en React

Este documento desglosa los conceptos clave de React y las decisiones de arquitectura que hemos tomado para crear una interfaz de usuario interactiva y robusta.

## 1. El Corazón de React: Los Componentes

Piensa en una aplicación de React como una construcción hecha con **piezas de Lego**. Cada pieza es un **Componente**: una porción de la interfaz (un botón, un formulario, una página entera) que encapsula su propia lógica, estilo y estado.

En nuestro proyecto, `CryptoSolverView.jsx` es un componente grande (una "página"), mientras que `BackgroundMusic.jsx` es un componente más pequeño y especializado.

## 2. La "Memoria" de la Aplicación: El Estado Centralizado

Uno de los mayores desafíos en una aplicación compleja es gestionar la "memoria" (el **estado**). Si un usuario genera un criptograma en una vista, ¿cómo hacemos para que esa información no se pierda al cambiar a otra vista?

### El Problema: La "Amnesia" de los Componentes

Por defecto, cada componente tiene su propia memoria interna (`useState`). Cuando cambias de una vista a otra, React **destruye** el componente anterior y toda su memoria se pierde.

### La Solución: "Levantar el Estado" (Lifting State Up)

Hemos resuelto este problema con el patrón de diseño más importante de React: **centralizar el estado en el ancestro común más cercano**.

En nuestro caso, el componente `App.jsx` actúa como el **cerebro central** de la aplicación. Él es el único que tiene la memoria (`useState`) de lo que está pasando en el Solver, en el Generador, en el Buscador de Autor y en el Historial.

```javascript
// Dentro de App.jsx
const [solverState, setSolverState] = useState({ cryptogram: '', clues: [], ... });
const [generatorState, setGeneratorState] = useState({ theme: 'filosofia', ... });
// ... y así para cada vista
```

`App.jsx` luego pasa esta información y las funciones para modificarla a las vistas hijas a través de los **props**.

## 3. La Comunicación: Props y Componentes "Tontos"

Nuestras vistas (`CryptoSolverView`, etc.) ahora son componentes "presentacionales" o "tontos". No tienen memoria propia. Su trabajo es:
1.  **Recibir datos y funciones** desde `App.jsx` a través de los `props` (ej: `<CryptoSolverView state={solverState} setState={setSolverState} />`).
2.  **Mostrar la interfaz** basándose en los datos que reciben (`state.cryptogram`).
3.  Cuando el usuario hace algo (escribir, hacer clic), **avisar a `App.jsx`** llamando a la función que recibieron (`setState(...)` u `onSubmit()`).

Este flujo de datos unidireccional (de arriba hacia abajo) hace que la aplicación sea predecible, fácil de depurar y muy robusta.

## 4. "Efectos Secundarios" y Llamadas a API: El Hook `useEffect`

¿Cómo hacemos para que la vista de "Historial" pida los datos a la API justo cuando aparece en pantalla? Para esto, usamos el hook `useEffect`.

`useEffect` nos permite ejecutar código en respuesta a eventos del "ciclo de vida" de un componente.

**El Desencadenador "Cuando..." (`useEffect`)**
```javascript
// Dentro de App.jsx
useEffect(() => {
  if (activeView === 'history') {
    fetchHistory();
  }
}, [activeView]);
```
Esto se traduce como:
> "**Cuando** la variable `activeView` cambie, ejecuta este código. Si el nuevo valor es `'history'`, entonces llama a la función para cargar el historial."

Es la forma correcta de manejar operaciones asíncronas como las llamadas a la API sin interferir con el renderizado de la interfaz.

## 5. La Conexión con el Backend: `apiClient.js`

Para mantener el código limpio, toda la lógica de comunicación con el backend está centralizada en `src/services/apiClient.js`. Este archivo usa la librería **Axios** para crear un "cliente" preconfigurado.

Cuando una función en `App.jsx` necesita un dato, llama a una función de `apiClient` (ej: `solveCryptogram(...)`), que se encarga de construir la petición HTTP, enviarla y devolver la respuesta. Esta separación nos permite cambiar la URL del backend o la forma de comunicación en un solo lugar sin tener que modificar el resto de la aplicación.