Cryptograms & Authors

Este proyecto es una herramienta web interactiva impulsada por inteligencia artificial (IA) diseñada para resolver, generar y encontrar autores de criptogramas. La aplicación ofrece una interfaz de usuario limpia y moderna, permitiendo a los usuarios interactuar con tres funcionalidades principales y mantener un historial de sus consultas.
Características Principales

    Resolver Criptogramas: Descifra mensajes encriptados, aceptando pistas para mejorar la precisión de la IA.

    Encontrar Autor: Identifica el autor de una frase o cita conocida utilizando el poder de los modelos de lenguaje.

    Generar Criptogramas: Convierte un texto original en un nuevo criptograma único, listo para ser compartido y resuelto.

    Historial de Interacciones: Almacena y muestra un historial de todas las consultas y sus resultados, permitiendo a los usuarios revisar su actividad.

Tecnologías Utilizadas
Frontend

    React: Biblioteca de JavaScript para construir la interfaz de usuario de manera modular y eficiente.

    Tailwind CSS: Framework de CSS para un estilizado rápido y responsivo sin salir del código HTML/JSX.

    Firebase Authentication: Maneja el inicio de sesión de los usuarios (en modo anónimo) para asociar las interacciones a una sesión única.

Backend

    Python: Lenguaje de programación principal para el servidor.

    Aiohttp: Framework asíncrono para manejar las peticiones web de manera eficiente.

    PostgreSQL: Base de datos relacional para almacenar el historial de interacciones de los usuarios.

    Google Gemini API: El modelo de IA utilizado para la lógica de resolución, generación y búsqueda de autores.

Estructura del Proyecto

El proyecto sigue una arquitectura organizada y limpia, con una clara separación de responsabilidades entre el frontend y el backend.

    frontend/: Contiene todo el código de la interfaz de usuario, organizado en componentes reutilizables (components/) y funciones de utilidad (utils/).

    backend/: Implementa el servidor y la lógica de negocio. Sigue un patrón de arquitectura hexagonal, donde el api.py se encarga de las rutas, el api_manager.py orquesta la lógica, y los services/ contienen la lógica específica de cada funcionalidad (resolver, generar, encontrar). Las operaciones de base de datos se manejan a través del gestor (database_manager.py) y las operaciones atómicas (crud/).

Instalación y Uso

Sigue estos pasos para configurar y ejecutar el proyecto en tu entorno local.

    Clonar el repositorio:

    git clone [https://github.com/tu-usuario/nombre-del-repo.git](https://github.com/tu-usuario/nombre-del-repo.git)
    cd nombre-del-repo

    Configurar el Backend:

        Crea un entorno virtual de Python.

        Instala las dependencias.

        Crea un archivo .env en el directorio backend/ con tus credenciales de base de datos.

        Ejecuta el servidor.

    Configurar el Frontend:

        Navega al directorio del frontend.

        Instala las dependencias de Node.js.

        Inicia la aplicación de desarrollo.

    Acceder a la Aplicación:

        Una vez que ambos servidores (backend y frontend) estén en funcionamiento, abre tu navegador y visita http://localhost:8080 (o el puerto configurado).

Contacto

Para cualquier pregunta o sugerencia, por favor, abre un "issue" en este repositorio. ¡Agradecemos tus contribuciones!
