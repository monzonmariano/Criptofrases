## backend/services/crypto_solver.py
import json
import os
import logging
from collections import Counter
from backend.core import database_manager

# --- CONSTANTES DE RUTAS ---
WORDS_BY_LENGTH_PATH = 'data/es_words_by_length.json'
LETTER_FREQUENCY_PATH = 'data/es_letter_frequency.json'

# --- CLASE INTERNA DEL SOLVER ALGORÍTMICO ---
class _BacktrackingSolver:
    def __init__(self):
        """Inicializa el solver cargando los recursos."""
        self.words_by_length = self._load_json_resource(WORDS_BY_LENGTH_PATH)
        self.letter_frequency = self._load_json_resource(LETTER_FREQUENCY_PATH)
        self.crypto_freq = Counter() # Inicializamos el contador de frecuencia de números
        logging.info("Instancia interna de _BacktrackingSolver creada y recursos cargados.")

    def _load_json_resource(self, relative_path_from_backend_root):
        """Carga un recurso JSON de forma robusta."""
        try:
            script_path = os.path.abspath(__file__)
            backend_root_path = os.path.dirname(os.path.dirname(script_path))
            full_path = os.path.join(backend_root_path, relative_path_from_backend_root)
            with open(full_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except FileNotFoundError:
            logging.error(f"❌ ERROR: No se encontró el archivo de recursos en la ruta: '{full_path}'")
            return {}

    def _analyze_crypto_frequencies(self, cryptogram_words):
        """Calcula la frecuencia de cada número en el criptograma completo."""
        all_numbers = [num for word in cryptogram_words for num in word]
        self.crypto_freq = Counter(all_numbers)
        logging.info(f"Frecuencia de números analizada: {self.crypto_freq}")

    def solve(self, cryptogram_words, initial_clues={}):
        """Método principal para resolver, ordenando por longitud y usando frecuencia de letras."""
        self._analyze_crypto_frequencies(cryptogram_words)
        mapping = {str(k): v.upper() for k, v in initial_clues.items()}
        unsolved_words = sorted(cryptogram_words, key=len, reverse=True)
        return self._backtrack(unsolved_words, mapping)

    def _backtrack(self, unsolved_words, mapping):
        if not unsolved_words:
            return mapping
            
        word_to_solve = unsolved_words[0]
        remaining_words = unsolved_words[1:]
        
        candidate_words = self._get_candidate_words(word_to_solve, mapping)

        for candidate in candidate_words:
            new_mapping = self._create_new_mapping(word_to_solve, candidate, mapping)
            # La comprobación 'if new_mapping' es redundante aquí pero no daña
            if new_mapping:
                result = self._backtrack(remaining_words, new_mapping)
                if result is not None:
                    return result
        return None

    def _get_candidate_words(self, crypto_word, mapping):
        """Obtiene y ordena los candidatos basándose en la frecuencia de las letras."""
        word_len_str = str(len(crypto_word))
        if word_len_str not in self.words_by_length:
            return []
            
        possible_words = [
            word.upper() for word in self.words_by_length[word_len_str]
            if self._is_consistent(crypto_word, word.upper(), mapping)
        ]
        
        scored_candidates = []
        for word in possible_words:
            score = 0
            temp_mapping = mapping.copy()
            for i, num in enumerate(crypto_word):
                letter = word[i]
                if num not in temp_mapping:
                    temp_mapping[num] = letter
            
            for num, letter in temp_mapping.items():
                num_freq = self.crypto_freq.get(num, 0)
                letter_freq = self.letter_frequency.get(letter.lower(), 0)
                score += num_freq * letter_freq
            
            scored_candidates.append((word, score))
            
        scored_candidates.sort(key=lambda x: x[1], reverse=True)
        
        return [word for word, score in scored_candidates]

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

# --- FUNCIÓN DE SERVICIO QUE ORQUESTA Y GUARDA ---
solver_instance = _BacktrackingSolver()

async def solve_and_save(data: dict):
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
    solution_mapping = solver_instance.solve(cryptogram_words, clues)
    
    db_data = {
        'content': cryptogram_str, 'result': 'NO-SOLUTION', 'author': None,
        'is_cryptogram': True, 'user_id': user_id
    }
    
    if solution_mapping:
        solved_words = ["".join([solution_mapping.get(num, '?') for num in word_nums]) for word_nums in cryptogram_words]
        final_solution_str = " ".join(solved_words)
        db_data['result'] = final_solution_str
        logging.info(f"Servicio crypto_solver: Solución encontrada: {final_solution_str}")
        response_data = {"solution": final_solution_str, "mapping": solution_mapping}
        status = 200
    else:
        logging.warning(f"Servicio crypto_solver: No se encontró solución para el usuario {user_id}")
        response_data = {"error": "No se pudo encontrar una solución."}
        status = 404

    # database_manager.create_new_entry(db_data)
    
    return response_data, status