# Documento 11: Hoja de Ruta del Despliegue (Checklist)

Esta es una guía rápida para desplegar el proyecto completo. Usa los documentos 09 y 10 para una explicación detallada de cada paso.

### Fase 1: Base de Datos
- [ ] Crear una cuenta en [Neon.tech](https://neon.tech/).
- [ ] Crear un nuevo proyecto de base de datos.
- [ ] Copiar la URL de conexión.
- [ ] Ejecutar el script de `database/init.sql` en el editor SQL de Neon.

### Fase 2: Backend (Google Cloud)
- [ ] Instalar y configurar `gcloud` con `gcloud init`.
- [ ] Habilitar la facturación en el proyecto de Google Cloud.
- [ ] Activar la API de "Artifact Registry".
- [ ] Crear un repositorio en Artifact Registry con `gcloud artifacts repositories create ...`.
- [ ] Construir la imagen de Docker: `docker compose build backend`.
- [ ] Etiquetar la imagen para Google: `docker tag ...`.
- [ ] Subir la imagen a Google: `docker push ...`.
- [ ] Desplegar en Cloud Run con `gcloud run deploy ...`, asegurándose de pasar la `DB_URL` de Neon y la `GEMINI_API_KEY` como variables de entorno.
- [ ] Copiar la URL final del servicio de backend.

### Fase 3: Frontend (Netlify)
- [ ] Modificar `frontend/src/services/apiClient.js` y poner la URL del backend de Cloud Run.
- [ ] Subir los cambios a GitHub: `git push`.
- [ ] Crear un nuevo sitio en Netlify desde el repositorio de GitHub.
- [ ] Configurar el despliegue (`Base directory: frontend`, `Build command: npm run build`, `Publish directory: dist`).
- [ ] Desplegar el sitio.
- [ ] (Opcional) Cambiar el nombre del sitio en Netlify a uno personalizado.

¡Felicidades, tu aplicación está en línea!