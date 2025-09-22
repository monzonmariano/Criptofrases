# Frontend para Criptofrases & Autores v1.0

Este directorio contiene la aplicación de frontend, construida con React, que consume la API del backend para ofrecer una experiencia de usuario interactiva y moderna.

## ✨ Funcionalidades

* **Solucionador Interactivo**: Permite a los usuarios introducir un criptograma y pistas, recibir múltiples soluciones y navegar entre ellas.
* **Generador por Temas**: Crea nuevos criptogramas a partir de frases generadas por IA sobre temas como "filosofía" o "ciencia".
* **Buscador de Autores**: Identifica al autor de una frase célebre.
* **Historial de Actividad**: Muestra un registro de todas las operaciones realizadas por el usuario, con la opción de eliminar entradas.
* **Navegación Simple**: Una interfaz de pestañas para cambiar fácilmente entre las diferentes funcionalidades.

## 🛠️ Stack Tecnológico

* **Framework**: **React.js** (con Hooks) para una interfaz de usuario declarativa y basada en componentes.
* **Build Tool**: **Vite** para un entorno de desarrollo ultrarrápido con recarga en caliente (Hot Reloading).
* **Estilos**: **Tailwind CSS** para un diseño moderno y personalizable de forma rápida.
* **Cliente HTTP**: **Axios** para una comunicación robusta con la API del backend.

## 📁 Estructura del Proyecto

El código fuente está organizado de la siguiente manera:

```
src/
├── components/     # Componentes de UI pequeños y reutilizables (botones, inputs, etc.).
├── services/       # Lógica para comunicarse con la API del backend (apiClient.js).
├── views/          # Componentes que representan una "página" completa (Solver, Generador, etc.).
├── App.jsx         # El componente principal que gestiona la navegación.
└── index.css       # Estilos globales y configuración de Tailwind.
```

## 🏁 Puesta en Marcha

Para ejecutar el frontend en modo de desarrollo, sigue estos pasos desde la terminal:

1.  **Navega al directorio del frontend:**
    ```bash
    cd frontend
    ```
2.  **Instala las dependencias (solo la primera vez):**
    ```bash
    npm install
    ```
3.  **Inicia el servidor de desarrollo:**
    ```bash
    npm run dev
    ```
La aplicación estará disponible en `http://localhost:5173` (o el puerto que indique la terminal).