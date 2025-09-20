# generate_test_crypto.py
import json
import unidecode
import random

def generate_curl_command(phrase, user_id="test_user", num_clues=2):
    """
    Toma una frase en español, la convierte en un criptograma válido
    y genera un comando curl completo para probar el solver.
    """
    # 1. Normalizar la frase de entrada
    normalized_phrase = unidecode.unidecode(phrase.upper())
    words = normalized_phrase.split()
    
    # 2. Crear el mapeo y el criptograma
    mapping = {}
    char_counter = 1
    crypted_words = []
    
    for word in words:
        crypted_word = []
        for char in word:
            if not char.isalpha(): # Ignorar puntuación, etc.
                continue
            if char not in mapping:
                mapping[char] = str(char_counter)
                char_counter += 1
            crypted_word.append(mapping[char])
        crypted_words.append("-".join(crypted_word))
    
    cryptogram_str = " ".join(crypted_words)
    
    # 3. Generar algunas pistas (opcional)
    clues = {}
    if num_clues > 0 and len(mapping) > num_clues:
        # Invertimos el mapeo para poder elegir letras y encontrar su número
        inv_mapping = {v: k for k, v in mapping.items()}
        
        # Elegimos algunas letras al azar para dar como pistas
        random_letters = random.sample(list(inv_mapping.values()), num_clues)
        
        for letter in random_letters:
            clues[mapping[letter]] = letter.lower()
            
    # 4. Construir el comando curl completo
    payload = {
        "user_id": user_id,
        "cryptogram": cryptogram_str,
        "clues": clues
    }
    
    # Usamos json.dumps para formatear el JSON correctamente
    payload_str = json.dumps(payload, indent=4)
    
    curl_command = f"""curl -X POST \\
-H "Content-Type: application/json" \\
-d '{payload_str}' \\
http://localhost:8080/api/solve"""

    print("--- Criptograma Generado ---")
    print(f"Frase Original: {phrase}")
    print("\n--- Comando Curl Listo para Usar ---")
    print(curl_command)
    print("\n----------------------------------")


if __name__ == '__main__':
    # --- Pon aquí la frase que quieras probar ---
    frase_de_prueba = "El saber no ocupa lugar."
    
    generate_curl_command(frase_de_prueba, num_clues=0) # Genera sin pistas