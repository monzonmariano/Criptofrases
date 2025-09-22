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
### 3. Generar Criptograma
* **Endpoint**: `POST /api/generate`
* **Descripción**: Pide a la IA que genere una frase sobre un tema y la convierte en un criptograma.
* **Ejemplo `curl`**:
    ```bash
    curl -X POST -H "Content-Type: application/json" -d '{"user_id":"test","theme":"ciencia"}' http://localhost:8080/api/generate
    ```
* **Respuesta Exitosa (200 OK)**:
    ```json
    {
        "theme": "ciencia",
        "original_phrase": "La ciencia es la poesía de la realidad.",
        "cryptogram": "1-2 3-4-5-6-3-4-2 5-7 1-2 8-9-5-7-10-2 11-5 1-2 12-5-2-1-4-5-2-11",
        "clues": {"4": "n", "5": "c"},
        "solution_key": { ... }
    }
    ```

*(Y así sucesivamente para los otros tres endpoints: `history`, `clear-history` y `delete-entry`)*