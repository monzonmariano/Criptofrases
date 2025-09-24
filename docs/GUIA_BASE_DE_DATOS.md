Guía de la Base de Datos (PostgreSQL)

Este documento explica cómo está configurada la base de datos PostgreSQL dentro de Docker y cómo interactuar con ella.
1. Configuración en Docker

La base de datos se define como un servicio llamado db en el archivo docker-compose.yml.

    Imagen: postgres:14-alpine. Usamos la imagen oficial de PostgreSQL en su versión 14, con la etiqueta "alpine" que indica que es una versión muy ligera, ideal para desarrollo.

    Persistencia de Datos: Los datos de la base de datos no se pierden al detener los contenedores gracias a un volumen de Docker. La línea volumes: - postgres_data:/var/lib/postgresql/data/ conecta un almacenamiento persistente gestionado por Docker al directorio donde Postgres guarda sus archivos.

    Credenciales: El usuario, la contraseña y el nombre de la base de datos se configuran a través de variables de entorno leídas desde tu archivo .env, garantizando que no haya información sensible en el código.

## 2. Estructura de la Base de Datos

El proyecto utiliza una única tabla flexible para almacenar la actividad.

### Tabla: `entries`

| Columna | Tipo de Dato | Descripción |
| :--- | :--- | :--- |
| `id` | `SERIAL PRIMARY KEY` | Identificador único autoincremental. |
| `user_id` | `TEXT NOT NULL` | Identificador único del usuario. |
| `entry_type` | `VARCHAR(50) NOT NULL` | **Clave principal.** Define el tipo de entrada: `solver`, `ai_generator`, `user_generator`. |
| `content` | `TEXT` | **(Para Corpus)**. Guarda la frase generada por IA para futuro análisis. Puede ser `NULL`. |
| `result` | `TEXT` | **(Legado/Resumen)**. Guarda un resumen del resultado. Puede ser `NULL`. |
| `author` | `TEXT` | Guarda el autor de una frase. Puede ser `NULL`. |
| `timestamp` | `TIMESTAMPTZ` | Fecha y hora exactas del registro. Se inserta automáticamente. |
| `details` | `JSONB` | **El corazón de los datos.** Guarda un objeto JSON con toda la información de una sesión de `solver` o `user_generator`. Puede ser `NULL`. |

### Script de Inicialización (`database/init.sql`)

```sql
-- Archivo: database/init.sql
DROP TABLE IF EXISTS entries; -- Reinicia la tabla para aplicar cambios

CREATE TABLE IF NOT EXISTS entries (
    id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    entry_type VARCHAR(50) NOT NULL,
    content TEXT,
    result TEXT,
    author TEXT,
    timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    details JSONB
);

    Montar el script en docker-compose.yml:
    Modifica el servicio db para que ejecute este script al iniciar.

    # docker-compose.yml
    services:
      db:
        # ... (image, environment, etc.)
        volumes:
          - postgres_data:/var/lib/postgresql/data/
          - ./database/init.sql:/docker-entrypoint-initdb.d/init.sql

    Docker ejecutará automáticamente cualquier script .sql o .sh que encuentre en el directorio /docker-entrypoint-initdb.d/ la primera vez que el contenedor se cree.

3. Interactuar con la Base de Datos

Puedes conectarte a la base de datos directamente para realizar consultas o depurar.
Vía Línea de Comandos (psql)

    Asegúrate de que los contenedores estén corriendo (docker compose up).

    Abre una nueva terminal y ejecuta:

    docker compose exec db psql -U <tu_usuario> -d <tu_bd>

    (Reemplaza <tu_usuario> y <tu_bd> con los valores de tu archivo .env).

    Una vez dentro, puedes usar comandos SQL:

    \dt -- para ver las tablas
    SELECT * FROM entries; -- para ver el contenido

Vía Herramienta Gráfica (ej. VS Code)

    Asegúrate de que el puerto de la base de datos esté expuesto en docker-compose.yml:

    ports:
      - "5433:5432"

    Usa la extensión "PostgreSQL" de VS Code o cualquier otro cliente de BD.

    Conéctate usando:

        Host: localhost

        Puerto: 5433

        Usuario, Contraseña y Base de Datos: Los que definiste en tu archivo .env.