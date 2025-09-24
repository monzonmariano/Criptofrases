# backend/services/crypto_generator.py (Versión 3.0 con Pistas Aleatorias)

import logging
import unidecode
import random # <--- 1. Importamos la librería random
import json
from . import gemini
from backend.core import database_manager
from backend.logger_config import log

def _create_cryptogram_from_text(text: str):
    """
    Convierte un texto en un criptograma, su mapeo de solución completo,
    y un conjunto aleatorio de pistas.
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
    
    # --- 2. Lógica para Pistas Aleatorias ---
    clues = {}
    # Decidimos una cantidad aleatoria de pistas (entre 1 y 3, por ejemplo)
    # Nos aseguramos de no pedir más pistas que las letras disponibles
    if len(solution_mapping) > 3:
        num_clues = random.randint(1, 3)
        # Elegimos al azar algunos números del mapa de la solución para dar como pista
        clue_keys = random.sample(list(solution_mapping.keys()), num_clues)
        for key in clue_keys:
            clues[key] = solution_mapping[key].lower()

    # Devolvemos los tres resultados
    return cryptogram_str, solution_mapping, clues

async def generate_and_save(data: dict):
    """
    Servicio orquestador:
    1. Pide una frase a Gemini según un tema.
    2. Convierte esa frase en un criptograma localmente, generando pistas.
    """
    user_id = data.get('user_id')
    theme = data.get('theme', 'sabiduría')
    
    if not user_id:
        return {"error": "user_id es requerido."}, 400

    log.info(f"Servicio crypto_generator: Petición para generar frase del tema '{theme}' para el usuario {user_id}")

    original_phrase, status = await gemini.generate_phrase_by_theme(theme)
    if status != 200:
        log.warning(f"No se pudo obtener la frase de Gemini. Razón: {original_phrase}")
        return {"error": original_phrase}, status

    log.info(f"Frase obtenida de Gemini: '{original_phrase}'")

    # --- 3. Obtenemos los 3 valores de nuestra función mejorada ---
    new_cryptogram, solution_mapping, random_clues = _create_cryptogram_from_text(original_phrase)
    log.info(f"Criptograma generado localmente: {new_cryptogram}")
    log.info(f"Pistas generadas: {random_clues}")

    db_data = {
    'user_id': user_id,
    'entry_type': 'ai_generator', # Nuevo tipo
    'content': original_phrase # Solo guardamos la frase
    }
    database_manager.create_new_entry(db_data)
    
    # --- 4. Añadimos las pistas a la respuesta ---
    response_data = {
        "theme": theme,
        "original_phrase": original_phrase,
        "cryptogram": new_cryptogram,
        "clues": random_clues, # <--- La nueva información
        "solution_key": solution_mapping
    }
    
    return response_data, 200

async def generate_from_user_input(data: dict):
    """
    Servicio para crear un criptograma a partir del texto y pistas
    proporcionados por el usuario y guardarlo en su historial.
    """
    user_id = data.get('user_id')
    text = data.get('text', '')
    
    if not all([user_id, text]):
        return {"error": "user_id y text son requeridos."}, 400

    log.info(f"Servicio crypto_generator: Creando criptograma personalizado para el usuario {user_id}")

    # Reutilizamos la lógica interna que ya teníamos
    new_cryptogram, solution_mapping, _ = _create_cryptogram_from_text(text)

    # Creamos el objeto de detalles para guardarlo y devolverlo
    details_object = {
        "original_phrase": text,
        "cryptogram": new_cryptogram,
        "solution_key": solution_mapping
    }

    db_data = {
        'user_id': user_id,
        'entry_type': 'user_generator', # Un tipo específico para esta acción
        'details': json.dumps(details_object)
    }
    database_manager.create_new_entry(db_data)
    
    # Devolvemos el mismo objeto de detalles al frontend
    return details_object, 200