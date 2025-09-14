# backend/services/solver_utils.py
import json
import unidecode
from collections import defaultdict, Counter
import os
import logging

# Configuración de logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# --- Rutas robustas calculadas desde la ubicación del script ---
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_ROOT = os.path.dirname(SCRIPT_DIR) # Sube de 'services' a 'backend'
DATA_DIR = os.path.join(BACKEND_ROOT, 'data')

# Archivos de entrada y salida
DICCIONARIO_ORIGEN = os.path.join(DATA_DIR, 'spanish_words_utf8.txt')
OUTPUT_WORDS_BY_LENGTH = os.path.join(DATA_DIR, 'es_words_by_length.json')
OUTPUT_LETTER_FREQUENCY = os.path.join(DATA_DIR, 'es_letter_frequency.json')

# Lista de palabras comunes que no suelen estar en diccionarios.
STOP_WORDS_ES = [
    'a', 'ante', 'bajo', 'con', 'contra', 'de', 'desde', 'en', 'entre',
    'hacia', 'hasta', 'para', 'por', 'segun', 'sin', 'sobre', 'tras', 'el',
    'la', 'los', 'las', 'un', 'una', 'unos', 'unas', 'y', 'e', 'o', 'u', 'que',
    'mi', 'tu', 'su', 'se', 'del', 'al', 'muy', 'nos', 'lo'
]

def normalize_word(word):
    return unidecode.unidecode(word.lower().strip())

def generate_resources():
    logging.info("🚀 Iniciando la generación de recursos para el solver...")
    
    try:
        with open(DICCIONARIO_ORIGEN, 'r', encoding='utf-8') as f:
            words = {normalize_word(line) for line in f if line.strip()}
    except FileNotFoundError:
        logging.error(f"❌ ERROR: No se encontró el diccionario en '{DICCIONARIO_ORIGEN}'.")
        return

    logging.info(f"  -> Diccionario base cargado con {len(words)} palabras.")
    words.update({normalize_word(sw) for sw in STOP_WORDS_ES})
    logging.info(f"  -> Diccionario enriquecido con {len(words)} palabras únicas.")

    words_by_length = defaultdict(list)
    all_letters = ""
    
    for word in words:
        if word:
            words_by_length[len(word)].append(word)
            all_letters += word

    for length in words_by_length:
        words_by_length[length].sort()
    
    total_letters = len(all_letters)
    letter_counts = Counter(all_letters)
    letter_frequency = {char: count / total_letters for char, count in letter_counts.items()}
    letter_frequency = dict(sorted(letter_frequency.items(), key=lambda item: item[1], reverse=True))

    logging.info("  -> Palabras agrupadas y frecuencia de letras calculada.")

    os.makedirs(DATA_DIR, exist_ok=True)

    with open(OUTPUT_WORDS_BY_LENGTH, 'w', encoding='utf-8') as f:
        json.dump(words_by_length, f, ensure_ascii=False)
    logging.info(f"  -> Archivo '{OUTPUT_WORDS_BY_LENGTH}' generado con éxito.")

    with open(OUTPUT_LETTER_FREQUENCY, 'w', encoding='utf-8') as f:
        json.dump(letter_frequency, f, ensure_ascii=False, indent=4)
    logging.info(f"  -> Archivo '{OUTPUT_LETTER_FREQUENCY}' generado con éxito.")
    
    logging.info("\n✅ ¡Proceso completado!")

if __name__ == '__main__':
    generate_resources()