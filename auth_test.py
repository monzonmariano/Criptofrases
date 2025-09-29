# auth_test.py
import os
import google.auth
from google.auth.transport.requests import Request

# Apuntamos al archivo de clave que ya tienes
os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = 'gcloud-service-key.json'

print("--- Iniciando Prueba de Autenticación Definitiva ---")

try:
    # Definimos los permisos (scopes) que necesitamos
    scopes = ['https://www.googleapis.com/auth/cloud-platform']
    
    # Obtenemos las credenciales del archivo
    credentials, project_id = google.auth.default(scopes=scopes)
    
    # Forzamos la actualización del token
    credentials.refresh(Request())

    print("\n✅ ¡Autenticación Exitosa!")
    print(f"   ID del Proyecto: {project_id}")
    print(f"   Email de la Cuenta de Servicio: {credentials.service_account_email}")
    print(f"   El Token es Válido: {credentials.valid}")
    print(f"   Permisos (Scopes) del Token: {credentials.scopes}")

except Exception as e:
    print(f"\n❌ FALLÓ LA AUTENTICACIÓN.")
    print(f"   Error Detallado: {e}")

print("\n--- Fin de la Prueba ---")