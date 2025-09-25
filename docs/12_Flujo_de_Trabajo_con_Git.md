# Documento 12: Flujo de Trabajo con Git y GitHub

Esta guía describe el flujo de trabajo completo para gestionar el código de este proyecto, desde los cambios diarios hasta el lanzamiento de nuevas versiones.

## 1. La Filosofía: Git vs. GitHub

Es crucial entender la diferencia:
* **Git**: Es el **programa** en tu computadora que controla las versiones de tu código. Es como Microsoft Word; te permite escribir y guardar el historial de tu documento.
* **GitHub**: Es la **plataforma en la nube** donde guardas una copia de tu repositorio. Es como Google Docs; te permite tener una copia de seguridad, colaborar y compartir tu trabajo.

## 2. La Estrategia de Ramas

Usamos un modelo simple pero muy potente para mantener el orden.

* **`master` (o `main`)**: La rama **estable y de producción**. Es el código que está funcionando en Netlify/Cloud Run. **Nunca se trabaja directamente aquí.**
* **`develop`**: La rama de **desarrollo activo**. Todas las nuevas funcionalidades se integran aquí. Es nuestro "taller".

## 3. El Flujo de Trabajo Diario (Tu Rutina de Programación)

Este es el ciclo que seguirás cada día que trabajes en el proyecto.

1.  **Empieza el Día (Sincroniza)**: Antes de escribir una sola línea de código, asegúrate de tener la última versión de la rama de desarrollo.
    ```bash
    # Asegúrate de estar en la rama de desarrollo
    git switch develop

    # Descarga los últimos cambios del repositorio remoto
    git pull origin develop
    ```

2.  **Haz tu Magia (Programa)**: Crea nuevas funcionalidades, arregla bugs, mejora la UI.

3.  **Prepara tu Paquete (Staging)**: Cuando hayas completado una tarea, debes preparar los archivos que quieres guardar.
    ```bash
    # Revisa qué archivos has modificado
    git status

    # Añade todos los archivos modificados al "área de preparación" (staging)
    git add .
    ```
    *Analogía*: `git add` es como seleccionar las fotos que quieres poner en un álbum.

4.  **Guarda tu Progreso (Commit)**: Crea un "punto de guardado" permanente en el historial de Git con un mensaje claro y descriptivo.
    ```bash
    # Usa las convenciones de commits que definimos
    git commit -m "feat: Añade la animación de entrada y salida al modal de detalles"
    ```
    *Analogía*: `git commit` es como tomar la foto y escribir una descripción detrás.

5.  **Termina el Día (Haz una Copia de Seguridad)**: Sube todos tus commits del día a la rama `develop` en GitHub.
    ```bash
    git push origin develop
    ```

## 4. El Lanzamiento de una Nueva Versión (Merge con Pull Request)

Cuando has acumulado suficientes mejoras en `develop` y estás listo para lanzar una nueva versión (ej: v1.1), es hora de fusionar `develop` en `master`. La forma profesional de hacerlo es con un **Pull Request (PR)** en GitHub.

1.  **Asegúrate de que `develop` esté actualizado en GitHub**: Simplemente haz un último `git push origin develop`.

2.  **Crea el Pull Request en GitHub**:
    * Ve a la página de tu repositorio en GitHub.
    * Verás un botón para **"Compare & pull request"** entre `develop` y `master`. Haz clic.
    * **Base**: `master` <-- A donde quieres que vaya el código.
    * **Compare**: `develop` <-- De donde viene el código.
    * Escribe un título y una descripción clara de todos los cambios que incluye esta nueva versión.
    * Haz clic en "Create pull request".

3.  **Fusiona el Pull Request**:
    * En la página del Pull Request, verás un botón verde grande que dice **"Merge pull request"**.
    * Haz clic y confirma la fusión.
    * GitHub se encargará de pasar todo el código de `develop` a `master` de forma segura. ¡Tu nueva versión ya es oficial!

4.  **Sincroniza tu Máquina Local**:
    * Ahora, tu `master` local está desactualizado. Ve a tu terminal para ponerlo al día.
    ```bash
    git switch master
    git pull origin master
    ```

¡Este flujo de trabajo te asegura mantener un historial limpio, un proceso de lanzamiento controlado y las mejores prácticas de la industria!