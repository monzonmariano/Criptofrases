# backend/services/sudoku_service.py
import json
import os
from backend.logger_config import log
from sudoku import Sudoku
#
# ¡¡¡HEMOS BORRADO LA IMPORTACIÓN CIRCULAR 'from .sudoku_service import ...'!!!
#

# --- FUNCIÓN 1: El Generador (VERSIÓN MEJORADA) ---
def generate_new_sudoku(difficulty_level: float = 0.5):
    """
    Genera un nuevo tablero de Sudoku Y su solución.
    Dificultad: 0.1 (fácil) a 0.99 (muy difícil)
    """
    log.info(f"Servicio Sudoku: Generando tablero con dificultad {difficulty_level}")
    try:
        # Usamos 'os.urandom(16)' para una semilla de alta calidad
        seed_data = os.urandom(16)
        
        # 1. Genera un puzzle, pasándole la semilla
        puzzle_raw = Sudoku(3, 3, seed=seed_data).difficulty(difficulty_level).board
        
        # 2. Prepara el puzzle (con 0s)
        board = [[(0 if c is None else c) for c in row] for row in puzzle_raw]

        # 3. Crea una copia para resolver
        solved_board = [row[:] for row in board]

        # 4. Resuelve la copia usando NUESTRO PROPIO ALGORITMO
        #    (Ahora puede encontrar la función porque no hay importación circular)
        if not _nuestro_solver_de_backtracking(solved_board):
            log.warning("Nuestro solver no pudo, usando el solver de la librería...")
            solution_raw = Sudoku(3, 3, board=puzzle_raw).solve().board
            solved_board = [[(0 if c is None else c) for c in row] for row in solution_raw]

        # 5. Devuelve AMBAS cosas: el puzzle y la solución
        return {"board": board, "solution": solved_board}, 200

    except Exception as e:
        log.error(f"Error generando sudoku: {e}")
        return {"error": "No se pudo generar el tablero de Sudoku."}, 500

# --- FUNCIÓN 2: El Solver (NUESTRA LÓGICA DE BACKTRACKING) ---
async def solve_sudoku_from_scratch(data: dict):
    """
    Resuelve un tablero de Sudoku usando nuestro propio algoritmo de backtracking.
    """
    board = data.get('board')
    if not board or len(board) != 9:
        return {"error": "Se requiere un 'board' (tablero) válido de 9x9."}, 400

    log.info(f"Servicio Sudoku: Resolviendo tablero con nuestro algoritmo...")
    
    if _nuestro_solver_de_backtracking(board):
        log.info("Tablero resuelto exitosamente.")
        return {"solved_board": board}, 200
    else:
        log.warning("Nuestro solver no pudo resolver este tablero.")
        return {"error": "El tablero no tiene solución."}, 404

# --- Lógica de Backtracking (Definida en el mismo archivo) ---

def _nuestro_solver_de_backtracking(board):
    """
    Función principal recursiva que intenta resolver el tablero.
    Modifica el 'board' directamente (in-place).
    """
    find = _find_empty_cell(board)
    if not find:
        return True
    else:
        row, col = find

    for num in range(1, 10):
        if _is_valid_move(board, num, (row, col)):
            board[row][col] = num
            if _nuestro_solver_de_backtracking(board):
                return True
            board[row][col] = 0
    return False


def _find_empty_cell(board):
    """(Función Ayudante) Encuentra la próxima celda vacía (con un 0)."""
    for i in range(len(board)):
        for j in range(len(board[0])):
            if board[i][j] == 0:
                return (i, j)  # (fila, columna)
    return None


def _is_valid_move(board, num, pos):
    """(Función Ayudante) Comprueba si un número es válido."""
    row, col = pos
    # Comprobar Fila
    for j in range(len(board[0])):
        if board[row][j] == num and col != j:
            return False
    # Comprobar Columna
    for i in range(len(board)):
        if board[i][col] == num and row != i:
            return False
    # Comprobar Caja 3x3
    box_x = col // 3
    box_y = row // 3
    for i in range(box_y * 3, box_y * 3 + 3):
        for j in range(box_x * 3, box_x * 3 + 3):
            if board[i][j] == num and (i, j) != pos:
                return False
    return True