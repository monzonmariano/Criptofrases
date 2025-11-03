# backend/services/sudoku_service.py
from backend.logger_config import log
from sudoku import Sudoku # Esta es la librería que acabamos de instalar

# --- FUNCIÓN 1: El Generador (Usando la Librería) ---
def generate_new_sudoku(difficulty_level: float = 0.5):
    """
    Genera un nuevo tablero de Sudoku Y su solución.
    Dificultad: 0.1 (fácil) a 0.99 (muy difícil)
    """
    log.info(f"Servicio Sudoku: Generando tablero con dificultad {difficulty_level}")
    try:
        # 1. Genera un puzzle
        puzzle_raw = Sudoku(3, 3).difficulty(difficulty_level).board
        
        # 2. Prepara el puzzle (con 0s)
        board = [[(0 if c is None else c) for c in row] for row in puzzle_raw]

        # 3. Crea una copia para resolver
        #    Usamos [row[:] for row in board] para hacer una copia profunda
        solved_board = [row[:] for row in board]

        # 4. Resuelve la copia usando NUESTRO PROPIO ALGORITMO
        if not _nuestro_solver_de_backtracking(solved_board):
            # Si nuestro solver falla (raro pero posible), usamos el de la librería
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
    
    # ----------------------------------------------------
    # AQUÍ IMPLEMENTAREMOS NUESTRO SOLVER DE BACKTRACKING
    # Por ahora, solo devolvemos el tablero
    # ----------------------------------------------------
    
    if _nuestro_solver_de_backtracking(board):
        log.info("Tablero resuelto exitosamente.")
        return {"solved_board": board}, 200
    else:
        log.warning("Nuestro solver no pudo resolver este tablero.")
        return {"error": "El tablero no tiene solución."}, 404


# --- Lógica de Backtracking (Implementación Completa) ---

def _nuestro_solver_de_backtracking(board):
    """
    Función principal recursiva que intenta resolver el tablero.
    Modifica el 'board' directamente (in-place).
    """
    
    # 1. ENCONTRAR: Busca la siguiente celda vacía
    find = _find_empty_cell(board)
    if not find:
        # Si no hay más celdas vacías, ¡el sudoku está resuelto!
        return True
    else:
        row, col = find

    # 2. PROBAR: Intenta con todos los números del 1 al 9
    for num in range(1, 10):
        
        # 3. VALIDAR: Comprueba si el número es válido en esa posición
        if _is_valid_move(board, num, (row, col)):
            
            # Si es válido, lo "fijamos" temporalmente
            board[row][col] = num

            # 4. RECURSIÓN: Llamamos a la función para la siguiente celda
            if _nuestro_solver_de_backtracking(board):
                return True # ¡La solución se encontró!

            # 5. BACKTRACK: Si la recursión falló, no era el número correcto.
            # Lo borramos (volvemos a 0) y probamos el siguiente número del bucle.
            board[row][col] = 0

    # Si probamos todos los números (1-9) y ninguno funcionó,
    # significa que el puzzle no tiene solución desde este punto.
    return False


def _find_empty_cell(board):
    """
    (Función Ayudante) Encuentra la próxima celda vacía (con un 0).
    Devuelve (fila, columna) o None si está lleno.
    """
    for i in range(len(board)):
        for j in range(len(board[0])):
            if board[i][j] == 0:
                return (i, j)  # (fila, columna)
    return None


def _is_valid_move(board, num, pos):
    """
    (Función Ayudante) Comprueba si un número es válido en una celda específica.
    'pos' es una tupla (fila, columna)
    """
    row, col = pos

    # 1. Comprobar Fila
    for j in range(len(board[0])):
        if board[row][j] == num and col != j:
            return False

    # 2. Comprobar Columna
    for i in range(len(board)):
        if board[i][col] == num and row != i:
            return False

    # 3. Comprobar Caja 3x3
    # Calculamos la esquina superior izquierda de la caja
    box_x = col // 3
    box_y = row // 3

    # Iteramos solo dentro de esa caja
    for i in range(box_y * 3, box_y * 3 + 3):
        for j in range(box_x * 3, box_x * 3 + 3):
            if board[i][j] == num and (i, j) != pos:
                return False

    # Si pasa las 3 pruebas, es un movimiento válido
    return True