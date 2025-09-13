#-------------------- Archivo: crypto_solver.py ------------------------------
#-------------------- Resuelve los criptogramas ------------------------------
#-------------------- Delega la persistencia a los gestores --------------------


# backend/services/crypto_solver.py
import logging
from . import solver_utils as utils
from backend.core import database_manager

class CryptoSolver:
    def __init__(self, cryptogram_text, clues_str):
        self.words = cryptogram_text.split(' ')
        self.mappings = {}
        if clues_str:
            for clue in clues_str.split(','):
                try:
                    num, char = clue.strip().split('=')
                    self.mappings[num] = char.upper()
                except (ValueError, IndexError):
                    continue
        
        # Aquí cargaremos nuestros recursos lingüísticos
        # self.word_patterns = utils.load_word_patterns()
        # self.letter_frequency = utils.load_letter_frequency()
        logging.info("Solver inicializado.")

    def solve(self):
        # Esta será la función principal que inicie el algoritmo de backtracking.
        # Por ahora, devolvemos un placeholder.
        logging.info("Iniciando proceso de resolución algorítmico.")
        
        # --- Lógica del Algoritmo de Backtracking irá aquí ---

        final_solution = ' '.join([''.join(self.mappings.get(n, '?') for n in w.split('-')) for w in self.words])
        return final_solution

async def solve_and_save(data: dict):
    cryptogram_text = data.get('cryptogram')
    clues = data.get('clues', '')
    user_id = data.get('user_id')

    # 1. Crear una instancia de nuestro nuevo solver
    solver = CryptoSolver(cryptogram_text, clues)
    
    # 2. Ejecutar el solver
    final_solution = solver.solve()
    status = 200 # El status ahora depende de nuestro código, no de la IA
    
    # 3. Guardar el resultado
    db_data = {
        'content': cryptogram_text,
        'result': final_solution,
        'author': None,
        'is_cryptogram': True,
        'user_id': user_id
    }
    database_manager.create_new_entry(db_data)

    return {"solution": final_solution}, status