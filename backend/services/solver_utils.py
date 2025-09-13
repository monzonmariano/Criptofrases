# backend/services/solver_utils.py
import json
import unidecode
from collections import defaultdict, Counter
import os

# --- Configuración ---
# Asegúrate de que esta ruta sea correcta desde la carpeta `backend`

DATA_DIR = '../data'
DICCIONARIO_ORIGEN = os.path.join(DATA_DIR, 'spanish_words_utf8.txt')
OUTPUT_WORDS_BY_LENGTH = os.path.join(DATA_DIR, 'es_words_by_length.json')
OUTPUT_LETTER_FREQUENCY = os.path.join(DATA_DIR, 'es_letter_frequency.json')


# Lista de conectores, artículos, y palabras comunes que no suelen estar en diccionarios.
STOP_WORDS_ES = [
    'a', 'ante', 'bajo', 'cabe', 'con', 'contra', 'de', 'desde', 'en', 'entre',
    'hacia', 'hasta', 'para', 'por', 'segun', 'sin', 'so', 'sobre', 'tras', 'el',
    'la', 'los', 'las', 'un', 'una', 'unos', 'unas', 'y', 'e', 'o', 'u', 'que',
    'cual', 'cuales', 'quien', 'quienes', 'cuyo', 'cuya', 'cuyos', 'cuyas', 'mi',
    'mis', 'tu', 'tus', 'su', 'sus', 'nuestro', 'nuestros', 'vuestro', 'vuestros',
    'este', 'ese', 'aquel', 'estos', 'esos', 'aquellos', 'esta', 'esa', 'aquella',
    'estas', 'esas', 'aquellas', 'lo', 'me', 'te', 'se', 'nos', 'os', 'le', 'les',
    'pero', 'mas', 'sino', 'aunque', 'como', 'cuando', 'muy', 'del', 'al'
]

def normalize_word(word):
    """
    Convierte una palabra a minúsculas y elimina tildes y diacríticos.
    Ejemplo: 'camión' -> 'camion'
    """
    return unidecode.unidecode(word.lower())

def generate_resources():
    """
    Función principal que lee el diccionario, lo procesa y genera los archivos JSON.
    """
    print("🚀 Iniciando la generación de recursos para el solver...")

    # --- 1. Cargar y enriquecer el diccionario ---
    print(f"📖 Cargando diccionario desde '{DICCIONARIO_ORIGEN}'...")
    try:
        with open(DICCIONARIO_ORIGEN, 'r', encoding='utf-8') as f:
            # Usamos un set para procesar palabras únicas y normalizarlas
            words = {normalize_word(line.strip()) for line in f if line.strip()}
    except FileNotFoundError:
        print(f"❌ ERROR: No se encontró el archivo de diccionario en '{DICCIONARIO_ORIGEN}'.")
        print("Asegúrate de que la ruta y el nombre del archivo son correctos.")
        return

    print(f"  -> Diccionario base cargado con {len(words)} palabras.")
    
    # Añadimos las stop words normalizadas
    normalized_stop_words = {normalize_word(sw) for sw in STOP_WORDS_ES}
    words.update(normalized_stop_words)
    
    print(f"  -> Diccionario enriquecido con {len(words)} palabras únicas.")

    # --- 2. Procesar y agrupar ---
    print("🧠 Procesando y agrupando palabras...")
    words_by_length = defaultdict(list)
    all_letters = ""
    
    for word in words:
        if word: # Ignorar líneas vacías que pudieran quedar
            words_by_length[len(word)].append(word)
            all_letters += word

    # Ordenar las listas de palabras alfabéticamente (opcional, pero buena práctica)
    for length in words_by_length:
        words_by_length[length].sort()
    
    # Calcular frecuencia de letras
    total_letters = len(all_letters)
    letter_counts = Counter(all_letters)
    letter_frequency = {char: count / total_letters for char, count in letter_counts.items()}
    
    # Ordenar por frecuencia descendente
    letter_frequency = dict(sorted(letter_frequency.items(), key=lambda item: item[1], reverse=True))

    print("  -> Palabras agrupadas por longitud.")
    print("  -> Frecuencia de letras calculada.")

    # --- 3. Guardar los recursos ---
    # Asegurarse de que el directorio de datos existe
    os.makedirs(DATA_DIR, exist_ok=True)

    print(f"💾 Guardando archivos de recursos en '{DATA_DIR}'...")
    try:
        with open(OUTPUT_WORDS_BY_LENGTH, 'w', encoding='utf-8') as f:
            json.dump(words_by_length, f, ensure_ascii=False)
        print(f"  -> Archivo '{OUTPUT_WORDS_BY_LENGTH}' generado con éxito.")

        with open(OUTPUT_LETTER_FREQUENCY, 'w', encoding='utf-8') as f:
            json.dump(letter_frequency, f, ensure_ascii=False, indent=4)
        print(f"  -> Archivo '{OUTPUT_LETTER_FREQUENCY}' generado con éxito.")
    except Exception as e:
        print(f"❌ ERROR al guardar los archivos: {e}")
        return

    print("\n✅ ¡Proceso completado! Los recursos del solver están listos.")

if __name__ == '__main__':
    generate_resources()