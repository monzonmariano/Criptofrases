# Documento 4: El Motor del Solver (La Caja de Cristal)

El corazón de nuestro proyecto es el motor de resolución de criptogramas (`crypto_solver.py`). No es una caja negra; es un sistema lógico basado en principios de la inteligencia artificial y la estadística.

## La Arquitectura del Solver

El solver opera en cuatro fases clave:

1.  **La Estrategia (`solve`)**: Antes de empezar, diseña un plan de ataque.
2.  **La Táctica (`_get_candidate_words`)**: Para cada paso, elige las mejores "jugadas" posibles.
3.  **La Búsqueda (`_backtrack`)**: Explora el laberinto de soluciones de forma sistemática.
4.  **El Juicio (`_score_solution`)**: Evalúa las soluciones encontradas y elige la más coherente.

## Fase 1: La Estrategia - "La Palabra Más Larga Primero"

La función `solve` es el "estratega". Su primera decisión es en qué orden atacar las palabras del criptograma. La heurística que usamos es simple pero muy poderosa: **atacar las palabras más largas primero**.

```python
# dentro de solve()
unsolved_words = sorted(cryptogram_words, key=len, reverse=True)
```
**¿Por qué?** Porque hay muchas menos palabras de 10 letras en español que de 3. Al resolver una palabra larga, desciframos muchas letras de golpe, lo que reduce drásticamente la complejidad del resto del puzzle.

## Fase 2: La Táctica - Búsqueda y Priorización de Candidatos

La función `_get_candidate_words` es el "táctico". Dada una palabra cifrada (ej: `3-6-7-8-9...`), su misión es encontrar las mejores palabras en español que podrían encajar.

1.  **Filtrado por Patrón**: Primero, filtra el diccionario para encontrar todas las palabras que tengan el mismo patrón de letras repetidas y que no contradigan las pistas ya conocidas. Esto lo hace la función `_is_consistent`, que actúa como un "guardia de seguridad".
2.  **Priorización por Frecuencia**: Luego, ordena esa lista de candidatos usando nuestro `es_word_frequency.json`. Las palabras más comunes (`QUE`, `DE`, `PARA`) son priorizadas sobre las más raras.

## Fase 3: La Búsqueda - Backtracking Recursivo

La función `_backtrack` es el "explorador". Utiliza una técnica llamada **backtracking (vuelta atrás)**, que es una forma inteligente de explorar un laberinto.

1.  Toma el primer candidato más prometedor (ej: `ESCRIBIR`).
2.  **Asume que es correcto** y se sumerge un nivel más en el puzzle para resolver la siguiente palabra con este nuevo conocimiento.
3.  Si en algún punto llega a un callejón sin salida (una palabra para la que no hay candidatos), no se rinde. **Retrocede** al punto de decisión anterior, descarta `ESCRIBIR`, y prueba con el siguiente candidato de la lista (ej: `EXPRIMIR`).

Este proceso garantiza que se exploren sistemáticamente todos los caminos posibles.

## Fase 4: El Juicio - Puntuación con N-gramas

El explorador puede encontrar varias "salidas" al laberinto (soluciones que son estructuralmente válidas pero no tienen sentido). La función `_score_solution` es el "juez" que decide cuál es la mejor.

No solo mira las palabras individualmente **(unigramas)**, sino que analiza la coherencia de las secuencias de palabras.

```python
# dentro de _score_solution()
final_score = (unigram_score * 1.0) + (bigram_score * 2.0) + (trigram_score * 3.0)
```
Utiliza nuestros archivos de **bigramas** y **trigramas** para dar una puntuación más alta a las frases que contienen secuencias de palabras comunes en español (`"resultado de un"` recibirá más puntos que `"gato sobre azul"`). Al dar más peso a los n-gramas más largos, el juez prioriza las soluciones con una estructura gramatical y semántica más coherente.

Es esta combinación de búsqueda lógica y juicio estadístico lo que le da al solver su poder.