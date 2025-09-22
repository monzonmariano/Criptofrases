# Documento 6: Contenerización con Docker (La Magia de la Caja)

Este documento desglosa los tres archivos clave que permiten que nuestro proyecto se ejecute en un entorno aislado, predecible y fácil de gestionar: `requirements.txt`, `Dockerfile` y `docker-compose.yml`.

---
## 1. `requirements.txt` - La Lista de Ingredientes

Este archivo es simplemente una lista de todas las librerías de Python de las que depende nuestro proyecto para funcionar. Piensa en ello como la **lista de ingredientes** al principio de una receta.

```plaintext
# requirements.txt
aiohttp
psycopg2-binary
python-dotenv
unidecode
google-generativeai
```

* **`aiohttp`**: Es nuestro framework web. El "motor" que nos permite crear un servidor y manejar peticiones HTTP de forma asíncrona.
* **`psycopg2-binary`**: El "traductor" o adaptador que le permite a Python comunicarse con nuestra base de datos PostgreSQL.
* **`python-dotenv`**: Una utilidad que lee nuestro archivo `.env` y carga las credenciales (como la `GEMINI_API_KEY`) como variables de entorno.
* **`unidecode`**: La herramienta que usamos para normalizar texto, eliminando acentos y caracteres especiales.
* **`google-generativeai`**: El kit de herramientas oficial de Google para comunicarnos con la API de Gemini.

---
## 2. `Dockerfile` - Las Instrucciones de Ensamblaje

Este archivo es la **receta paso a paso** para construir la "caja" (la imagen de Docker) que contendrá nuestra aplicación Python. Docker lee este archivo de arriba a abajo.

```dockerfile
# Dockerfile

# 1. La Base
FROM python:3.10-slim-bullseye

# 2. El Directorio de Trabajo
WORKDIR /app

# 3. Copiar e Instalar Dependencias (Estratégicamente)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 4. Copiar el Código de la Aplicación
COPY ./backend /app/backend

# 5. El Comando de Arranque
CMD ["python3", "-m", "backend.main"]
```

1.  **`FROM python:3.10-slim-bullseye`**: Le dice a Docker: "Empieza con una plantilla oficial que ya tiene instalado Python 3.10. Usa la versión `slim` porque es más ligera y ocupa menos espacio".
2.  **`WORKDIR /app`**: "Crea una carpeta de trabajo llamada `/app` dentro de nuestra caja. A partir de ahora, todos los comandos se ejecutarán desde ahí".
3.  **`COPY requirements.txt .` y `RUN pip install ...`**: Este es un paso estratégico. Primero copiamos **solo** la lista de ingredientes y la instalamos. Hacemos esto por separado del resto del código por el sistema de caché de Docker. Si más adelante solo cambiamos nuestro código Python pero no las librerías, Docker reutilizará la capa ya instalada, haciendo que la reconstrucción sea mucho más rápida.
4.  **`COPY ./backend /app/backend`**: "Ahora sí, copia todo el código fuente de nuestra aplicación (la carpeta `backend` del PC) a la carpeta `/app/backend` dentro de la caja".
5.  **`CMD ["python3", "-m", "backend.main"]`**: "Esta es la instrucción final. Cuando alguien 'encienda' esta caja, el comando por defecto que debes ejecutar es `python3 -m backend.main`", lo que inicia nuestro servidor. Usamos `-m backend.main` para ejecutar el módulo como un script, lo que ayuda a Python a manejar correctamente las importaciones relativas.

---
## 3. `docker-compose.yml` - El Director de Orquesta

Si el `Dockerfile` es la receta para construir *una* caja, `docker-compose.yml` es el **plano maestro** que define todas las cajas que necesita nuestro proyecto y cómo deben interactuar entre sí.

```yaml
# docker-compose.yml

services:
  backend:
    build: .
    ports:
      - "8080:8080"
      - "5678:5678"
    volumes:
      - ./backend:/app/backend
    env_file:
      - .env
    depends_on:
      - db
  
  db:
    image: postgres:14-alpine
    environment:
      POSTGRES_DB: ${DB_NAME}
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data/
      - ./database/init.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "5433:5432"

volumes:
  postgres_data:
```

* **`services:`**: Define los dos servicios principales de nuestra aplicación.
    * **`backend:`**: Nuestra aplicación Python.
        * `build: .`: "Construye este servicio usando el `Dockerfile` que se encuentra en este mismo directorio".
        * `ports:`: "Crea 'túneles'. Conecta el puerto 8080 de mi PC al 8080 de la caja, y el 5678 (para depuración) al 5678".
        * `volumes: - ./backend:/app/backend`: "Sincroniza en tiempo real la carpeta `backend` de mi PC con la que está dentro de la caja. Si cambio un archivo en mi PC, el cambio se refleja al instante en la caja".
        * `env_file: - .env`: "Carga las variables de entorno (los secretos) desde mi archivo `.env`".
    * **`db:`**: Nuestro servicio de base de datos.
        * `image: postgres:14-alpine`: "No la construyas. Simplemente descarga y usa la imagen oficial y ligera de PostgreSQL 14".
        * `environment:`: "Configura la base de datos con el nombre, usuario y contraseña que están definidos en mi archivo `.env`".
        * `volumes:`: "Conecta el almacenamiento interno de la base de datos a un volumen persistente llamado `postgres_data` para que los datos no se borren. Además, ejecuta el script `init.sql` la primera vez que se cree la base de datos para crear nuestras tablas".
* **`volumes: postgres_data:`**: Declara formalmente el volumen persistente que usamos en el servicio `db`.

Con este último documento, tu proyecto queda explicado de principio a fin, desde la visión general hasta el más mínimo detalle de su ejecución.