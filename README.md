# Proyecto: Criptofrases & Autores v1.0

¡Bienvenido a Criptofrases & Autores! Este es un proyecto full-stack diseñado no solo como una aplicación funcional para resolver y generar criptogramas, sino también como un recurso de aprendizaje de código abierto para desarrolladores.

El backend está construido con una arquitectura moderna, modular y completamente contenerizada, sirviendo como una base escalable para futuros juegos y servicios.

## ✨ Visión del Proyecto

El objetivo principal es crear una plataforma real y escalable que sea:
* **Funcional**: Ofrece herramientas potentes y entretenidas para los entusiastas de los criptogramas.
* **Educativa**: Sirve como un ejemplo claro y bien documentado de cómo construir una aplicación web moderna, desde el backend hasta el frontend.
* **Abierta**: Fomenta el aprendizaje y la colaboración, con una estructura de código diseñada para ser estudiada, reutilizada y mejorada por la comunidad.

## 🚀 Funcionalidades Principales (Backend v1.0)

* **Crypto Solver**: Resuelve criptogramas de sustitución complejos usando un algoritmo de backtracking enriquecido con un modelo estadístico de lenguaje (n-gramas).
* **Crypto Generator**: Genera criptogramas únicos a partir de frases sobre temas específicos (filosofía, tecnología, etc.), utilizando la API de Google Gemini para la creatividad y un motor local para la encriptación.
* **Author Finder**: Identifica al autor probable de una frase célebre usando la API de Google Gemini.
* **Persistencia de Datos**: Todas las interacciones se guardan en una base de datos PostgreSQL.
* **API Completa**: Seis endpoints bien definidos para gestionar todo el ciclo de vida de los datos (Crear, Leer, Borrar).

## 🛠️ Arquitectura Tecnológica

| Componente | Tecnología / Librería | Propósito |
| :--- | :--- | :--- |
| **Backend** | Python 3.10, aiohttp | Servidor web asíncrono de alto rendimiento. |
| **Base de Datos** | PostgreSQL 14 | Almacenamiento de datos robusto y persistente. |
| **IA & Servicios** | Google Gemini API | Asistente para tareas creativas y de lenguaje natural. |
| **Contenerización** | Docker & Docker Compose | Orquestación y reproducibilidad del entorno. |

## 🏁 Puesta en Marcha

Para levantar el entorno de desarrollo, el primer paso es clonar el repositorio. Para una guía detallada y paso a paso, por favor consulta nuestra **[Guía de Puesta en Marcha](docs/02_Puesta_en_Marcha.md)**.

*(Nota: En el futuro, aquí crearemos las guías detalladas)*

## 📄 Licencia

Este proyecto está licenciado bajo la **GNU General Public License v3.0**. Esto asegura que el proyecto y cualquiera de sus derivados siempre permanecerán de código abierto.