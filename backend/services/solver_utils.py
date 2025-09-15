# backend/services/solver_utils.py (Versión Mejorada)

import json
import re
import unidecode
from collections import defaultdict, Counter
import os

def generate_resources():
    """
    Lee un archivo de corpus de texto grande, lo limpia y genera dos recursos:
    1. Un JSON con palabras agrupadas por longitud.
    2. Un JSON con la frecuencia de cada letra.
    """
    # Construye la ruta de forma segura, asumiendo que el script está en backend/services
    script_dir = os.path.dirname(os.path.abspath(__file__))
    data_dir = os.path.join(os.path.dirname(script_dir), 'data')
    
    corpus_path = os.path.join(data_dir, 'corpus.txt') # El archivo grande de palabras
    words_by_length_path = os.path.join(data_dir, 'es_words_by_length.json')
    letter_frequency_path = os.path.join(data_dir, 'es_letter_frequency.json')

    print(f"Buscando corpus en: {corpus_path}")

    if not os.path.exists(corpus_path):
        print(f"ERROR: No se encontró el archivo '{corpus_path}'.")
        print("Por favor, descarga una lista de palabras en español y guárdala en esa ruta.")
        return

    words = set()
    letter_counter = Counter()

    print("Procesando corpus. Esto puede tardar unos segundos...")
    with open(corpus_path, 'r', encoding='utf-8') as f:
        for line in f:
            # 1. Limpiar la línea: convertir a minúsculas y quitar acentos.
            normalized_line = unidecode.unidecode(line.lower())
            
            # 2. Encontrar todas las palabras que solo contienen letras.
            #    Esto descarta números, puntuación y palabras extrañas.
            found_words = re.findall(r'\b[a-z]+\b', normalized_line)
            
            for word in found_words:
                # 3. Añadir palabras válidas (ej. de 2 a 16 letras) al conjunto para evitar duplicados.
                if 2 <= len(word) <= 16:
                    words.add(word)

    if not words:
        print("No se encontraron palabras válidas en el corpus.")
        return

    print(f"Se encontraron {len(words)} palabras únicas.")

    # Agrupar palabras por longitud
    words_by_length = defaultdict(list)
    for word in sorted(list(words)): # Ordenar alfabéticamente para un resultado consistente
        words_by_length[str(len(word))].append(word)
        # Contar letras para el análisis de frecuencia
        for letter in word:
            letter_counter[letter] += 1

    # Guardar palabras por longitud
    with open(words_by_length_path, 'w', encoding='utf-8') as f:
        json.dump(words_by_length, f, ensure_ascii=False, indent=4)
    print(f"Recurso 'es_words_by_length.json' generado exitosamente con {sum(len(v) for v in words_by_length.values())} palabras.")

    # Calcular y guardar frecuencia de letras
    total_letters = sum(letter_counter.values())
    letter_frequency = {letter: count / total_letters for letter, count in letter_counter.items()}
    
    with open(letter_frequency_path, 'w', encoding='utf-8') as f:
        json.dump(letter_frequency, f, ensure_ascii=False, indent=4, sort_keys=True)
    print(f"Recurso 'es_letter_frequency.json' generado exitosamente.")


if __name__ == '__main__':
    generate_resources()