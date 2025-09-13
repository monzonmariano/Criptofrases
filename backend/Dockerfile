# Paso 1: Usar una imagen oficial de Python como base.
# La versión "slim" es más ligera, ideal para producción.
FROM python:3.10-slim

# Paso 2: Establecer un directorio de trabajo dentro del contenedor.
# Todas las acciones siguientes se harán dentro de /app.
WORKDIR /app

# Paso 3: Copiar el archivo de requerimientos y luego instalar las dependencias.
# Se hace en dos pasos para aprovechar el cache de Docker.
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Paso 4: Copiar todo el código de tu carpeta 'backend' al directorio /app del contenedor.
COPY . .

# Paso 5: Exponer el puerto en el que corre tu aplicación aiohttp.
# Esto es como "abrir una ventana" en el contenedor para que se pueda acceder desde afuera.
EXPOSE 8080

# Paso 6: El comando que se ejecutará cuando el contenedor se inicie.
# Asumo que tu archivo principal se llama main.py. Si no, cámbialo.
CMD ["python", "main.py"]