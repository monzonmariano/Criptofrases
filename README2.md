# Proyecto: Criptofrases & Autores

Criptofrases & Autores es una aplicación web interactiva diseñada como una herramienta completa para entusiastas de los criptogramas y las frases célebres. El backend está construido con una arquitectura moderna, modular y completamente contenerizada con Docker.

## Funcionalidades Principales

* **Resolver Criptogramas:** Utiliza un potente algoritmo de backtracking en Python, enriquecido con heurísticas de frecuencia de letras y palabras, para resolver criptogramas de sustitución.
* **Generar Criptogramas:** Convierte texto en un nuevo criptograma numérico usando la API de Google Gemini.
* **Encontrar Autor:** Identifica al autor probable de una frase célebre usando la API de Google Gemini.
* **Historial de Actividad:** Persiste todas las interacciones en una base de datos PostgreSQL, asociadas a un ID de usuario.

## Arquitectura Tecnológica

| Componente      | Tecnología / Librería | Propósito                                                 |
| :-------------- | :-------------------- | :-------------------------------------------------------- |
| **Backend** | Python 3.10, aiohttp | Servidor web asíncrono de alto rendimiento.               |
| **Base de Datos** | PostgreSQL 14         | Almacenamiento de datos robusto y persistente.            |
| **IA & Servicios**| Google Gemini API     | Asistente para tareas de lenguaje natural (generación, etc.). |
| **Contenerización** | Docker & Docker Compose | Aislamiento y orquestación del entorno de desarrollo.     |

## Estado Actual del Proyecto

La infraestructura del proyecto (Docker, servidor web, base de datos) es estable y funcional. Los servicios de la API de Gemini están integrados y la persistencia de datos funciona correctamente.

El componente principal, el `crypto_solver`, ha sido desarrollado con un algoritmo avanzado pero actualmente se encuentra en una **fase final de depuración** para resolver criptogramas de alta complejidad.

## Estructura del Proyecto

El proyecto está organizado en una arquitectura de capas para una máxima separación de responsabilidades:

```
Criptofrases/
├── backend/
│   ├── core/
│   │   ├── api_manager.py      # Orquesta las llamadas entre la API y los servicios.
│   │   └── database_manager.py # Gestiona la lógica de la base de datos.
│   ├── data/
│   │   ├── corpus.txt          # Diccionario maestro de palabras en español.
│   │   ├── frecuencia_corpus.txt # Texto base para análisis estadístico.
│   │   ├── es_words_by_length.json  # Palabras organizadas por longitud.
│   │   └── es_word_frequency.json   # Frecuencia de uso de cada palabra.
│   ├── services/
│   │   ├── crypto_solver.py    # Implementa el algoritmo de resolución.
│   │   ├── solver_utils.py     # Script para generar los archivos JSON de `data/`.
│   │   └── gemini.py           # Implementa las llamadas a la API de Gemini.
│   ├── api.py                  # Define las rutas (endpoints) de la API.
│   ├── logger_config.py        # Configuración centralizada del logging.
│   ├── main.py                 # Punto de entrada que inicia el servidor.
│   └── Dockerfile              # Instrucciones para construir la imagen del backend.
├── database/
│   └── init.sql                # Script para crear las tablas de la BD al inicio.
├── .env.example                # Plantilla para variables de entorno.
├── .env                        # (Ignorado por Git) Credenciales y secretos.
└── docker-compose.yml          # Orquesta los servicios de backend y base de datos.
```

## Puesta en Marcha

Para levantar el entorno de desarrollo, sigue estos pasos:

1.  **Clonar el Repositorio**
    ```bash
    git clone <url-del-repositorio>
    cd Criptofrases
    ```

2.  **Configurar Variables de Entorno**
    Copia el archivo de ejemplo y rellena tus credenciales (API Key, contraseña de BD).
    ```bash
    cp .env.example .env
    ```

3.  **Generar Recursos del Solver**
    Descarga los corpus (`corpus.txt` y `frecuencia_corpus.txt`) en la carpeta `backend/data/`. Luego, ejecuta el script para procesarlos.
    ```bash
    python3 backend/services/solver_utils.py
    ```

4.  **Iniciar el Entorno Docker**
    Este comando construirá las imágenes y levantará los contenedores.
    ```bash
    docker compose up --build
    ```
    El servidor estará disponible en `http://localhost:8080`.

## Ejemplo de Uso (API)

Puedes probar el endpoint de resolución usando `curl`:

```bash
curl -X POST \
-H "Content-Type: application/json" \
-d '{
    "user_id": "test_user_01",
    "cryptogram": "2-3 6-4-8-8-4 2-1 9-10 7-10-5-11-7-3 11-9-14 7-1-13-9-13-4",
    "clues": { "1": "s", "2": "e", "6": "z", "7": "a", "5": "i" }
}' \
http://localhost:8080/api/solve
```