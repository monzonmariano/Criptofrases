Guía de Configuración y Uso de Docker

Este documento detalla cómo configurar, ejecutar y gestionar el entorno de desarrollo del proyecto Criptofrases utilizando Docker y Docker Compose.
1. ¿Por qué Docker?

Utilizamos Docker para encapsular la aplicación y sus dependencias (como la base de datos PostgreSQL) en "contenedores" aislados. Esto ofrece tres ventajas clave:

    Consistencia: La aplicación funciona exactamente igual en cualquier máquina que tenga Docker instalado. Se acabó el "en mi máquina funciona".

    Aislamiento: No necesitas instalar Python, PostgreSQL ni ninguna de sus librerías directamente en tu sistema operativo. Todo vive y muere dentro de los contenedores, manteniendo tu PC limpio.

    Facilidad de Uso: Todo el entorno (backend + base de datos) se levanta y se detiene con un solo comando.

2. Configuración Inicial (Paso Único)

Antes de levantar los contenedores por primera vez, necesitas realizar dos pasos de configuración.
Paso 2.1: Configurar Variables de Entorno

Las credenciales y claves de API se gestionan a través de un archivo .env que es ignorado por Git para mantener la seguridad.

    Copia el archivo de ejemplo:

    cp .env.example .env

    Abre el archivo .env con un editor de texto y rellena los valores que faltan, como GEMINI_API_KEY y una contraseña segura para DB_PASSWORD.

Paso 2.2: Generar Recursos del Solver

El solver algorítmico necesita unos archivos JSON pre-procesados que se generan a partir del diccionario de español.

    Asegúrate de tener las dependencias de Python necesarias instaladas en tu sistema local para ejecutar este script:

    pip install unidecode

    Ejecuta el script de generación desde la raíz del proyecto:

    python3 backend/services/solver_utils.py

    Esto creará los archivos es_words_by_length.json y es_letter_frequency.json dentro de backend/data/.

3. Comandos Esenciales de Docker Compose

Todos los siguientes comandos deben ejecutarse en una terminal, desde la carpeta raíz del proyecto (Criptofrases/), donde se encuentra el archivo docker-compose.yml.
Iniciar el Entorno

Este es el comando principal para iniciar todos los servicios.

docker compose up

    Primera vez o si hay cambios estructurales: Si es la primera vez que lo ejecutas, o si has modificado el Dockerfile o requirements.txt, debes añadir la opción --build:

    docker compose up --build

Detener el Entorno

Para detener los contenedores y liberar todos los recursos de tu PC (RAM, CPU, puertos):

    Ve a la terminal donde se está ejecutando docker compose up y presiona Ctrl + C.

    Luego, ejecuta:

    docker compose down

        Para borrar también la base de datos: Si quieres empezar desde una base de datos completamente limpia, usa la opción -v (¡CUIDADO! Esto es destructivo): docker compose down -v.

Ver los Logs

Si inicias los contenedores en modo "detached" (docker compose up -d), puedes ver sus logs en cualquier momento con:

docker compose logs -f backend

(Reemplaza backend por db para ver los logs de la base de datos).
Entrar a la Terminal del Contenedor (Shell Interactivo)

Esto es extremadamente útil para depurar y ver la estructura de archivos interna.

docker compose exec backend /bin/sh

Una vez dentro, puedes usar comandos de Linux como ls -la, pwd, etc. para explorar. Escribe exit para salir.