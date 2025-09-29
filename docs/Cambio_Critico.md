## Documento: Guía de Corrección de Seguridad y Autenticación

Este documento resume los pasos críticos que se tomaron para solucionar una vulnerabilidad de seguridad y robustecer el sistema de autenticación del backend.

1. Detección de la Vulnerabilidad de Seguridad

    Problema: Se detectó que, en caso de un error en las llamadas a APIs externas (Google Gemini) o a la base de datos, el backend enviaba el mensaje de error completo al frontend. Esto exponía información sensible, como claves de API y detalles de la conexión a la base de datos.

    Causa Raíz: Los bloques try...except Exception as e en la capa de la API (api.py) y en los servicios (gemini.py) usaban str(e) para generar la respuesta de error, propagando la información sensible.

2. "Blindaje" del Backend

    Solución: Se modificaron todos los manejadores de excepciones en api.py y gemini.py.

    Nuevo Flujo:

        Captura: El bloque except ahora captura cualquier excepción.

        Registro: El error completo y detallado se registra en los logs del servidor para que el desarrollador pueda depurarlo.

        Respuesta Segura: Se devuelve al usuario un objeto JSON con un mensaje de error genérico y seguro (ej: "Ocurrió un error interno"), sin filtrar ningún detalle técnico.

3. Transición a un Modelo de Autenticación de Servidor Seguro

    Problema: El uso de una API Key para autenticar un servicio de backend (Cloud Run) contra otra API de Google no es la práctica más segura y estaba siendo bloqueado.

    Solución: Se migró a un modelo de autenticación basado en Cuentas de Servicio, que es el estándar de Google para la comunicación segura entre servicios.

    Pasos de Implementación:

        Creación de Identidad: Se creó una nueva cuenta de servicio dedicada (criptofrases-runner) para darle una identidad única al backend.

        Asignación de Permisos (IAM): Se le otorgó el rol Vertex AI User (roles/aiplatform.user) para permitirle acceder a los servicios de IA.

        Habilitación de APIs: Se habilitaron las APIs Vertex AI API y Generative Language API en el proyecto de Google Cloud.

        Actualización del Código: Se modificó gemini.py para usar la librería google-auth, que detecta automáticamente el entorno de Google Cloud y se autentica usando la cuenta de servicio, eliminando la necesidad de una API key en producción.

        Actualización de Dependencias: Se añadieron google-auth y requests al archivo requirements.txt.

4. Mejora del Entorno de Desarrollo Local

    Problema: La autenticación con cuenta de servicio no funcionaba de forma nativa en un contenedor de Docker local.

    Solución: Se implementó un método de autenticación local robusto usando un archivo de clave de servicio JSON.

    Pasos de Implementación:

        Se generó y descargó un archivo de clave JSON para la cuenta de servicio criptofrases-runner.

        Se guardó el archivo como gcloud-service-key.json y se añadió al .gitignore.

        Se modificó docker-compose.yml para "montar" este archivo de clave dentro del contenedor.

        Se estableció la variable de entorno GOOGLE_APPLICATION_CREDENTIALS para que la librería google-auth encontrara y usara automáticamente esta clave para la autenticación local.