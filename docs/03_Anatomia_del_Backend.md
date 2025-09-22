# Documento 3: Anatomía del Proyecto

Un recorrido por la estructura de carpetas y archivos del proyecto completo para entender el rol de cada pieza.

```
Criptofrases/
├── docs/                     # (Esta misma carpeta de documentación)
├── backend/                  # Contenedor de toda la lógica de la aplicación Python.
│   ├── Dockerfile            # Instrucciones para construir la imagen Docker del backend.
│   ├── requirements.txt      # Lista de librerías Python necesarias.
│   ├── api.py                # La puerta de entrada de las peticiones web (endpoints).
│   ├── main.py               # Inicia el servidor web asíncrono.
│   ├── logger_config.py      # Configuración centralizada de los logs.
│   │
│   ├── core/                 # El "cerebro" orquestador.
│   │   ├── api_manager.py
│   │   ├── database_manager.py
│   │   ├── db.py
│   │   └── crud/
│   │       ├── create.py
│   │       ├── read.py
│   │       ├── update.py
│   │       └── delete.py
│   │
│   ├── data/                 # Todos los datos estáticos y generados.
│   │   ├── corpus.txt
│   │   ├── frecuencia_corpus.txt
│   │   ├── corpus_sources/
│   │   └── *.json
│   │
│   └── services/             # Los "especialistas" que hacen el trabajo pesado.
│       ├── crypto_solver.py
│       ├── crypto_generator.py
│       ├── author_finder.py
│       └── gemini.py
│
├── frontend/                 # (Futuro) Contenedor para la aplicación de React.
│
├── database/                 # Scripts de configuración de la base de datos.
│   └── init.sql            # Script inicial para crear las tablas.
│
├── .env                      # (Local) Archivo con tus secretos y credenciales.
├── .env.example              # Plantilla de ejemplo para el archivo .env.
├── docker-compose.yml        # El "director de orquesta" de Docker.
├── consolidate_corpus.py     # Script para unificar los textos del corpus.
├── generate_test_crypto.py   # Script para generar criptogramas de prueba.
├── LICENSE                   # La licencia de código abierto del proyecto.
└── README.md                 # La portada y resumen del proyecto.
```

## El Flujo de una Petición

Para entender cómo interactúan estas piezas, sigamos el viaje de una petición a `/api/solve`:

1.  **`docker-compose.yml`** define y levanta los dos servicios principales: `backend` y `db`, asegurándose de que puedan comunicarse entre sí.
2.  **`main.py`** (ejecutado por el `Dockerfile`) arranca el servidor `aiohttp` y le dice que las reglas de enrutamiento están en `api.py`.
3.  **`api.py`** recibe la petición `POST` en `/api/solve`. Su única misión es llamar a la función correspondiente en `api_manager.py`, pasándole los datos.
4.  **`api_manager.py`** actúa como un director de orquesta. Recibe la petición y sabe exactamente a qué especialista llamar. En este caso, llama a la función `solve_and_save` dentro de `crypto_solver.py`.
5.  **`crypto_solver.py`** realiza todo el trabajo pesado de resolución.
6.  Una vez que tiene un resultado, `crypto_solver.py` llama a `database_manager.py` para guardar la operación.
7.  **`database_manager.py`** delega la tarea de escritura a la función específica en `crud/create.py`.
8.  **`crud/create.py`** utiliza `db.py` para obtener una conexión y ejecuta la consulta SQL final en la base de datos `db` definida en `docker-compose.yml`.
9.  El resultado viaja de vuelta por el mismo camino hasta `api.py`, que lo formatea como una respuesta JSON y se la envía al usuario.

Esta arquitectura asegura que cada archivo tenga una única y clara responsabilidad, haciendo el sistema robusto y fácil de entender.