# Documento 10: Guía de Despliegue del Frontend (a Netlify)

Desplegar un frontend de React es un proceso muy gratificante. Usaremos Netlify porque es una plataforma especializada en esto, ofreciendo una experiencia increíblemente simple y un nivel gratuito muy potente.

## La Estrategia: ¿Por qué Netlify?

Netlify es una plataforma de "Integración y Despliegue Continuo" (CI/CD).
* **Se Conecta a tu Git**: Observa tu repositorio de GitHub.
* **Construye Automáticamente**: Cuando subes un cambio a tu rama `master`, Netlify lo detecta, descarga el código y ejecuta el comando de construcción (`npm run build`) por ti.
* **Publica Globalmente**: Toma el resultado (la carpeta `dist`) y lo distribuye en su red global de servidores (CDN), haciendo que tu sitio cargue muy rápido desde cualquier parte del mundo.

## Paso 1: El Puente entre Frontend y Backend

Este es el paso más importante de todo el despliegue. Tu aplicación de React (que vivirá en una URL de Netlify) necesita saber la dirección pública de tu API (que vive en una URL de Cloud Run).

1.  **Abre el archivo**: `frontend/src/services/apiClient.js`
2.  **Modifica la URL**: Cambia la dirección de `localhost` por la URL que te dio Google Cloud Run.
    ```javascript
    // apiClient.js
    const API_BASE_URL = '[https://criptofrases-backend-xxxx.run.app/api](https://criptofrases-backend-xxxx.run.app/api)';
    ```
3.  **Guarda y Sube a Git**: Es **crucial** que este cambio esté en tu repositorio (`git push`) antes de ir a Netlify.

## Paso 2: Desplegar en Netlify

1.  **Regístrate en Netlify**: Ve a [Netlify.com](https://www.netlify.com/) y crea una cuenta usando tu perfil de GitHub.
2.  **Importa tu Proyecto**:
    * En tu panel, haz clic en "Add new site" > "Import an existing project".
    * Conéctate a GitHub y selecciona tu repositorio `Criptofrases`.
3.  **Configura el Despliegue**: Netlify es muy bueno detectando proyectos de React, pero confirma esta configuración:
    * **Branch to deploy**: `master` (o `main`). La rama que contiene tu código de producción.
    * **Base directory**: `frontend`. Le dice a Netlify que tu aplicación no está en la raíz del repositorio, sino en esta subcarpeta.
    * **Build command**: `npm run build`. El comando para "fabricar" tu aplicación.
    * **Publish directory**: `dist`. La carpeta que contiene el "producto final" que Netlify debe publicar.
4.  **Haz clic en "Deploy site"**.

¡Eso es todo! Netlify se encargará del resto. En uno o dos minutos, tu sitio estará en línea con una URL pública.

## Paso 3: Un Nombre Profesional

La URL que Netlify te da es aleatoria (ej: `curious-corgi-1234.netlify.app`). Para que se vea mejor en tu portafolio o LinkedIn:

1.  Ve a la configuración de tu sitio en Netlify ("Site settings").
2.  Haz clic en "Change site name".
3.  Elige un nombre personalizado, como `criptofrases-hub`.
4.  Tu nueva URL será `https://criptofrases-hub.netlify.app`. ¡Mucho mejor!
