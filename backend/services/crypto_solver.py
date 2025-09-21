# backend/services/crypto_solver.py (Versión Final con N-gramas)

import json
import os
import logging
from collections import Counter
from backend.core import database_manager

# --- CONSTANTES DE RUTAS ---
WORDS_BY_LENGTH_PATH = 'data/es_words_by_length.json'
LETTER_FREQUENCY_PATH = 'data/es_letter_frequency.json'
UNIGRAM_FREQUENCY_PATH = 'data/es_word_frequency.json'
BIGRAM_FREQUENCY_PATH = 'data/es_bigram_frequency.json'
TRIGRAM_FREQUENCY_PATH = 'data/es_trigram_frequency.json'

# --- CLASE INTERNA DEL SOLVER ALGORÍTMICO ---
class _BacktrackingSolver:
    def __init__(self):
        """Inicializa el solver cargando todos los recursos de lenguaje."""
        self.words_by_length = self._load_json_resource(WORDS_BY_LENGTH_PATH)
        self.letter_frequency = self._load_json_resource(LETTER_FREQUENCY_PATH)
        self.unigram_frequency = self._load_json_resource(UNIGRAM_FREQUENCY_PATH)
        self.bigram_frequency = self._load_json_resource(BIGRAM_FREQUENCY_PATH)
        self.trigram_frequency = self._load_json_resource(TRIGRAM_FREQUENCY_PATH)
        self.crypto_freq = Counter()
        self.cryptogram_words_to_solve = []
        logging.info("✅ Instancia de Solver creada y todos los recursos de n-gramas cargados.")

    def _load_json_resource(self, relative_path_from_backend_root):
        """Carga un recurso JSON de forma robusta."""
        try:
            script_path = os.path.abspath(__file__)
            backend_root_path = os.path.dirname(os.path.dirname(script_path))
            full_path = os.path.join(backend_root_path, relative_path_from_backend_root)
            with open(full_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except FileNotFoundError:
            # full_path no estará definido si la excepción ocurre antes, lo reconstruimos
            script_path_on_error = os.path.abspath(__file__)
            backend_root_path_on_error = os.path.dirname(os.path.dirname(script_path_on_error))
            full_path_on_error = os.path.join(backend_root_path_on_error, relative_path_from_backend_root)
            logging.error(f"❌ ERROR: No se encontró el archivo de recursos en la ruta: '{full_path_on_error}'")
            return {}

    def _analyze_crypto_frequencies(self, cryptogram_words):
        """Calcula la frecuencia de cada número en el criptograma completo."""
        all_numbers = [num for word in cryptogram_words for num in word]
        self.crypto_freq = Counter(all_numbers)

    def _get_candidate_words(self, crypto_word, mapping):
        """
        Obtiene y ordena candidatos usando la heurística más simple y robusta:
        la frecuencia pura de la palabra (unigrama).
        """
        word_len_str = str(len(crypto_word))
        if word_len_str not in self.words_by_length:
            return []

        # 1. Filtra las palabras que son consistentes con el mapeo actual
        possible_words = [
            word.upper() for word in self.words_by_length[word_len_str]
            if self._is_consistent(crypto_word, word.upper(), mapping)
        ]

        # 2. Ordena esa lista de candidatos únicamente por su frecuencia de uso.
        #    La palabra más común siempre será la primera opción a probar.
        possible_words.sort(
            key=lambda word: self.unigram_frequency.get(word.lower(), 0.0000001), 
            reverse=True
        )
        
        return possible_words

    def _is_consistent(self, crypto_word, plain_word, mapping):
        """Verifica si una palabra candidata es consistente con el mapeo actual."""
        temp_mapping = mapping.copy()
        used_letters = set(temp_mapping.values())
        for i, num in enumerate(crypto_word):
            letter = plain_word[i]
            if num in temp_mapping:
                if temp_mapping[num] != letter:
                    return False
            else:
                if letter in used_letters:
                    return False
                temp_mapping[num] = letter
                used_letters.add(letter)
        return True

    def _create_new_mapping(self, crypto_word, plain_word, mapping):
        """Crea un nuevo mapeo a partir de una palabra candidata exitosa."""
        new_map = mapping.copy()
        for i, num in enumerate(crypto_word):
            letter = plain_word[i]
            if num not in new_map:
                new_map[num] = letter
        return new_map

    def _score_solution(self, mapping):
        """Calcula una puntuación para una solución usando un modelo ponderado de n-gramas."""
        solved_phrase_words = [
            "".join([mapping.get(num, '?') for num in word_nums])
            for word_nums in self.cryptogram_words_to_solve
        ]

        unigram_score = sum(self.unigram_frequency.get(word.lower(), 0.0000001) for word in solved_phrase_words)
        
        bigram_score = 0
        if len(solved_phrase_words) > 1:
            for i in range(len(solved_phrase_words) - 1):
                bigram = f"{solved_phrase_words[i].lower()} {solved_phrase_words[i+1].lower()}"
                bigram_score += self.bigram_frequency.get(bigram, 0)
        
        trigram_score = 0
        if len(solved_phrase_words) > 2:
            for i in range(len(solved_phrase_words) - 2):
                trigram = f"{solved_phrase_words[i].lower()} {solved_phrase_words[i+1].lower()} {solved_phrase_words[i+2].lower()}"
                trigram_score += self.trigram_frequency.get(trigram, 0)

        return (unigram_score * 1.0) + (bigram_score * 2.0) + (trigram_score * 3.0)

    def _backtrack(self, unsolved_words, mapping, solutions_found, max_solutions):
        if len(solutions_found) >= max_solutions:
            return
        if not unsolved_words:
            solutions_found.append(mapping)
            return

        word_to_solve = unsolved_words[0]
        remaining_words = unsolved_words[1:]
        candidate_words = self._get_candidate_words(word_to_solve, mapping)

        for candidate in candidate_words:
            new_mapping = self._create_new_mapping(word_to_solve, candidate, mapping)
            if new_mapping:
                self._backtrack(remaining_words, new_mapping, solutions_found, max_solutions)
                if len(solutions_found) >= max_solutions:
                    return

    def solve(self, cryptogram_words, initial_clues={}, max_solutions=5):
        """
        Versión final y optimizada. Usa la estrategia "La Palabra Más Larga Primero",
        que es extremadamente rápida y efectiva.
        """
        self._analyze_crypto_frequencies(cryptogram_words)
        self.cryptogram_words_to_solve = cryptogram_words
        
        initial_mapping = {str(k): v.upper() for k, v in initial_clues.items()}
        
        # --- ESTRATEGIA DE ORDENAMIENTO RÁPIDA Y EFECTIVA ---
        unsolved_words = sorted(cryptogram_words, key=len, reverse=True)
        
        solutions_found = []
        self._backtrack(unsolved_words, initial_mapping, solutions_found, max_solutions)
        
        if not solutions_found:
            return []
        
        solutions_found.sort(key=self._score_solution, reverse=True)
        return solutions_found

# --- FUNCIÓN DE SERVICIO QUE ORQUESTA Y GUARDA ---
solver_instance = _BacktrackingSolver()

async def solve_and_save(data: dict):
    """
    Función de servicio asíncrona. Orquesta la resolución y el guardado en BD.
    """
    user_id = data.get('user_id')
    cryptogram_str = data.get('cryptogram', '')
    clues = data.get('clues', {})
    
    if not all([user_id, cryptogram_str]):
        return {"error": "user_id y cryptogram son requeridos."}, 400

    try:
        cryptogram_words = [word.split('-') for word in cryptogram_str.split(' ')]
    except Exception:
        return {'error': 'Formato de criptograma inválido.'}, 400

    logging.info(f"Servicio crypto_solver: Intentando resolver para el usuario {user_id}")
    solutions_list = solver_instance.solve(cryptogram_words, clues)
    
    db_data = {
        'content': cryptogram_str,
        'result': 'NO-SOLUTION',
        'author': None,
        'is_cryptogram': True,
        'user_id': user_id
    }
    
    if solutions_list:
        best_mapping = solutions_list[0]
        solved_words = ["".join([best_mapping.get(num, '?') for num in word_nums]) for word_nums in cryptogram_words]
        final_solution_str = " ".join(solved_words)
        
        db_data['result'] = final_solution_str
        logging.info(f"Servicio crypto_solver: Solución encontrada: {final_solution_str}")
        
        response_data = {"solution": final_solution_str, "mapping": best_mapping}
        status = 200
    else:
        logging.warning(f"Servicio crypto_solver: No se encontró solución para el usuario {user_id}")
        response_data = {"error": "No se pudo encontrar una solución."}
        status = 404

    # Aquí es donde se conecta con la base de datos
    database_manager.create_new_entry(db_data)
    
    return response_data, status