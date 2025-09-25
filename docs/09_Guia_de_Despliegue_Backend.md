# Documento 9: Guía de Despliegue del Backend (a Google Cloud Run)

Desplegar un backend puede parecer intimidante, pero es un proceso lógico. Esta guía te llevará paso a paso, explicando cada comando para que entiendas no solo *qué* hacer, sino *por qué* lo estás haciendo.

## La Estrategia: ¿Por qué Google Cloud Run?

Elegimos Cloud Run porque es como un "asistente inteligente" para nuestro contenedor de Docker.
* **Toma tu Contenedor**: Le entregas la "caja" (imagen de Docker) que ya construiste.
* **Lo Ejecuta por Ti**: Se encarga de todo lo complejo de los servidores.
* **Escala Automáticamente**: Si nadie usa tu app, se "apaga" y no cuesta nada. Si de repente tienes 1000 usuarios, crea copias automáticamente.
* **Es Seguro**: Te da una URL HTTPS por defecto.

## Paso 1: Instalar y Configurar `gcloud`

`gcloud` es tu "control remoto" para hablar con Google Cloud desde la terminal.

1.  **Instalación**: Sigue la [guía oficial](https://cloud.google.com/sdk/docs/install) para tu sistema operativo.
2.  **Configuración Inicial**: Una vez instalado, ejecuta `gcloud init`. Este asistente te guiará para:
    * Iniciar sesión con tu cuenta de Google.
    * Seleccionar tu proyecto de Google Cloud (ej: `criptofrases`).
    * Elegir una región por defecto (ej: `us-central1`).

## Paso 2: El Viaje de tu Código a la Nube

El proceso consiste en empaquetar tu código en una "caja" de Docker y enviarla al "almacén" de Google.

### A. `docker compose build backend`
* **¿Qué hace?**: Lee tu `Dockerfile` y construye la imagen de tu aplicación localmente. Es el paso de "fabricar y empaquetar la caja".

### B. `docker tag ...`
* **Comando de Ejemplo**: `docker tag criptofrases-backend us-central1-docker.pkg.dev/criptofrases/criptofrases-repo/criptofrases-backend:v1.0`
* **¿Qué hace?**: Este comando no construye nada nuevo. Simplemente le pone una **"etiqueta postal"** a la caja que ya fabricaste. Esta etiqueta es la dirección completa del almacén de Google donde la vas a enviar. Se compone de:
    * `us-central1-docker.pkg.dev`: La dirección del almacén regional.
    * `criptofrases`: El ID de tu proyecto.
    * `criptofrases-repo`: El nombre de la "estantería" (repositorio) que creaste.
    * `criptofrases-backend:v1.0`: El nombre y la versión de tu paquete.

### C. `docker push ...`
* **Comando de Ejemplo**: `docker push us-central1-docker.pkg.dev/criptofrases/criptofrases-repo/criptofrases-backend:v1.0`
* **¿Qué hace?**: Es el camión de reparto. Toma la caja con la etiqueta postal correcta y la **envía por Internet** hasta el almacén de Google (Artifact Registry).

## Paso 3: Poner el Backend en Marcha

Una vez que tu caja está en el almacén de Google, le das la orden a Cloud Run para que la recoja y la ponga a funcionar.

* **Comando de Ejemplo**:
  ```bash
  gcloud run deploy criptofrases-backend \
    --image us-central1-docker.pkg.dev/criptofrases/criptofrases-repo/criptofrases-backend:v1.0 \
    --set-env-vars="DB_URL=...,GEMINI_API_KEY=..." \
    --region us-central1 \
    --allow-unauthenticated

        ¿Qué hace cada parte?:

        gcloud run deploy criptofrases-backend: "Oye, Cloud Run, quiero desplegar un servicio llamado criptofrases-backend."

        --image ...: "Usa la caja que está en esta dirección exacta del almacén."

        --set-env-vars="...": "Cuando enciendas la caja, pégale estas 'notas adhesivas' (variables de entorno) para que sepa cómo conectarse a la base de datos y a la API de Gemini." Esta es la parte más crítica.

        --region ...: "Ponlo a funcionar en los servidores de esta región."

        --allow-unauthenticated: "Permite que la puerta principal de la tienda esté abierta al público (para que tu frontend pueda entrar)."

Anexo: Entendiendo la Facturación de Google

Google te pide vincular una cuenta de facturación para activar APIs como una garantía, similar a la tarjeta de crédito que dejas en un hotel. No te cobrarán nada mientras te mantengas dentro del generoso nivel gratuito de servicios como Cloud Run. Si el proyecto se vuelve viral, se te cobrará por el uso que exceda ese nivel gratuito. Es un sistema para prevenir abusos y permitir que los proyectos escalen si es necesario.