# Usa una imagen de Python
FROM python:3.10-slim

# Establece el directorio de trabajo principal
WORKDIR /app

# Añade /app al PYTHONPATH para que Python siempre sepa buscar módulos aquí
ENV PYTHONPATH "${PYTHONPATH}:/app"

# Copia solo el archivo de requerimientos a su destino final
COPY backend/requirements.txt ./backend/

# Instala las dependencias
RUN pip install --no-cache-dir -r backend/requirements.txt

# Copia todo el código de la aplicación a su destino final
COPY backend/ ./backend/

# Ejecuta el módulo 'main' que está DENTRO del paquete 'backend'
CMD ["python", "-m", "backend.main"]