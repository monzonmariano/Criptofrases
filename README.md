Proyecto: Criptofrases & Autores
1. Visión General

Criptofrases & Autores es una aplicación web interactiva diseñada como una herramienta completa para entusiastas de los criptogramas y las frases célebres. El backend está construido con una arquitectura moderna, modular y completamente contenerizada con Docker.
Funcionalidades Principales

    Resolver Criptogramas: Utiliza un potente algoritmo de backtracking en Python para resolver criptogramas de sustitución numérica.

    Generar Criptogramas: Convierte texto en un nuevo criptograma numérico usando la API de Google Gemini.

    Encontrar Autor: Identifica al autor probable de una frase célebre usando la API de Google Gemini.

    Historial de Actividad: Persiste todas las interacciones en una base de datos PostgreSQL, asociadas a un ID de usuario.

2. Arquitectura Tecnológica

Componente
	

Tecnología / Librería
	

Propósito

Backend
	

Python 3.10, aiohttp
	

Servidor web asíncrono de alto rendimiento.

Base de Datos
	

PostgreSQL 14
	

Almacenamiento de datos robusto y persistente.

IA & Servicios
	

Google Gemini API
	

Asistente para tareas de lenguaje natural.

Contenerización
	

Docker & Docker Compose
	

Aislamiento y orquestación del entorno de desarrollo.

Frontend
	

React.js, Tailwind CSS
	

(Actualmente en desarrollo)
3. Estructura Detallada del Proyecto

La estructura está diseñada para una máxima separación de responsabilidades, facilitando la escalabilidad y el mantenimiento.
Estructura en el PC (Host) vs. Contenedor Docker

PC (Host)
	

Contenedor (backend-1)
	

Descripción de la Carpeta (Host)

Criptofrases/
	

/app/
	

Raíz del proyecto. Contiene archivos de configuración global.

├── .env
	

(No se copia)
	

Archivo local con credenciales y secretos (API Keys, contraseñas de BD).

├── docker-compose.yml
	

(Configura el contenedor)
	

Plano Maestro: Orquesta los servicios de backend y base de datos.

└── backend/
	

└── backend/
	

Paquete Principal de Python: Contiene toda la lógica de la aplicación.

    ├── Dockerfile
	

    ├── Dockerfile
	

Plano del Backend: Instrucciones para construir la imagen de Python.

    ├── main.py
	

    ├── main.py
	

Punto de Entrada: Inicia el servidor aiohttp.

    ├── api.py
	

    ├── api.py
	

Capa de API: Define las rutas web (endpoints) y las conecta con los gestores.

    ├── core/
	

    ├── core/
	

Núcleo de la Lógica: Orquesta las operaciones de negocio.

    │   ├── api_manager.py
	

    │   ├── api_manager.py
	

Director de Orquesta: Delega tareas a los servicios y gestores.

    │   └── database_manager.py
	

    │   └── database_manager.py
	

Gestor de BD: Centraliza la lógica de acceso a la base de datos, llamando al CRUD.

    │   └── crud/
	

    │   └── crud/
	

Capa CRUD: Contiene las operaciones básicas (Crear, Leer, Actualizar, Borrar).

    ├── data/
	

    ├── data/
	

Recursos Estáticos: Almacena los diccionarios y archivos JSON del solver.

    └── services/
	

    └── services/
	

Herramientas Especializadas: Módulos con lógica específica.

        ├── crypto_solver.py
	

        ├── crypto_solver.py
	

Implementa el algoritmo de backtracking para resolver criptogramas.

        ├── gemini.py
	

        ├── gemini.py
	

Implementa las llamadas a la API de Google Gemini.

        └── ...
	

        └── ...
	

Otros servicios como author_finder.py, crypto_generator.py, etc.
4. Puesta en Marcha Rápida

Para instrucciones detalladas sobre cómo configurar y ejecutar el entorno, por favor consulta las siguientes guías:

    Guía de Docker (DOCKER_GUIDE.md): Pasos para construir, ejecutar e interactuar con los contenedores.

    Guía de Base de Datos (DATABASE_GUIDE.md): Cómo configurar la base de datos y su estructura.