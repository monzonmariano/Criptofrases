## Fase 0: Preparación del Entorno

Antes de escribir código, preparamos el terreno.

    Confirma tu commit: Asegúrate de que tu git commit esté hecho para tener un punto de restauración seguro.

    Nuevas Herramientas: Añadiremos dos librerías increíblemente potentes a tu backend/requirements.txt más adelante, pero es bueno que las conozcas desde ahora:

        spaCy: Una librería de nivel industrial para Procesamiento del Lenguaje Natural (NLP). La usaremos en la Fase 2 para "entender" la gramática de las frases.

        sentence-transformers: La librería "NASA" que convierte texto en vectores numéricos para comparar significados. La usaremos en la Fase 3.

## Fase 1: La Base - Búsqueda Simple por Coincidencia

Objetivo: Crear un sistema funcional de extremo a extremo que pueda encontrar autores si el usuario escribe una parte exacta de la frase.

Paso 1.1: Modificar la Base de Datos (database/init.sql)

Añade la definición de la nueva tabla quotes a tu archivo init.sql. Esta tabla almacenará las frases y sus autores.
SQL

-- database/init.sql

-- ... (tu tabla 'entries' existente) ...

-- Nueva tabla para el buscador de autores local
CREATE TABLE IF NOT EXISTS quotes (
    id SERIAL PRIMARY KEY,
    text TEXT NOT NULL UNIQUE,
    author VARCHAR(255) NOT NULL,
    -- Dejamos estas columnas listas para las fases 2 y 3
    normalized_text TEXT,
    text_vector REAL[] -- O el tipo de dato vectorial si usas pgvector
);

Paso 1.2: Crear un Nuevo CRUD (backend/core/crud/quotes_crud.py)

Para mantener el orden, crea un nuevo archivo para manejar las operaciones de la tabla quotes.

    Crea el archivo: backend/core/crud/quotes_crud.py

    Añade estas funciones:

Python

# backend/core/crud/quotes_crud.py
from backend import db

# Función para añadir nuevas frases (la usaremos después)
def add_quote(text: str, author: str):
    conn = db.get_db_connection()
    with conn.cursor() as cur:
        cur.execute("INSERT INTO quotes (text, author) VALUES (%s, %s)", (text, author))
        conn.commit()
    conn.close()

# Función de búsqueda simple
async def find_author_by_keyword(phrase: str):
    conn = db.get_db_connection()
    with conn.cursor() as cur:
        query = "SELECT text, author FROM quotes WHERE text ILIKE '%' || %s || '%'"
        cur.execute(query, (phrase,))
        result = cur.fetchone() # Devolvemos solo el primer resultado por ahora
    conn.close()
    if result:
        return {"quote": result[0], "author": result[1]}
    return None

Paso 1.3: Crear el Nuevo Servicio (backend/services/local_author_finder.py)

Aquí vivirá la lógica de negocio.

    Crea el archivo: backend/services/local_author_finder.py

    Añade este código:

Python

# backend/services/local_author_finder.py
from backend.core.crud import quotes_crud
from backend.logger_config import log

async def find_author_locally(data: dict):
    phrase = data.get('phrase', '')
    if not phrase:
        return {"error": "La frase no puede estar vacía."}, 400
    
    log.info(f"Buscando localmente el autor de: '{phrase}'")
    result = await quotes_crud.find_author_by_keyword(phrase)
    
    if result:
        return result, 200
    else:
        return {"error": "No se encontró un autor para esa frase en la base de datos local."}, 404

Paso 1.4: Conectar el Orquestador (backend/core/api_manager.py)

Enséñale a tu "director de orquesta" sobre el nuevo servicio.

    Añade la importación: from backend.services import local_author_finder

    Añade la nueva función:

Python

# backend/core/api_manager.py
async def find_local_author(data):
    log.info("API Manager: Petición de autor local recibida.")
    return await local_author_finder.find_author_locally(data)

Paso 1.5: Crear el Endpoint (backend/api.py)

Expón tu nueva funcionalidad al mundo exterior.

    Añade la nueva función al setup_routes:
    Python

# en api.py, dentro de setup_routes(app)
app.router.add_post('/api/author/local', handle_get_local_author)

Añade el manejador de la petición:
Python

    # en api.py
    async def handle_get_local_author(request):
        try:
            data = await request.json()
            response_data, status = await api_manager.find_local_author(data)
            return web.json_response(response_data, status=status, dumps=pretty_json)
        except Exception as e:
            return _create_error_response(e, "/api/author/local")

Paso 1.6: Poblar la Base de Datos

Tu tabla quotes está vacía. Crea un script simple llamado scripts/populate_db.py para añadir tus primeras 10-20 frases y autores, usando la función quotes_crud.add_quote.

¡Felicidades! Al final de la Fase 1, tendrás un buscador local completamente funcional.

## Fase 2: Búsqueda Inteligente (con spaCy)

Objetivo: Implementar tu idea de la búsqueda por palabras raíz.

    Añade spacy a requirements.txt y descarga el modelo en español (python -m spacy download es_core_news_md).

    Crea un script de pre-procesamiento: Un archivo scripts/preprocess_quotes.py que:

        Lea todas las filas de la tabla quotes.

        Use spaCy para lematizar el contenido de la columna text.

        Guarde el resultado (ej: "vestir despacio estar apurado") en la columna normalized_text.

    Actualiza la lógica de búsqueda: Modifica quotes_crud.find_author_by_keyword para que:

        Lematice la frase del usuario.

        Busque coincidencias en la columna normalized_text.

## Fase 3: Búsqueda Semántica (con sentence-transformers)

Objetivo: Dar el salto a la búsqueda por significado.

    Añade sentence-transformers a requirements.txt.

    Instala pgvector en tu PostgreSQL: Esto a menudo requiere modificar tu Dockerfile del servicio db o usar una imagen de Docker que ya lo incluya (como ankane/pgvector).

    Crea un script de vectorización: Similar al de la Fase 2, pero este usará un modelo de sentence-transformers para convertir cada frase en un vector numérico y guardarlo en la columna text_vector.

    Crea una nueva función de búsqueda: En quotes_crud.py, crea find_author_by_similarity que:

        Vectorice la frase del usuario.

        Use el operador de similitud de coseno (<=>) de pgvector para encontrar el vector más cercano en la base de datos.