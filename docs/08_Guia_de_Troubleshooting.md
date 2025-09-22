# Documento 8: Guía de Troubleshooting (Resolución de Problemas Comunes)

La configuración de un entorno de desarrollo moderno puede ser frustrante. A veces, un pequeño error puede generar mensajes confusos. Esta guía está aquí para ayudarte a superar los errores más comunes que puedes encontrar al levantar el proyecto, de forma rápida y sin dolor.

---
### Problema 1: Error de CORS en el Navegador

* **Síntoma**: Tu frontend está funcionando, pero al intentar llamar a la API del backend, la consola del navegador muestra un error similar a `Cross-Origin Request Blocked`, `Same Origin Policy` o `CORS header ‘Access-Control-Allow-Origin’ missing`.
* **Diagnóstico**: Esto no es un error de tu código, sino una **característica de seguridad del navegador**. Por defecto, un sitio web en un "origen" (ej: `http://localhost:5173`) no puede pedirle datos a otro origen (ej: `http://localhost:8080`), aunque ambos estén en tu máquina. El backend necesita dar permiso explícito.
* **Solución**:
    1.  Asegúrate de que la librería `aiohttp-cors` esté en tu archivo `backend/requirements.txt`.
    2.  Verifica que tu archivo `backend/main.py` contenga la configuración de CORS que permite el acceso desde el origen de tu frontend (`http://localhost:5173`).
    3.  Detén y reconstruye tu entorno Docker con `docker compose up --build` para aplicar los cambios.

---
### Problema 2: Error de `npx` - `could not determine executable to run`

* **Síntoma**: Al ejecutar un comando como `npx tailwindcss init -p`, recibes un error que dice que no se pudo determinar el ejecutable.
* **Diagnóstico**: El 99% de las veces, esto significa que estás ejecutando el comando desde la **carpeta incorrecta**. `npx` necesita estar en la misma carpeta donde `npm` instaló las herramientas (la carpeta `frontend/`).
* **Solución**:
    1.  Abre tu terminal y asegúrate de haber navegado dentro de la carpeta del frontend con el comando `cd frontend`.
    2.  Vuelve a ejecutar el comando `npx` desde allí.

---
### Problema 3: Error de `npm` - `EJSONPARSE`

* **Síntoma**: Al ejecutar `npm install`, la terminal muestra un error `EJSONPARSE` y se queja de que el archivo `package.json` no es un JSON válido.
* **Diagnóstico**: Has editado manualmente el `package.json` y has cometido un pequeño error de sintaxis. El culpable más común es una **coma (`,`) sobrante** al final de la última línea de una lista o un objeto.
* **Solución**:
    1.  Abre tu archivo `frontend/package.json`.
    2.  Busca cuidadosamente comas al final del último elemento en las secciones `dependencies` y `devDependencies`.
    3.  Puedes usar un validador de JSON en línea para pegar tu código y encontrar el error exacto si no lo ves a simple vista.

---
### Problema 4: Error de `npm` - `ETARGET` o `No matching version found`

* **Síntoma**: `npm install` falla con un error que dice que no se encontró una versión coincidente para un paquete (ej: `react-dom@^19.1.9`).
* **Diagnóstico**: El archivo `package.json` está pidiendo una versión de un paquete que **no existe** en el repositorio de `npm`. Esto suele deberse a un error tipográfico en el número de la versión.
* **Solución**:
    1.  Abre tu archivo `frontend/package.json`.
    2.  Busca la línea del paquete que da el error.
    3.  Consulta en la web de `npm` (o simplemente usa una versión estándar y estable, como `"react": "^18.2.0"`) y corrige el número de la versión.
    4.  Es recomendable borrar la carpeta `node_modules` y el archivo `package-lock.json` antes de volver a ejecutar `npm install`.

---
### Problema 5: Errores Rojos en `index.css` sobre `@tailwind`

* **Síntoma**: VS Code subraya en rojo las líneas `@tailwind base;`, `@tailwind components;` y `@tailwind utilities;` en tu `index.css`.
* **Diagnóstico**: No es un error real. Es un **falso positivo**. El editor VS Code, por defecto, no entiende la sintaxis especial de Tailwind. Sin embargo, el proceso de construcción de Vite sí la entiende y funcionará perfectamente.
* **Solución (Recomendada)**:
    1.  Ve al panel de Extensiones de VS Code.
    2.  Busca e instala la extensión oficial **`Tailwind CSS IntelliSense`**.
    3.  Reinicia VS Code. Los errores desaparecerán y además tendrás autocompletado para todas las clases de Tailwind.