# backend/services/solver_utils.py (Versión Final con Dos Fuentes)

import json
import re
import unidecode
from collections import defaultdict, Counter
import os

def generate_resources():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    data_dir = os.path.join(os.path.dirname(script_dir), 'data')
    
    # --- RUTAS A LOS ARCHIVOS ---
    dictionary_path = os.path.join(data_dir, 'corpus.txt') # El .dic para la lista de palabras
    frequency_corpus_path = os.path.join(data_dir, 'frecuencia_corpus.txt') # El libro para las frecuencias
    
    words_by_length_path = os.path.join(data_dir, 'es_words_by_length.json')
    letter_freq_path = os.path.join(data_dir, 'es_letter_frequency.json')
    word_freq_path = os.path.join(data_dir, 'es_word_frequency.json')

    # --- 1. PROCESAR LA LISTA MAESTRA DE PALABRAS (del .dic) ---
    print(f"Leyendo diccionario maestro de: {dictionary_path}")
    if not os.path.exists(dictionary_path):
        print(f"ERROR: No se encontró el diccionario maestro '{dictionary_path}'.")
        return
        
    master_words = set()
    with open(dictionary_path, 'r', encoding='iso-8859-1') as f:
        for line in f:
            word = line.strip().split('/')[0]
            normalized_word = unidecode.unidecode(word.lower())
            if normalized_word.isalpha() and 2 <= len(normalized_word) <= 16:
                master_words.add(normalized_word)

    words_by_length = defaultdict(list)
    for word in sorted(list(master_words)):
        words_by_length[str(len(word))].append(word)

    with open(words_by_length_path, 'w', encoding='utf-8') as f:
        json.dump(words_by_length, f, ensure_ascii=False, indent=4)
    print(f"Recurso 'es_words_by_length.json' generado con {len(master_words)} palabras.")

    # --- 2. PROCESAR EL CORPUS DE LENGUAJE NATURAL (del libro) ---
    print(f"Analizando frecuencias desde: {frequency_corpus_path}")
    if not os.path.exists(frequency_corpus_path):
        print(f"ERROR: No se encontró el corpus de frecuencia '{frequency_corpus_path}'.")
        return
        
    letter_counter = Counter()
    word_counter = Counter()
    
    with open(frequency_corpus_path, 'r', encoding='utf-8') as f:
        text = f.read()
        normalized_text = unidecode.unidecode(text.lower())
        found_words = re.findall(r'\b[a-z]+\b', normalized_text)
        
        for word in found_words:
            # Solo contamos palabras que existen en nuestro diccionario maestro
            if word in master_words:
                word_counter[word] += 1
                for letter in word:
                    letter_counter[letter] += 1
    
    # --- 3. GUARDAR LOS ARCHIVOS DE FRECUENCIA ---
    total_words = sum(word_counter.values())
    word_frequency = {word: count / total_words for word, count in word_counter.items()}
    with open(word_freq_path, 'w', encoding='utf-8') as f:
        json.dump(word_frequency, f, ensure_ascii=False, indent=4, sort_keys=True)
    print(f"Recurso 'es_word_frequency.json' generado a partir de {total_words} palabras contadas.")

    total_letters = sum(letter_counter.values())
    letter_frequency = {letter: count / total_letters for letter, count in letter_counter.items()}
    with open(letter_freq_path, 'w', encoding='utf-8') as f:
        json.dump(letter_frequency, f, ensure_ascii=False, indent=4, sort_keys=True)
    print(f"Recurso 'es_letter_frequency.json' generado a partir de {total_letters} letras contadas.")

if __name__ == '__main__':
    generate_resources()