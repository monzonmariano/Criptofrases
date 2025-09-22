# Documento 1: Visión y Arquitectura

Este documento explica la filosofía detrás del proyecto y las decisiones arquitectónicas clave que se tomaron.

## La Visión: Un Proyecto para Aprender

"Criptofrases & Autores" nació con un doble propósito:
1.  **Ser una aplicación real y funcional**, ofreciendo una herramienta de alta calidad para los entusiastas de los criptogramas.
2.  **Ser un recurso educativo de código abierto**, sirviendo como un ejemplo práctico y bien documentado de cómo construir una aplicación web moderna desde cero.

La estructura y las tecnologías fueron elegidas no solo por su eficiencia, sino también por su claridad y relevancia en el mundo del desarrollo actual, con la esperanza de que sirva como una hoja de ruta para futuros desarrolladores.

## El "Porqué" de Nuestra Tecnología

Cada pieza de nuestra arquitectura fue elegida con un propósito específico.

### ¿Por qué Python y aiohttp? (El Dilema Síncrono vs. Asíncrono)

Para una aplicación web que interactúa con APIs externas (como Gemini) y una base de datos, el rendimiento es clave.

* **Síncrono (Tradicional)**: Imagina un restaurante con un solo mesero que toma una orden, la lleva a la cocina y se queda parado esperando a que el plato esté listo antes de poder atender a otra mesa. Si la cocina tarda, todo el restaurante se detiene. Esto es "bloqueante".

* **Asíncrono (Nuestro Enfoque)**: `aiohttp` nos permite tener un mesero "asíncrono". Toma la orden, la deja en la cocina y, mientras el chef trabaja, **inmediatamente va a atender a otras mesas**. No se queda esperando. Cuando el plato está listo, una "señal" le avisa para que vaya a recogerlo. Esto es "no bloqueante".

Elegimos `aiohttp` porque nos permite manejar muchas conexiones de usuarios simultáneamente de forma muy eficiente. Las partes de nuestra aplicación que "esperan" (como las llamadas a la API de Gemini) son `async`, mientras que las partes que "piensan" intensamente (como el motor del solver) son `def` síncronas normales. Esta separación es la clave de un backend moderno y de alto rendimiento.

### ¿Por qué Docker y Docker Compose?

El objetivo es la **consistencia y la simplicidad**.
* **Consistencia**: Docker encapsula nuestra aplicación, la base de datos y todas sus dependencias en "contenedores". Esto garantiza que el proyecto funcione exactamente igual en la máquina de cualquier desarrollador, eliminando el clásico problema de "en mi máquina funciona".
* **Simplicidad**: En lugar de instalar y configurar Python, PostgreSQL y todas las librerías manualmente, todo el entorno se levanta y se detiene con un solo comando (`docker compose up`). Mantiene nuestro sistema limpio y ordenado.

### ¿Por qué PostgreSQL?

Elegimos PostgreSQL por su **robustez, escalabilidad y fiabilidad**. Es una base de datos de nivel industrial, de código abierto y extremadamente potente, perfecta para un proyecto que pretende crecer.

### ¿Por qué una Arquitectura en Capas?

Separamos el código en `api`, `core`, `services` y `crud`. Esto se llama **separación de responsabilidades**.
* **`api`**: El recepcionista. Solo recibe llamadas y las pasa.
* **`core`**: El gerente. Orquesta las operaciones, pero no hace el trabajo pesado.
* **`services`**: Los especialistas (el chef, el sommelier). Cada uno tiene una tarea muy específica.
* **`crud`**: El archivista. Es el único que sabe cómo hablar directamente con el almacén (la base de datos).

Esta estructura hace que el código sea más fácil de entender, mantener y, sobre todo, **escalar** para añadir nuevos juegos o funcionalidades en el futuro.

                 +----------------+
                 |     USUARIO    |
                 |  (Navegador)   |
                 +-------+--------+
                         |
           (Petición/Respuesta HTTP/JSON)
                         |
+------------------------v-----------------------------------------------------------+
|                                                                                    |
|                           BACKEND (Contenedor Docker)                              |
|                                                                                    |
|    +----------------+      +-----------------+      +---------------------------+  |
|    |      API       |----->|   API Manager   |----->|         Servicios         |  |
|    |    (api.py)    |      |(api_manager.py) |      | (solver, generator, etc.) |  |
|    +----------------+      +--------+--------+      +-------------+-------------+  |
|                                     |                            |                 |
|                                     |                            | (Llamada a API) |
|                                     |                            |                 |
|    +----------------+      +--------+--------+      +-------------v-------------+  |
|    |   Capa CRUD    | <----|    Database     |      |       Cliente Gemini      |  |
|    | (crud/*.py)    |      |    Manager      |      |         (gemini.py)       |  |
|    +--------+-------+      +-----------------+      +---------------------------+  |
|             |                                                                      |
|             | (Consultas SQL)                                                      |
|             |                                                                      |
+-------------|----------------------------------------------------------------------+
              |
              v
+-------------+-------------+
|                           |
|       Base de Datos       |
|   (Contenedor PostgreSQL) |
|                           |
+---------------------------+