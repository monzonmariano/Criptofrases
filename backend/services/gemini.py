#------------------------ Archivo: "gemini.py" -----------------------------------
#----------------------- Este archivo se encargará de realizar las peticiones a la API de Gemini 

# backend/services/gemini.py

import json
import re
from backend.logger_config import log
import os
import aiohttp
from dotenv import load_dotenv
from .utils import retry_with_exponential_backoff

# Cargar las variables de entorno
load_dotenv()

# --- Constantes ---
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
PRO_API_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent"
FLASH_API_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent"


@retry_with_exponential_backoff(max_retries=3)
async def _call_gemini_api_internal(payload: dict, url: str):
    if not GEMINI_API_KEY:
        raise ValueError("API Key de Gemini no configurada.")
    headers = {'Content-Type': 'application/json'}
    params = {'key': GEMINI_API_KEY}
    # Aumentamos el timeout para esta tarea compleja a 2 minutos
    timeout = aiohttp.ClientTimeout(total=120) 
    async with aiohttp.ClientSession(timeout=timeout) as session:
        async with session.post(url, headers=headers, params=params, data=json.dumps(payload)) as response:
            response_text = await response.text()
            if response.status != 200:
                log.error(f"Error {response.status} de la API: {response_text}")
            response.raise_for_status()
            result = json.loads(response_text)
            
            if 'promptFeedback' in result and 'blockReason' in result['promptFeedback']:
                reason = result['promptFeedback']['blockReason']
                log.error(f"La solicitud fue bloqueada por seguridad: {reason}")
                return f"Respuesta bloqueada por seguridad: {reason}", 500

            if not result.get('candidates'):
                log.warning("La respuesta de la API no contiene 'candidates'.")
                return "Respuesta vacía de la IA.", 500

            candidate = result['candidates'][0]
            if 'finishReason' in candidate and candidate['finishReason'] != 'STOP':
                reason = candidate['finishReason']
                log.error(f"La respuesta fue detenida por la razón: {reason}")
                return f"Respuesta bloqueada por: {reason}", 500
                
            text = candidate.get('content', {}).get('parts', [{}])[0].get('text', '')
            return text, 200

async def solve_cryptogram_holistically(cryptogram: str, clues: str):
    """
    Resuelve un criptograma complejo en una sola llamada, pidiendo a la IA
    que siga un proceso de razonamiento lógico.
    """
    prompt = f"""
Actúa como un experto criptógrafo de clase mundial. Tu tarea es resolver el siguiente criptograma de sustitución simple. Debes seguir un proceso de razonamiento lógico y metódico para encontrar la solución.

**Criptograma a resolver:**
`{cryptogram}`

**Pistas conocidas:**
`{clues}`

**Metodología de Resolución Obligatoria:**
1.  **Análisis Inicial:** Aplica las pistas iniciales. Analiza la frecuencia de cada número en todo el criptograma. Identifica patrones clave (ej. palabras de 1 letra, palabras repetidas, patrones como X-Y-X).
2.  **Deducción Lógica:** Formula hipótesis basadas en tus hallazgos. Por ejemplo: "El número 4 es el más frecuente, por lo tanto es probable que sea la letra 'E'. Esto convertiría la palabra `4-6-4` en `E-S-E`, lo que implica que `6=S`".
3.  **Propagación:** Usa cada nueva letra descubierta para revelar más partes de otras palabras, generando una cascada de deducciones.
4.  **Verificación Final:** Asegúrate de que la solución final sea una frase coherente en **español** y que cada número corresponda a una única letra, respetando la estructura original del criptograma.

**Instrucción de Salida:**
Después de realizar tu análisis completo, proporciona **ÚNICAMENTE la frase de la solución final, en mayúsculas y sin acentos**. No incluyas tu análisis, ni explicaciones, ni la tabla de sustitución. Solo la frase resuelta.
"""
    safety_settings = [{"category": c, "threshold": "BLOCK_NONE"} for c in ["HARM_CATEGORY_HARASSMENT", "HARM_CATEGORY_HATE_SPEECH", "HARM_CATEGORY_SEXUALLY_EXPLICIT", "HARM_CATEGORY_DANGEROUS_CONTENT"]]
    generation_config = {"temperature": 0.1, "maxOutputTokens": 1024}
    payload = { "contents": [{"parts": [{"text": prompt}]}], "generationConfig": generation_config, "safetySettings": safety_settings }
    
    try:
        # Usamos el modelo PRO para esta tarea de razonamiento pesado
        solution, status = await _call_gemini_api_internal(payload, PRO_API_URL)
        return solution.strip(), status
    except Exception as e:
        log.error(f"Excepción en el solver holístico: {e}")
        return f"Error al procesar la solicitud: {e}", 500

