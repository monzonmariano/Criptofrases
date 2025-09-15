# Guía de Uso y Estrategia de Git para Criptofrases

Este documento describe el flujo de trabajo y las convenciones de Git utilizadas en este proyecto. El objetivo es mantener un historial limpio, organizado y fácil de entender.

## 1. Filosofía de Ramas (Branching) 🌿

Utilizamos un modelo de ramas simple pero robusto para separar el trabajo estable del trabajo en desarrollo.

* ### Rama `main`
    * **Propósito:** Es la rama principal y **sagrada**. Debe contener únicamente versiones **estables, probadas y funcionales** del proyecto.
    * **Regla:** **Nadie hace commits directamente a `main`**. Solo se actualiza fusionando la rama `develop` cuando esta alcanza un hito importante.

* ### Rama `develop`
    * **Propósito:** Es la rama principal de **desarrollo**. Aquí es donde se integra todo el trabajo nuevo. Se considera una rama "en construcción" y puede estar temporalmente inestable.
    * **Regla:** Todo el trabajo diario se realiza aquí o en ramas de funcionalidad que parten de `develop`.

## 2. Flujo de Trabajo Básico Diario

1.  **Asegúrate de estar en `develop`:** Antes de empezar a trabajar, verifica que estás en la rama correcta.
    ```bash
    git switch develop
    ```
2.  **Haz tus cambios:** Modifica el código, añade nuevos archivos, etc.
3.  **Revisa tus cambios:** Usa `git status` para ver qué has modificado.
4.  **Añade los cambios:** Prepara todos tus archivos para el commit.
    ```bash
    git add .
    ```
5.  **Crea el commit:** Guarda tu progreso con un mensaje descriptivo (ver la sección de mensajes más abajo).
    ```bash
    git commit -m "feat: Añade endpoint para generar criptogramas"
    ```

## 3. Creación de Nuevas Funcionalidades (Feature Branches)

Para funcionalidades grandes o experimentales, es una buena práctica crear una rama separada a partir de `develop`.

1.  **Desde `develop`, crea y cámbiate a la nueva rama:**
    ```bash
    # El nombre de la rama debe ser descriptivo
    git switch -c feature/integracion-react
    ```
2.  **Trabaja y haz commits** en esta nueva rama.
3.  Cuando la funcionalidad esté completa, se fusionará de vuelta a `develop`.

## 4. Mensajes de Commit (Convenciones)

Usamos el estándar de **Conventional Commits** para que el historial sea legible. El mensaje debe empezar con un tipo, seguido de una descripción:

* **`feat:`**: Para una nueva funcionalidad (ej. `feat: Implementa el solver`).
* **`fix:`**: Para la corrección de un error (ej. `fix: Corrige error de importación en Docker`).
* **`docs:`**: Para cambios en la documentación (ej. `docs: Actualiza el README principal`).
* **`style:`**: Cambios que no afectan la lógica (formato, punto y coma, etc.).
* **`refactor:`**: Cambios en el código que no son ni un `fix` ni un `feat`.
* **`test:`**: Para añadir o corregir tests.
* **`chore:`**: Tareas de mantenimiento (ej. `chore: Actualiza el .gitignore`).

## 5. Comandos Útiles de Consulta

| Comando | Descripción |
| :--- | :--- |
| `git status` | Muestra el estado actual de tus archivos (modificados, nuevos, etc.). |
| `git branch` | Lista las ramas locales y te indica en cuál estás. |
| `git log --oneline --graph`| Muestra el historial de commits de forma compacta y visual. |
