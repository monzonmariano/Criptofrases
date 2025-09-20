# backend/services/solver_utils.py (Versión Final con Formateo)

import json
import re
import unidecode
from collections import defaultdict, Counter
import os

def generate_resources():
    print("=====================================================")
    print("=== INICIANDO GENERACIÓN DE RECURSOS PARA SOLVER ===")
    print("=====================================================")

    script_dir = os.path.dirname(os.path.abspath(__file__))
    data_dir = os.path.join(os.path.dirname(script_dir), 'data')
    
    dictionary_path = os.path.join(data_dir, 'corpus.txt')
    frequency_corpus_path = os.path.join(data_dir, 'frecuencia_corpus.txt')
    
    words_by_length_path = os.path.join(data_dir, 'es_words_by_length.json')
    letter_freq_path = os.path.join(data_dir, 'es_letter_frequency.json')
    unigram_freq_path = os.path.join(data_dir, 'es_word_frequency.json')
    bigram_freq_path = os.path.join(data_dir, 'es_bigram_frequency.json')
    trigram_freq_path = os.path.join(data_dir, 'es_trigram_frequency.json')

    # --- 1. PROCESAR DICCIONARIO MAESTRO ---
    print(f"\n[PASO 1/4] Leyendo diccionario maestro de: {dictionary_path}")
    master_words = set()
    with open(dictionary_path, 'r', encoding='utf-8') as f:
        for line in f:
            word = line.strip().split('/')[0]
            normalized_word = unidecode.unidecode(word.lower())
            if normalized_word.isalpha() and 2 <= len(normalized_word) <= 25:
                master_words.add(normalized_word)

    words_by_length = defaultdict(list)
    for word in sorted(list(master_words)):
        words_by_length[str(len(word))].append(word)

    with open(words_by_length_path, 'w', encoding='utf-8') as f:
        json.dump(words_by_length, f, ensure_ascii=False, indent=4) # <-- indent=4
    print(f"✅ 'es_words_by_length.json' generado con {len(master_words):,} palabras únicas.")

    # --- 2. PROCESAR CORPUS DE FRECUENCIA ---
    print(f"\n[PASO 2/4] Analizando frecuencias desde: {frequency_corpus_path}")
    with open(frequency_corpus_path, 'r', encoding='utf-8') as f:
        text = f.read()
    normalized_text = unidecode.unidecode(text.lower())
    all_found_words = re.findall(r'\b[a-z]+\b', normalized_text)
    valid_found_words = [word for word in all_found_words if word in master_words]
    print(f"✅ Corpus de frecuencia procesado. Se encontraron {len(valid_found_words):,} palabras válidas.")

    # --- 3. GENERAR FRECUENCIAS DE LETRAS Y UNIGRAMAS ---
    print("\n[PASO 3/4] Calculando frecuencias de letras y unigramas...")
    letter_counter = Counter("".join(valid_found_words))
    unigram_counter = Counter(valid_found_words)

    total_letters = sum(letter_counter.values())
    letter_frequency = {letter: count / total_letters for letter, count in letter_counter.items()}
    with open(letter_freq_path, 'w', encoding='utf-8') as f:
        json.dump(letter_frequency, f, ensure_ascii=False, indent=4, sort_keys=True) # <-- indent=4
    print(f"✅ 'es_letter_frequency.json' generado.")

    total_unigrams = sum(unigram_counter.values())
    unigram_frequency = {word: count / total_unigrams for word, count in unigram_counter.items()}
    with open(unigram_freq_path, 'w', encoding='utf-8') as f:
        json.dump(unigram_frequency, f, ensure_ascii=False, indent=4, sort_keys=True) # <-- indent=4
    print(f"✅ 'es_word_frequency.json' (unigramas) generado.")

    # --- 4. GENERAR N-GRAMAS (BIGRAMAS Y TRIGRAMAS) ---
    print("\n[PASO 4/4] Calculando frecuencias de bigramas y trigramas...")
    
    bigrams = [(valid_found_words[i], valid_found_words[i+1]) for i in range(len(valid_found_words)-1)]
    bigram_counter = Counter(bigrams)
    total_bigrams = sum(bigram_counter.values())
    bigram_frequency = {f"{bg[0]} {bg[1]}": count / total_bigrams for bg, count in bigram_counter.items()}
    with open(bigram_freq_path, 'w', encoding='utf-8') as f:
        json.dump(bigram_frequency, f, ensure_ascii=False, indent=4, sort_keys=True) # <-- indent=4
    print(f"✅ 'es_bigram_frequency.json' generado.")

    trigrams = [(valid_found_words[i], valid_found_words[i+1], valid_found_words[i+2]) for i in range(len(valid_found_words)-2)]
    trigram_counter = Counter(trigrams)
    total_trigrams = sum(trigram_counter.values())
    trigram_frequency = {f"{tg[0]} {tg[1]} {tg[2]}": count / total_trigrams for tg, count in trigram_counter.items()}
    with open(trigram_freq_path, 'w', encoding='utf-8') as f:
        json.dump(trigram_frequency, f, ensure_ascii=False, indent=4, sort_keys=True) # <-- indent=4
    print(f"✅ 'es_trigram_frequency.json' generado.")
    
    print("\n=====================================================")
    print("===      PROCESO DE GENERACIÓN COMPLETADO         ===")
    print("=====================================================")

if __name__ == '__main__':
    generate_resources()