# Las funciones find_author y generate_cryptogram no necesitan cambios y usan el modelo Flash más rápido
async def find_author(phrase: str):
    full_prompt = f"¿Quién es el autor de la frase: '{phrase}'? Responde solo con el nombre completo."
    generation_config = {"temperature": 0.1, "maxOutputTokens": 256}
    safety_settings = [{"category": c, "threshold": "BLOCK_NONE"} for c in ["HARM_CATEGORY_HARASSMENT", "HARM_CATEGORY_HATE_SPEECH", "HARM_CATEGORY_SEXUALLY_EXPLICIT", "HARM_CATEGORY_DANGEROUS_CONTENT"]]
    payload = {"contents": [{"parts": [{"text": full_prompt}]}], "generationConfig": generation_config, "safetySettings": safety_settings}
    try:
        author, status = await _call_gemini_api_internal(payload, FLASH_API_URL)
        return author.strip(), status
    except Exception as e:
        return {"error": str(e)}, 500

async def generate_cryptogram(original_text: str):
    full_prompt = f"Genera un criptograma numérico para el texto: '{original_text}'. Responde solo con el criptograma."
    generation_config = {"temperature": 0.7, "maxOutputTokens": 256}
    safety_settings = [{"category": c, "threshold": "BLOCK_NONE"} for c in ["HARM_CATEGORY_HARASSMENT", "HARM_CATEGORY_HATE_SPEECH", "HARM_CATEGORY_SEXUALLY_EXPLICIT", "HARM_CATEGORY_DANGEROUS_CONTENT"]]
    payload = {"contents": [{"parts": [{"text": full_prompt}]}], "generationConfig": generation_config, "safetySettings": safety_settings}
    try:
        cryptogram, status = await _call_gemini_api_internal(payload, FLASH_API_URL)
        return cryptogram.strip(), status
    except Exception as e:
        return {"error": str(e)}, 500
    
async def generate_phrase_by_theme(theme: str):
    """
    Usa la IA para generar una única frase o cita célebre sobre un tema específico.
    """
    prompt = f"""
Actúa como un curador de sabiduría. Tu única tarea es proporcionar una única frase célebre o un proverbio inspirador sobre el siguiente tema: **{theme}**.

**Instrucciones de Salida Obligatorias:**
- Responde **ÚNICAMENTE con la frase**.
- No incluyas el autor.
- No incluyas comillas ni ningún otro texto explicativo.
- La frase debe ser concisa, idealmente de entre 10 y 20 palabras.
"""
    safety_settings = [{"category": c, "threshold": "BLOCK_NONE"} for c in ["HARM_CATEGORY_HARASSMENT", "HARM_CATEGORY_HATE_SPEECH", "HARM_CATEGORY_SEXUALLY_EXPLICIT", "HARM_CATEGORY_DANGEROUS_CONTENT"]]
    generation_config = {"temperature": 0.9, "maxOutputTokens": 256}
    payload = { "contents": [{"parts": [{"text": prompt}]}], "generationConfig": generation_config, "safetySettings": safety_settings }
    
    try:
        # Usamos el modelo Flash que es más rápido para esta tarea creativa simple
        phrase, status = await _call_gemini_api_internal(payload, FLASH_API_URL)
        # Limpiamos la respuesta para quitar comillas o espacios extra
        cleaned_phrase = phrase.strip().strip('"')
        return cleaned_phrase, status
    except Exception as e:
        log.error(f"Excepción en generate_phrase_by_theme: {e}")
        return f"Error al procesar la solicitud: {e}", 500    