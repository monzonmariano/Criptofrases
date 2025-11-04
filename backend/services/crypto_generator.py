# backend/services/crypto_generator.py (Versión Híbrida con Temas)

import logging
import unidecode
import random
import json
import os
from backend.core import database_manager
from backend.logger_config import log

# --- 1. Apuntamos al nuevo archivo JSON ---
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(os.path.dirname(SCRIPT_DIR), 'data')
PHRASE_FILE_PATH = os.path.join(DATA_DIR, 'frases_por_tema.json')

# --- 2. Cargamos las frases UNA SOLA VEZ al iniciar el servidor ---
# Esto es mucho más eficiente que leer el archivo en cada petición.
try:
    with open(PHRASE_FILE_PATH, 'r', encoding='utf-8') as f:
        FRASES_POR_TEMA = json.load(f)
    log.info(f"Cargadas {len(FRASES_POR_TEMA)} categorías de frases desde JSON.")
    
    # Creamos una lista "comodín" con todas las frases por si el tema no se encuentra
    FALLBACK_PHRASES = [phrase for sublist in FRASES_POR_TEMA.values() for phrase in sublist]
    if not FALLBACK_PHRASES:
        log.warning("El archivo de frases JSON está vacío.")
        
except FileNotFoundError:
    log.error(f"¡Archivo de frases no encontrado en {PHRASE_FILE_PATH}! El generador local fallará.")
    FRASES_POR_TEMA = {}
    FALLBACK_PHRASES = []
except json.JSONDecodeError:
    log.error(f"Error al decodificar el JSON en {PHRASE_FILE_PATH}.")
    FRASES_POR_TEMA = {}
    FALLBACK_PHRASES = []


def _create_cryptogram_from_text(text: str):
    """
    (Esta función ahora da un número de pistas más justo)
    """
    normalized_text = unidecode.unidecode(text.upper())
    words = normalized_text.split()
    mapping = {}
    char_counter = 1
    crypted_words = []
    
    for word in words:
        crypted_word = []
        for char in word:
            if not char.isalpha():
                continue
            if char not in mapping:
                mapping[char] = str(char_counter)
                char_counter += 1
            crypted_word.append(mapping[char])
        crypted_words.append("-".join(crypted_word))
    
    cryptogram_str = " ".join(crypted_words)
    solution_mapping = {v: k for k, v in mapping.items()}
    
    # --- ¡LÓGICA DE PISTAS MEJORADA! ---
    clues = {}
    num_letras_unicas = len(solution_mapping)
    
    if num_letras_unicas > 10:
        # Frases largas (11+ letras únicas)
        num_clues = random.randint(3, 4)
    elif num_letras_unicas > 5:
        # Frases medias (6-10 letras únicas)
        num_clues = random.randint(2, 3)
    elif num_letras_unicas > 3:
        # Frases cortas (4-5 letras únicas)
        num_clues = 1 # Solo 1 pista para no regalarlo
    else:
        # Demasiado corto
        num_clues = 0

    if num_clues > 0:
        # Nos aseguramos de no pedir más pistas de las letras que hay
        num_clues = min(num_clues, num_letras_unicas) 
        
        clue_keys = random.sample(list(solution_mapping.keys()), num_clues)
        for key in clue_keys:
            clues[key] = solution_mapping[key].lower()
    # --- FIN DE LA LÓGICA MEJORADA ---

    return cryptogram_str, solution_mapping, clues

# --- 3. Nueva función para obtener la frase POR TEMA ---
def _get_random_phrase_by_theme(theme: str):
    """
    Obtiene una frase aleatoria de la categoría correcta.
    Si la categoría no existe, usa una frase de la lista de fallback.
    """
    if not FRASES_POR_TEMA or not FALLBACK_PHRASES:
        return "Error interno: No hay frases cargadas.", False

    # Buscamos la lista de frases para el tema solicitado
    phrases_for_theme = FRASES_POR_TEMA.get(theme)
    
    if phrases_for_theme:
        # Si encontramos el tema y tiene frases, elegimos una de esa lista
        return random.choice(phrases_for_theme).strip(), True
    else:
        # Si el tema no existe (o es "aleatorio"), elegimos de la lista de fallback
        return random.choice(FALLBACK_PHRASES).strip(), True

# --- 4. Modificamos la función principal del servicio ---
# (Esta función sigue siendo síncrona, 'def')
def generate_and_save(data: dict):
    """
    Servicio orquestador (Modo Local con Temas):
    1. Obtiene una frase aleatoria del archivo local según el tema.
    2. Convierte esa frase en un criptograma.
    """
    user_id = data.get('user_id')
    # [cite_start]Usamos 'sabiduria' como tema por defecto si no se proporciona [cite: 2]
    theme = data.get('theme', 'sabiduria') 
    
    if not user_id:
        return {"error": "user_id es requerido."}, 400

    log.info(f"Servicio crypto_generator: Petición para generar frase local del tema '{theme}'")

    # --- 5. Reemplazamos la llamada a la función anterior ---
    original_phrase, success = _get_random_phrase_by_theme(theme)
    
    if not success:
        return {"error": original_phrase}, 500

    log.info(f"Frase obtenida (Tema: {theme}): '{original_phrase}'")

    new_cryptogram, solution_mapping, random_clues = _create_cryptogram_from_text(original_phrase)
    log.info(f"Criptograma generado localmente: {new_cryptogram}")

    # (La lógica de guardado en la BD y de respuesta no cambia)
    db_data = {
        'user_id': user_id,
        'entry_type': 'local_generator',
        'content': original_phrase
    }
    database_manager.create_new_entry(db_data)
    
    response_data = {
        "theme": theme,
        "original_phrase": original_phrase,
        "cryptogram": new_cryptogram,
        "clues": random_clues,
        "solution_key": solution_mapping
    }
    
    return response_data, 200

# --- La función de 'generate_from_user_input' no cambia ---
async def generate_from_user_input(data: dict):
    """
    (Esta función se queda como estaba)
    """
    user_id = data.get('user_id')
    text = data.get('text', '')
    
    if not all([user_id, text]):
        return {"error": "user_id y text son requeridos."}, 400

    log.info(f"Servicio crypto_generator: Creando criptograma personalizado para el usuario {user_id}")
    new_cryptogram, solution_mapping, _ = _create_cryptogram_from_text(text)
    details_object = {
        "original_phrase": text,
        "cryptogram": new_cryptogram,
        "solution_key": solution_mapping
    }
    db_data = {
        'user_id': user_id,
        'entry_type': 'user_generator',
        'details': json.dumps(details_object)
    }
    database_manager.create_new_entry(db_data)
    
    return details_object, 200