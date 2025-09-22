# Documento 0: Introducción a los Criptogramas y Nuestro Solver

¡Bienvenido al corazón de "Criptofrases"! Antes de sumergirnos en el código, es fundamental entender el desafío que nuestro backend está diseñado para conquistar: los criptogramas.

## Parte 1: ¿Qué es un Criptograma?

Un criptograma, en su forma más común, es un puzzle donde cada letra del alfabeto ha sido reemplazada de forma consistente por otra letra o, en nuestro caso, por un **número**. Es un **cifrado de sustitución simple**.

La clave es la **consistencia**:
* Si la letra `A` se encripta como el número `2`, entonces **cada vez** que aparezca el número `2` en el puzzle, significará `A`.
* Dos letras diferentes no pueden compartir el mismo número. Si `L` es `1`, ninguna otra letra puede ser `1`.

### Un Ejemplo Sencillo

Imagina que queremos encriptar la palabra `HOLA`.
* Asignamos `H` -> `1`, `O` -> `2`, `L` -> `3`.
* ¿Qué pasa con la última `A`? Como la `A` ya apareció y no podemos usar un número nuevo, debemos reutilizar el que le corresponde. ¡Pero `HOLA` no tiene letras repetidas!
* Corrijamos el ejemplo con `CASA`: `C` -> `1`, `A` -> `2`, `S` -> `3`. La última letra es `A`, que ya sabemos que es `2`.

El criptograma para `CASA` sería: **`1-2-3-2`**.



### ¿Cómo lo Resuelve un Humano?

Un humano resuelve estos puzzles usando la lógica, la intuición y el conocimiento de la estructura del lenguaje:
1.  **Patrones de Palabras**: Una palabra como `1-2-2-2` es casi seguro que es `ELLA` o `ALLA`. Una palabra de una sola letra como `3` es casi seguro que es `A` o `Y`.
2.  **Frecuencia de Letras**: En español, la letra más común es la `E`, seguida de la `A`. Si en un texto largo el número `8` aparece más que ningún otro, es una apuesta muy segura que `8 = E`.
3.  **Prueba y Error**: Haces una suposición (`8 = E`), ves cómo afecta al resto del puzzle, y si llegas a una contradicción, retrocedes y pruebas otra cosa.

## Parte 2: ¿Cómo Resuelve Esto Nuestro Backend?

Nuestro `crypto_solver.py` es, en esencia, un **criptógrafo humano superpoderoso y automatizado**. Emula el mismo proceso de lógica y deducción, pero a una velocidad y escala imposibles para una persona.

Su inteligencia se basa en la arquitectura que hemos construido:

### 1. La Estrategia: "Atacar el Punto Débil"
En lugar de empezar al azar, el solver primero analiza el puzzle completo. Nuestra implementación final utiliza la estrategia **"La Palabra Más Larga Primero"**. Al resolver una palabra de 10 letras, obtiene 10 mapeos de golpe, lo que simplifica enormemente el resto del problema. Es una forma de maximizar la ganancia de información en cada paso.

### 2. La Táctica: Búsqueda Inteligente de Candidatos
Cuando el solver se enfoca en una palabra cifrada, no prueba palabras al azar. Hace dos cosas:
* **Filtra por Patrón**: Descarta todas las palabras del diccionario que no tengan el mismo patrón de letras repetidas.
* **Prioriza por Probabilidad**: De las que quedan, ordena las candidatas usando el `es_word_frequency.json` (unigramas), asegurándose de probar primero las palabras más comunes.

### 3. La Búsqueda: Backtracking Sistemático
Aquí es donde el solver emula la "prueba y error" humana, pero sin olvidarse de nada. El algoritmo de **backtracking** explora un camino (ej: asumiendo que una palabra es `ACCIDENTE`). Si ese camino lleva a un callejón sin salida, retrocede de forma inteligente y prueba la siguiente mejor opción, garantizando que explorará todas las posibilidades lógicas sin repetirse.

### 4. El Juicio Final: Puntuación de Coherencia con N-gramas
El solver puede encontrar múltiples soluciones que son estructuralmente válidas. Para decidir cuál es la "correcta", utiliza el **"juez" (`_score_solution`)**. Este juez no solo mira si las palabras son comunes, sino que utiliza los **bigramas y trigramas** para evaluar si la frase "suena" natural en español.

Una solución como `"LA CALIDAD NUNCA ES..."` recibirá una puntuación de coherencia altísima porque contiene secuencias de palabras muy probables. Una solución sin sentido como `"OC SENOR LA AYUDE..."` será penalizada porque sus secuencias son muy raras.

En resumen, nuestro backend combina una búsqueda lógica y sistemática con un profundo conocimiento estadístico del idioma español para encontrar la solución más probable. **No es magia, es lógica y probabilidad a gran escala.**