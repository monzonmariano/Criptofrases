# Documento 2: Guía de Puesta en Marcha

Esta es una guía completa y unificada para configurar y ejecutar el proyecto desde cero.

## Requisitos Previos

Asegúrate de tener instalados en tu sistema:
* [Docker](https://www.docker.com/products/docker-desktop/)
* [Python 3.10+](https://www.python.org/downloads/) (solo para ejecutar los scripts de generación de datos)

## Paso 1: Clonar el Repositorio

Abre una terminal y clona el proyecto en tu máquina local.

```bash
git clone <url-del-repositorio>
cd Criptofrases
```

## Paso 2: Configurar las Variables de Entorno

Las credenciales y claves de API se gestionan a través de un archivo `.env` que es ignorado por Git para mantener la seguridad.

1.  Copia el archivo de ejemplo:
    ```bash
    cp .env.example .env
    ```
2.  Abre el archivo `.env` con un editor de texto y rellena los valores que faltan:
    * `GEMINI_API_KEY`: Tu clave de la API de Google Gemini.
    * `DB_PASSWORD`: Una contraseña segura que elijas para la base de datos.
    * *Los demás valores suelen funcionar bien por defecto para un entorno local.*

## Paso 3: Preparar los Datos del Solver

El motor del solver necesita una serie de archivos JSON pre-procesados para funcionar.

1.  **Instalar Dependencias del Script**: Instala la única librería que necesita el script de generación.
    ```bash
    pip install unidecode
    ```
2.  **Consolidar el Corpus de Frecuencia**: Este script une todos los textos de ejemplo en un solo archivo maestro.
    ```bash
    python3 consolidate_corpus.py
    ```
3.  **Generar los Recursos Finales**: Este script lee los corpus maestros y genera todos los archivos JSON (listas de palabras, n-gramas, etc.).
    ```bash
    python3 backend/services/solver_utils.py
    ```
    Al finalizar, tu carpeta `backend/data/` estará poblada con todos los archivos necesarios.

## Paso 4: ¡Iniciar la Aplicación!

Con todo configurado, levanta el entorno completo con un solo comando.

```bash
docker compose up --build
```
* `--build`: Es importante añadir esta opción la primera vez, o cada vez que modifiques el `Dockerfile` o `requirements.txt`, para que Docker reconstruya la imagen de tu aplicación.

El servidor de backend estará disponible en `http://localhost:8080` y la base de datos en `localhost:5433`. ¡Ya estás listo para empezar a usar la API!

## Paso 5: Verificación

Para confirmar que todo funciona correctamente, puedes lanzar una petición simple a la API para ver un historial de usuario (aunque estará vacío al principio).

```bash
curl -X GET http://localhost:8080/api/history?user_id=test_inicial

Si recibes una respuesta como {"history": []}, significa que tu backend está en línea, funcionando y conectado correctamente a la base de datos. ¡Felicidades!