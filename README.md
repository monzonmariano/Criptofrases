# Criptofrases & Logic Hub (v1.0)

¡Bienvenido a Criptofrases & Logic Hub! Una aplicación web completa y de código abierto diseñada para resolver, generar y disfrutar de juegos de lógica, empezando por los criptogramas.

[cite_start]Este proyecto sirve como un ejemplo práctico y profundamente documentado de cómo construir una aplicación web moderna, desde un backend asíncrono con Python y Docker hasta un frontend interactivo con React[cite: 4, 11].

## Características Principales

* [cite_start]**Solver de Criptogramas Avanzado**: Utiliza un modelo estadístico del español (n-gramas) y un algoritmo de backtracking para encontrar las soluciones más probables a cualquier criptograma de sustitución[cite: 14].
* **Hub de Juegos Escalable**: Una interfaz centralizada diseñada para incorporar fácilmente nuevos puzzles en el futuro (Sudoku, Pictologic, etc.).
* **Generador Dual de Criptogramas**:
    * [cite_start]**Generación por IA**: Crea frases únicas sobre diversos temas usando la API de Google Gemini[cite: 2].
    * **Creación Personalizada**: Permite a los usuarios encriptar sus propias frases.
* **Historial de Actividad**: Guarda un registro de los criptogramas resueltos y creados por el usuario, con una vista de detalles completa.
* [cite_start]**Arquitectura Profesional**: Construido con Python `aiohttp` para un alto rendimiento, `PostgreSQL` para una base de datos robusta, y `Docker` para una puesta en marcha simple y consistente[cite: 4, 11].
* [cite_start]**Frontend Moderno**: Interfaz de usuario reactiva y pulida construida con `React` y `Tailwind CSS`, incluyendo animaciones suaves y una experiencia de usuario cuidada[cite: 15].

## Documentación Esencial

Hemos puesto un gran esfuerzo en documentar cada aspecto del proyecto.

* **Visión y Arquitectura General**: [docs/01_Vision_y_Arquitectura.md](./docs/01_Vision_y_Arquitectura.md)
* **Guía de Puesta en Marcha (¡Empieza aquí!)**: [docs/02_Puesta_en_Marcha.md](./docs/02_Puesta_en_Marcha.md)
* **Guía del Frontend (Cómo "Piensa" React)**: [docs/07_Guia_del_Frontend.md](./docs/07_Guia_del_Frontend.md)
* **Referencia Completa de la API**: [docs/05_API_Endpoints.md](./docs/05_API_Endpoints.md)
* **Guía de la Base de Datos**: [docs/GUIA_BASE_DE_DATOS.md](./docs/GUIA_BASE_DE_DATOS.md)

## Puesta en Marcha Rápida

1.  **Clona el repositorio**: `git clone <url-del-repositorio>`
2.  **Configura tus credenciales**: `cp .env.example .env` y edita el archivo `.env`.
3.  **Prepara los datos del solver**: `python3 consolidate_corpus.py` y `python3 backend/services/solver_utils.py`.
4.  **Levanta todo el entorno**: `docker compose up --build`.

[cite_start]Para más detalles, consulta la **[Guía de Puesta en Marcha](./docs/02_Puesta_en_Marcha.md)**[cite: 1].