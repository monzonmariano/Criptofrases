# backend/services/gemini.py (Versión Final con Logging de Payload)

import json
import os
import aiohttp
from dotenv import load_dotenv
from google.oauth2 import service_account
from google.auth.transport.requests import Request
from backend.logger_config import log
from .utils import retry_with_exponential_backoff

# Cargar variables de entorno
load_dotenv()

# --- Constantes ---
# Usamos los modelos estables 1.5 con la estructura de URL global
PRO_API_URL = "https://aiplatform.googleapis.com/v1/publishers/google/models/gemini-1.5-pro:generateContent"
FLASH_API_URL = "https://aiplatform.googleapis.com/v1/publishers/google/models/gemini-1.5-flash:generateContent"

async def _get_auth_headers():
    key_path = os.getenv('GOOGLE_APPLICATION_CREDENTIALS')
    if not key_path:
        raise ValueError("La variable de entorno GOOGLE_APPLICATION_CREDENTIALS no está definida.")
    try:
        scopes = ['https://www.googleapis.com/auth/cloud-platform']
        creds = service_account.Credentials.from_service_account_file(key_path, scopes=scopes)
        creds.refresh(Request())
        log.info("Autenticación con archivo de clave de servicio exitosa.")
        return { 'Authorization': f'Bearer {creds.token}', 'Content-Type': 'application/json' }
    except Exception as e:
        log.error(f"FALLO CRÍTICO al cargar las credenciales desde {key_path}: {e}")
        raise e

@retry_with_exponential_backoff(max_retries=3)
async def _call_gemini_api_internal(payload: dict, url: str):
    try:
        headers = await _get_auth_headers()
        params = {}
        timeout = aiohttp.ClientTimeout(total=120)
        
        # --- LÍNEA DE DEPURACIÓN AÑADIDA ---
        # Imprimimos el payload exacto que se va a enviar.
        log.info(f"Enviando payload a Gemini: {json.dumps(payload)}")
        
        async with aiohttp.ClientSession(timeout=timeout) as session:
            async with session.post(url, headers=headers, params=params, data=json.dumps(payload)) as response:
                response_text = await response.text()
                if response.status != 200:
                    log.error(f"Error {response.status} de la API de Gemini: {response_text}")
                response.raise_for_status()
                result = json.loads(response_text)
                if 'promptFeedback' in result and 'blockReason' in result['promptFeedback']:
                    return "Respuesta bloqueada por seguridad.", 500
                if not result.get('candidates'):
                    return "Respuesta vacía de la IA.", 500
                text = result['candidates'][0].get('content', {}).get('parts', [{}])[0].get('text', '')
                return text, 200
    except Exception as e:
        log.error(f"Fallo en _call_gemini_api_internal: {e}")
        raise e

# --- USAREMOS PAYLOADS MINIMALISTAS PARA DESCARTAR ERRORES ---
async def find_author(phrase: str):
    full_prompt = f"¿Quién es el autor de la frase: '{phrase}'? Responde solo con el nombre completo."
    payload = { "contents": [{"role": "user", "parts": [{"text": full_prompt}]}] }
    try:
        author, status = await _call_gemini_api_internal(payload, FLASH_API_URL)
        return author.strip(), status
    except Exception as e:
        log.error(f"Excepción en find_author: {e}")
        return "Error al contactar la API de IA.", 500

async def generate_phrase_by_theme(theme: str):
    # Usaremos un prompt muy simple para la prueba, para evitar cualquier problema con el texto.
    prompt = f"Escribe una frase sobre el tema de {theme}."
    payload = { "contents": [{"role": "user", "parts": [{"text": prompt}]}] }
    try:
        phrase, status = await _call_gemini_api_internal(payload, FLASH_API_URL)
        if status != 200: return phrase, status
        cleaned_phrase = phrase.strip().strip('"')
        return cleaned_phrase, status
    except Exception as e:
        log.error(f"Excepción en generate_phrase_by_theme: {e}")
        return "Error al contactar la API de IA.", 500