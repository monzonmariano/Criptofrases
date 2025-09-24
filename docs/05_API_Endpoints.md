# Documento 5: Referencia de la API (v1.0)

Esta es la guía completa para interactuar con el backend.

---
### 1. Resolver Criptograma
* **Endpoint**: `POST /api/solve`
* **Descripción**: Envía un criptograma y pistas para que el solver lo resuelva.
* **Ejemplo `curl`**:
    ```bash
    curl -X POST -H "Content-Type: application/json" -d '{"user_id":"test","cryptogram":"1-2 3-4-5-1-6","clues":{}}' http://localhost:8080/api/solve
    ```
* **Respuesta Exitosa (200 OK)**:
    ```json
    {
        "solution": "EL SABER",
        "mapping": {"1": "E", "2": "L", "3": "S", "4": "A", "5": "B", "6": "R"}
    }
    ```
* **Respuesta de Error (404 Not Found)**:
    ```json
    {
        "error": "No se pudo encontrar una solución."
    }
    ```

---
### 2. Encontrar Autor
* **Endpoint**: `POST /api/author`
* **Descripción**: Envía una frase para que la IA identifique al autor.
* **Ejemplo `curl`**:
    ```bash
    curl -X POST -H "Content-Type: application/json" -d '{"user_id":"test","phrase":"Ser o no ser, esa es la cuestión."}' http://localhost:8080/api/author
    ```
* **Respuesta Exitosa (200 OK)**:
    ```json
    {
        "author": "William Shakespeare"
    }
    ```

---
### 3. Generar Criptograma (con IA)
* **Endpoint**: `POST /api/generate`
* **Descripción**: Pide a la IA que genere una frase sobre un tema y la convierte en un criptograma. **Esta acción se guarda internamente para mejorar el sistema, pero no aparece en el historial del usuario.**
* **Respuesta Exitosa (200 OK)**:
    ```json
    {
        "theme": "ciencia",
        "original_phrase": "La ciencia es la poesía de la realidad.",
        "cryptogram": "1-2 3-4-5-6-3-4-2...",
        "clues": {"4": "n", "5": "c"},
        "solution_key": { ... }
    }
    ```

### 4. Generar Criptograma (Personalizado)
* **Endpoint**: `POST /api/generate/custom`
* **Descripción**: Convierte un texto proporcionado por el usuario en un criptograma. **Esta acción SÍ se guarda y aparece en el historial del usuario.**
* **Respuesta Exitosa (200 OK)**:
    ```json
    {
        "original_phrase": "Hola mundo",
        "cryptogram": "1-2-3-2 4-5-6-7-2",
        "solution_key": { "1":"H", "2":"O", ... }
    }
    ```