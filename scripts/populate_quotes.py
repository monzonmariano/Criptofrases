# scripts/populate_quotes.py
# (Versión FINAL para Full-Text Search)
import sys
import os
from backend.logger_config import log

# Añadimos la ruta del proyecto para encontrar 'backend'
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Importamos solo el CRUD
from backend.core.crud import quotes_crud

# ¡Ya no hay spacy, nlp, normalize_text, ni LEMMA_EXCEPTIONS!

FRASES = [
    ("Vísteme despacio que estoy apurado.", "Napoleón Bonaparte"),
    ("La imaginación es más importante que el conocimiento.", "Albert Einstein"),
    ("Pienso, luego existo.", "René Descartes"),
    ("El respeto al derecho ajeno es la paz.", "Benito Juárez"),
    ("No por mucho madrugar amanece mas temprano.", "Refrán popular")
]

def populate():
    log.info(f"Iniciando la carga de {len(FRASES)} frases en la base de datos...")
    for text, author in FRASES:
        # Simplemente guardamos la frase. 
        # La BD (gracias a FTS) se encarga de normalizar.
        log.info(f"Insertando: '{text}' (Autor: {author})")
        quotes_crud.add_quote(text, author)
        
    log.info("¡Carga completada!")

if __name__ == "__main__":
    populate()