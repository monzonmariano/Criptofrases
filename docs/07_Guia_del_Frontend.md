Este documento es una inmersión profunda en el código del frontend, explicando los conceptos de React y las decisiones de diseño línea por línea.

## 1. El Cerebro: `App.jsx`

`App.jsx` es el componente raíz. No renderiza mucha UI directamente, pero actúa como el **cerebro central** que orquesta todo.

* **Gestión de Estado (`useState`)**: Aquí vive el `useState` principal, llamado `gameState`. Es un gran objeto que contiene toda la "memoria" de la aplicación: los datos del solver, los datos de los dos modos del generador, el historial, etc. Centralizarlo aquí evita que los datos se pierdan al cambiar de vista.
    ```javascript
    const [gameState, setGameState] = useState({
      cryptogram: {
        solver: { ... },
        generator: {
          ia: { ... },
          custom: { ... }
        }
      },
      history: { ... }
    });
    ```
* **Handlers de Lógica (`handleSolveSubmit`, etc.)**: Estas son funciones `async` que viven en `App.jsx`. Son las únicas que pueden llamar al `apiClient` para hablar con el backend. Cuando se completan, usan `setGameState` para actualizar la memoria central con los nuevos datos.
* **Renderizado Condicional (`renderActiveView`)**: Esta función actúa como un controlador de tráfico. Mira la variable de estado `activeGame` (`'menu'`, `'cryptogram'`, `'history'`) y decide qué componente de vista principal debe mostrarse en la pantalla.
* **Props (El Flujo de Datos)**: `App.jsx` pasa porciones del `gameState` y los `handlers` a sus hijos (`CryptoSuiteView`, `HistoryView`) como **props**. Este es el flujo de datos unidireccional que hace a React predecible: los datos siempre fluyen de padres a hijos.

## 2. El Orquestador de Pestañas: `CryptoSuiteView.jsx`

Este componente es un "gerente de nivel medio". Su única responsabilidad es gestionar las pestañas internas (Solver, Generador, Buscador de Autor) y mostrar la vista correcta.

* **Estado Local (`useState`)**: Tiene un `useState` propio y simple, `const [activeTab, setActiveTab] = useState('solver');`, porque qué pestaña está activa es un detalle que solo le importa a él.
* **Paso de Props**: Recibe el `gameState.cryptogram` completo y los `handlers` de `App.jsx`, y se los pasa al hijo correcto. Por ejemplo, a `GeneratorView` le pasa el `state.generator` y los `handlers` `onGenerateByTheme` y `onGenerateCustom`.

## 3. Las Vistas "Tontas": `GeneratorView.jsx`, `CryptoSolverView.jsx`

Estos son los componentes que el usuario ve y con los que interactúa. Se les llama "tontos" o "presentacionales" porque no tienen cerebro propio.

* **Reciben Props**: No tienen `useState` para sus datos. Todo lo que necesitan saber (el tema actual, el texto del criptograma) les llega como un prop `state` desde su padre.
* **Muestran la UI**: Usan los datos de los props para renderizar los formularios, botones y resultados.
* **Avisan Hacia Arriba**: Cuando un usuario escribe en un `textarea` o hace clic en un botón, el componente llama a una función que recibió como prop (ej: `onChange` llama a `setState`, `onSubmit` llama a un `handler`). Nunca modifican los datos directamente.

## 4. El Historial Inteligente: `HistoryView.jsx`

* **Filtrado de Datos**: Antes de mostrar nada, este componente aplica una lógica de negocio clave:
    ```javascript
    const filteredHistory = state.history.filter(entry => 
      ['solver', 'user_generator'].includes(entry.entry_type)
    );
    ```
    Esto asegura que la vista del usuario sea limpia y relevante, mostrando solo sus resoluciones y creaciones, pero ocultando las generaciones de la IA que se guardan para uso interno del sistema.
* **Timestamps Dinámicos (`date-fns`)**: Utiliza la librería `date-fns` para mostrar fechas relativas y amigables (ej: "hace 5 minutos"), convirtiendo los strings de fecha ISO que envía el backend.
* **Componentes de Iconos**: Define pequeños componentes internos (ej: `<GameIcon>`) para renderizar diferentes iconos según el `entry_type`, haciendo el código más limpio y escalable.

## 5. El Modal Interactivo: `HistoryDetailModal.jsx`

* **Animación de Entrada y Salida**: Este componente utiliza `useState` y `useEffect` para crear una animación de "fade" suave.
    * `const [isMounted, setIsMounted] = useState(false);`: Se usa para activar la animación de entrada un instante después de que el componente aparece.
    * `const [isClosing, setIsClosing] = useState(false);`: Se usa para activar la animación de salida y esperar a que termine antes de que el componente se destruya.
* **Propagación de Eventos (`e.stopPropagation()`)**: El `div` principal del modal tiene un `onClick` que detiene la propagación del evento. Esto es crucial para evitar que al hacer clic *dentro* del modal, también se active el `onClick` del fondo oscuro que cierra el modal.
