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

Una vez que tu caja está en el almacén de Google, le das la orden a Cloud Run para que la recoja y la ponga a funcionar.

3.1: (IMPORTANTE) Sube tu Clave de Servicio a Secret Manager
Para el desarrollo local, usamos un archivo gcloud-service-key.json. Nunca debes subir este archivo a Git. Para que Cloud Run lo use de forma segura en producción, debemos subirlo al "administrador de contraseñas" de Google Cloud (Secret Manager).

En la consola de Google Cloud, ve a la sección "Secret Manager".

Haz clic en "Crear Secreto". Dale un nombre (ej: gemini-service-key).

Sube el contenido (copia y pega el texto) de tu archivo gcloud-service-key.json como el "valor" del secreto.

Ve a la pestaña "Permisos" del nuevo secreto y dale permiso a tu cuenta de servicio (criptofrases-runner@...) para que pueda "Acceder" a él.

3.2: Despliega en Cloud Run
Ahora, en el comando de despliegue, le diremos a Cloud Run que use nuestra cuenta de servicio y que "monte" ese secreto como un archivo.

Comando de Despliegue (Versión Segura):

Bash

gcloud run deploy criptofrases-backend \
  --image us-central1-docker.pkg.dev/criptofrases/criptofrases-repo/criptofrases-backend:v1.1 \
  --service-account criptofrases-runner@criptofrases.iam.gserviceaccount.com \
  --set-env-vars="DB_URL=TU_URL_DE_BASE_DE_DATOS_NEON,GOOGLE_APPLICATION_CREDENTIALS=/app/gcloud-service-key.json" \
  --update-secrets="/app/gcloud-service-key.json=gemini-service-key:latest" \
  --region us-central1 \
  --allow-unauthenticated
¿Qué hace cada parte nueva?:

gcloud run deploy ...: "Oye, Cloud Run, quiero desplegar criptofrases-backend."

--image ...: "Usa la caja que está en esta dirección exacta del almacén."

--service-account ...: "Ejecuta este contenedor usando la identidad de criptofrases-runner, la cual ya tiene los permisos de IAM correctos (como Vertex AI User)."

--set-env-vars="...": "Pasa la URL de la base de datos como de costumbre. Y lo más importante, dile a nuestro código Python (que usa os.getenv) que la clave de credenciales se encontrará en la ruta /app/gcloud-service-key.json."

--update-secrets=...: "Esta es la magia. Le dice a Cloud Run: 'Toma el secreto llamado gemini-service-key de Secret Manager y haz que esté disponible (móntalo) dentro del contenedor en la ruta /app/gcloud-service-key.json.'"

--region ...: "Ponlo a funcionar en los servidores de esta región."

--allow-unauthenticated: "Permite que la puerta principal esté abierta al público (para que tu frontend pueda entrar)."

Esto elimina por completo la antigua GEMINI_API_KEY y la reemplaza por un método de autenticación de servidor mucho más seguro y robusto.


Anexo: Entendiendo la Facturación de Google

Google te pide vincular una cuenta de facturación para activar APIs como una garantía, similar a la tarjeta de crédito que dejas en un hotel. No te cobrarán nada mientras te mantengas dentro del generoso nivel gratuito de servicios como Cloud Run. Si el proyecto se vuelve viral, se te cobrará por el uso que exceda ese nivel gratuito. Es un sistema para prevenir abusos y permitir que los proyectos escalen si es necesario.