# backend/services/crypto_solver.py (Versión con BUG CORREGIDO en _is_consistent)
import json
import os
from backend.logger_config import log

class _BacktrackingSolver:
    def __init__(self):
        self.words_by_length = self._load_json_resource('data/es_words_by_length.json')
        self.word_frequency = self._load_json_resource('data/es_word_frequency.json')
        log.info("Instancia interna de _BacktrackingSolver creada y recursos cargados.")

    def _load_json_resource(self, relative_path):
        try:
            script_dir = os.path.dirname(os.path.abspath(__file__))
            backend_root_path = os.path.dirname(script_dir)
            full_path = os.path.join(backend_root_path, relative_path)
            with open(full_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except FileNotFoundError:
            log.error(f"❌ ERROR: No se encontró el archivo de recursos: '{full_path}'")
            return {}

    def solve(self, cryptogram_words, initial_clues={}):
        mapping = {str(k): v.upper() for k, v in initial_clues.items()}
        # ESTRATEGIA CORRECTA: Ordenar por el punto más débil
        unique_words_candidates = {tuple(word): self._get_candidate_words(word, mapping) for word in set(map(tuple, cryptogram_words))}
        sorted_unique_words = sorted(unique_words_candidates.keys(), key=lambda w: len(unique_words_candidates[w]))
        word_order_map = {word: i for i, word in enumerate(sorted_unique_words)}
        unsolved_words = sorted(cryptogram_words, key=lambda w: word_order_map[tuple(w)])
        return self._backtrack(unsolved_words, mapping)

    def _backtrack(self, unsolved_words, mapping):
        if not unsolved_words:
            return mapping
        
        word_to_solve = unsolved_words[0]
        remaining_words = unsolved_words[1:]
        candidate_words = self._get_candidate_words(word_to_solve, mapping)

        for candidate in candidate_words:
            new_mapping = self._create_new_mapping(word_to_solve, candidate, mapping)
            result = self._backtrack(remaining_words, new_mapping)
            if result is not None:
                return result
        return None

    def _get_candidate_words(self, crypto_word, mapping):
        word_len_str = str(len(crypto_word))
        if word_len_str not in self.words_by_length: return []
        
        possible_words = [
            word.upper() for word in self.words_by_length.get(word_len_str, []) 
            if self._is_consistent(crypto_word, word.upper(), mapping)
        ]
        
        possible_words.sort(key=lambda w: self.word_frequency.get(w.lower(), 0), reverse=True)
        return possible_words

    # ---- INICIO DE LA FUNCIÓN CORREGIDA Y SIMPLIFICADA ----
    def _is_consistent(self, crypto_word, plain_word, mapping):
        temp_map = mapping.copy()
        for num, letter in zip(crypto_word, plain_word):
            # Caso 1: El número ya tiene una letra asignada
            if num in temp_map:
                # Si la letra no coincide, es una contradicción
                if temp_map[num] != letter:
                    return False
            # Caso 2: El número es nuevo, pero la letra ya está en uso por OTRO número
            elif letter in temp_map.values():
                return False
            # Caso 3: El número y la letra son nuevos y consistentes hasta ahora
            else:
                temp_map[num] = letter
        return True
    # ---- FIN DE LA FUNCIÓN CORREGIDA Y SIMPLIFICADA ----

    def _create_new_mapping(self, crypto_word, plain_word, mapping):
        new_map = mapping.copy()
        for i, num in enumerate(crypto_word):
            if num not in new_map:
                new_map[num] = plain_word[i]
        return new_map

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

    log.info(f"Servicio crypto_solver: Intentando resolver para el usuario {user_id}")
    solution_mapping = solver_instance.solve(cryptogram_words, clues)
    
    if solution_mapping:
        solved_words = ["".join([solution_mapping.get(num, '?') for num in word_nums]) for word_nums in cryptogram_words]
        final_solution_str = " ".join(solved_words)
        log.info(f"Servicio crypto_solver: Solución encontrada: {final_solution_str}")
        return {"solution": final_solution_str, "mapping": solution_mapping}, 200
    else:
        log.warning(f"Servicio crypto_solver: No se encontró solución para el usuario {user_id}")
        return {"error": "No se pudo encontrar una solución."}, 404