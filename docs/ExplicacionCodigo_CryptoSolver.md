## 1. La Arquitectura General: Tu Ecosistema en una Caja 📦

Imagina que tu proyecto es una máquina compleja, como un coche. No es solo un motor; es el motor, el chasis, la transmisión y la electrónica trabajando juntos. Docker y Docker Compose son la fábrica y el manual de ensamblaje que garantizan que todas las piezas encajen y funcionen en cualquier lugar.

Archivos Clave: docker-compose.yml, GUIA_DOCKER.MD

¿Qué está pasando aquí?
El archivo docker-compose.yml es tu plano maestro. Define dos "cajas" de servicios independientes pero conectadas:

    backend: Esta es tu aplicación Python/aiohttp. Docker la construye siguiendo las instrucciones de backend/Dockerfile (que no hemos visto, pero podemos inferir que instala Python y las librerías de requirements.txt).

    db: Esta es tu base de datos PostgreSQL. En lugar de construirla desde cero, usa una imagen oficial ya preparada (postgres:14-alpine), lo cual es una práctica estándar y muy eficiente.

Puntos Clave y Analogías con Java:

    Contenedores vs. JVM: Un contenedor Docker es como una Máquina Virtual de Java (JVM) supervitaminada. Mientras la JVM crea un entorno estandarizado para ejecutar tu código Java en cualquier sistema operativo, un contenedor Docker va un paso más allá: empaqueta no solo el código y sus dependencias (como las librerías de Python), sino también una porción del sistema operativo mismo. Esto garantiza un aislamiento y una consistencia aún mayores.

    docker-compose.yml vs. pom.xml o build.gradle: Tu docker-compose.yml orquesta los servicios de tu aplicación a gran escala (la app, la base de datos). Un archivo de construcción de Java (como Maven o Gradle) orquesta las dependencias de código dentro de una sola aplicación. Ambos definen y configuran los componentes necesarios para que todo funcione.

    Volúmenes (volumes:): Esta es una de las partes más importantes. La línea - ./backend:/app/backend sincroniza tu código en tu PC con el código dentro del contenedor en tiempo real. Esto es fantástico para el desarrollo: cambias un .py en tu editor, guardas, y el cambio se refleja instantáneamente en el contenedor sin necesidad de reconstruir la imagen. Es el equivalente a la "recarga en caliente" (hot reload) que tienen algunos frameworks de Java.

    Red Interna: Docker Compose crea una red virtual privada para tus servicios. El backend puede hablar con db usando el nombre de host db, gracias a la línea depends_on: - db. Esto es como si ambos servicios estuvieran en la misma LAN, sin necesidad de preocuparse por direcciones IP.

En resumen, Docker te da un entorno de desarrollo limpio, reproducible y aislado, tal como se describe en la guía.

## 2. La Preparación de Datos: Minando el Conocimiento ⛏️

Antes de que nuestro crypto_solver pueda resolver nada, necesita sus herramientas: diccionarios de palabras y estadísticas del lenguaje. No los creamos cada vez que se inicia la aplicación (sería muy lento), sino que lo hacemos una sola vez, en un paso de "pre-compilación".

Archivo Clave: backend/services/solver_utils.py

¿Qué está pasando aquí?
Este script es tu "procesador de datos". Lee archivos de texto plano y los transforma en archivos JSON altamente estructurados y optimizados para que el solver los pueda consultar rápidamente.

El script realiza dos tareas principales:

    Generar es_words_by_length.json:

        Lee un diccionario masivo de palabras (corpus.txt).

        Para cada palabra, la limpia (quita acentos, convierte a minúsculas) y la guarda en un gran diccionario JSON. La clave es la longitud de la palabra (ej: "3") y el valor es una lista de todas las palabras con esa longitud (ej: ["sol", "mar", "luz", ...]).

        ¿Por qué? Cuando el solver necesite buscar candidatos para una palabra cifrada de 5 números, en lugar de leer todo el diccionario, puede ir directamente a la clave "5" y obtener una lista mucho más pequeña y relevante. Es una optimización masiva.

    Generar es_letter_frequency.json y es_word_frequency.json:

        Lee un texto largo y natural, como un libro (frecuencia_corpus.txt), para obtener estadísticas realistas del uso del lenguaje.

        Cuenta la aparición de cada letra y cada palabra.

        Guarda estas frecuencias como porcentajes en archivos JSON.

        ¿Por qué? Esto alimenta las "heurísticas" (intuiciones inteligentes) del solver. El solver sabrá que la letra 'e' es mucho más común que la 'w', lo que le ayudará a tomar mejores decisiones sobre qué letras probar primero.

Conceptos de Python y Analogías con Java:

    defaultdict(list): Esta es una joya de Python. En Java, para agrupar palabras por longitud, harías algo así:
    Java

// Java
Map<Integer, List<String>> wordsByLength = new HashMap<>();
for (String word : allWords) {
    int len = word.length();
    if (!wordsByLength.containsKey(len)) {
        wordsByLength.put(len, new ArrayList<>());
    }
    wordsByLength.get(len).add(word);
}

Con defaultdict(list), si intentas acceder a una clave que no existe, Python automáticamente crea una lista vacía para ti. El código se vuelve más limpio:
Python

    # Python
    words_by_length = defaultdict(list)
    for word in master_words:
        words_by_length[str(len(word))].append(word)

    Counter: Similar a defaultdict, Counter es un diccionario especializado para contar cosas. Es mucho más eficiente y legible que implementar la lógica de conteo manualmente con un HashMap en Java.

## 3. El Flujo de una Petición: El Viaje del Criptograma 🗺️

Ahora sigamos el rastro de una petición curl desde que se envía hasta que se devuelve una solución.

Archivos Clave: main.py, api.py (inferido), crypto_solver.py

El Viaje, Paso a Paso:

    El Arranque (main.py):

        Este archivo es el punto de entrada de la aplicación.

        La línea asyncio.run(start_server()) inicia el bucle de eventos asíncrono, que es el corazón de aiohttp.

        La función start_server crea una instancia de la aplicación web (web.Application()), configura las rutas llamando a api.setup_routes(app), y arranca el servidor para que escuche peticiones en el puerto 8080.

        Analogía con Java: main.py es como la clase principal de una aplicación Spring Boot o SparkJava. Su responsabilidad es configurar e iniciar el servidor web embebido (Tomcat, Jetty, etc.).

    El Enrutamiento (api.py):

        Aunque no tenemos el archivo, el README.md y main.py nos dicen exactamente lo que hace. Define los endpoints de tu API.

        Tendrá una línea similar a esta: app.router.add_post('/api/solve', api_manager.handle_solve_request).

        Esto le dice al servidor aiohttp: "Cuando recibas una petición POST en la URL /api/solve, quiero que ejecutes la función handle_solve_request del módulo api_manager".

        Analogía con Java: Esto es idéntico a las anotaciones @RestController y @PostMapping("/api/solve") en Spring Boot. Es la capa que mapea las URLs HTTP a los métodos de tu código.

    La Orquestación (api_manager.py y crypto_solver.py):

        La función handle_solve_request (en api_manager) recibirá la petición, validará los datos JSON del cuerpo (user_id, cryptogram, etc.) y luego llamará a la función de servicio que hace el trabajo pesado: solve_and_save en crypto_solver.py.

        Finalmente, solve_and_save recibe los datos, llama a la instancia del solver (solver_instance.solve(...)), formatea la respuesta (ya sea la solución o un error), y la devuelve.

        El database_manager se encarga de la parte final: guardar el resultado en la base de datos PostgreSQL, como se describe en la guía.

Esta estructura de capas (API -> Manager/Core -> Service) es un patrón de diseño excelente y muy común tanto en Python como en Java, ya que separa las responsabilidades de forma muy clara.

Ahora que entendemos el "qué" y el "dónde", estamos listos para la parte más emocionante: hacer un zoom profundo en el "cómo" funciona el crypto_solver.py

    api.py es el "recepcionista" que recibe las llamadas HTTP.

    api_manager.py es el "director de orquesta" que sabe a qué servicio delegar cada tarea (crypto_solver, gemini, etc.).

    database_manager.py es el "archivista" que se comunica con la base de datos para guardar y recuperar información.

El flujo que seguimos antes es 100% correcto. Una petición a /api/solve viaja de api.py -> api_manager.py -> crypto_solver.py.

Ahora, vamos al corazón del asunto. Prepárate, porque vamos a desmenuzar el cerebro de la operación: crypto_solver.py.

## 4. El Cerebro del Solver: Un Vistazo Profundo a crypto_solver.py 🧠

Este archivo tiene dos responsabilidades principales:

    La función de servicio (solve_and_save): El puente entre el mundo web (async) y el algoritmo.

    La clase _BacktrackingSolver: El motor algorítmico puro y duro que hace todo el trabajo pesado.

Vamos a analizarlos en orden.

### A. La Función de Servicio: solve_and_save

Esta función async vive en el mundo de aiohttp. Su trabajo es recibir los datos crudos de la petición, preparar el terreno para el solver, llamarlo, y luego empaquetar la respuesta.
Python

async def solve_and_save(data: dict):
    # ... validación de datos ...

    # 1. Preparación de la Entrada
    cryptogram_words = [word.split('-') for word in cryptogram_str.split(' ')]

    # 2. La Llamada al Motor
    solution_mapping = solver_instance.solve(cryptogram_words, clues)
    
    # ... preparación de la respuesta y guardado en BD ...

Puntos Clave y Analogías con Java:

    Preparación de la Entrada: La línea cryptogram_words = [word.split('-') for word in cryptogram_str.split(' ')] es un ejemplo perfecto de la concisión de Python. Es una list comprehension.

        En Java, esto sería más verboso:
        Java

        String cryptogramStr = "1-2 3-4-5";
        List<List<String>> cryptogramWords = new ArrayList<>();
        String[] words = cryptogramStr.split(" ");
        for (String word : words) {
            cryptogramWords.add(Arrays.asList(word.split("-")));
        }
        // Resultado: [[1, 2], [3, 4, 5]]

        La list comprehension de Python hace todo eso en una sola línea, de forma muy legible una vez que te acostumbras.

    La Llamada al Motor: solver_instance.solve(...) es una llamada a un método de un objeto, exactamente igual que en Java. solver_instance es un objeto de la clase _BacktrackingSolver que se crea una sola vez cuando se carga el módulo, convirtiéndolo efectivamente en un Singleton en el contexto de esta aplicación.

### B. La Clase _BacktrackingSolver: El Motor Algorítmico

Aquí es donde ocurre la magia. Analicemos sus métodos más importantes.

__init__(self) (El Constructor)
Python

def __init__(self):
    """Inicializa el solver cargando los recursos."""
    self.words_by_length = self._load_json_resource(...)
    self.letter_frequency = self._load_json_resource(...)
    self.crypto_freq = Counter()

    Esto es el equivalente al constructor de una clase en Java. Se ejecuta una sola vez al crear solver_instance.

    Su trabajo es cargar los archivos JSON en la memoria RAM (self.words_by_length, etc.). Esto es una optimización crucial: los datos están listos para ser consultados instantáneamente, en lugar de leerlos del disco en cada petición.

    self es el this de Java. Es una referencia a la instancia actual del objeto. En Python, debe ser el primer parámetro explícito de cualquier método de instancia.

solve(self, ...) (El Orquestador del Algoritmo)
Python

def solve(self, cryptogram_words, initial_clues={}):
    self._analyze_crypto_frequencies(cryptogram_words)
    mapping = {str(k): v.upper() for k, v in initial_clues.items()}
    unsolved_words = sorted(cryptogram_words, key=len, reverse=True)
    return self._backtrack(unsolved_words, mapping)

    Este es el método público principal que inicia el proceso.

    Heurística Clave #1: La línea sorted(cryptogram_words, key=len, reverse=True) es una de las partes más inteligentes del código. Ordena las palabras cifradas de la más larga a la más corta.

        ¿Por qué? Porque hay muchas menos palabras de 10 letras en español que de 3. Al intentar resolver 1-2-3-4-5-6-7-8-9-10 primero, el número de candidatos posibles es muy pequeño. Si encontráramos una coincidencia, ya habríamos descifrado 10 letras de golpe, lo que hace que resolver las palabras más cortas sea trivial. Es una estrategia para reducir el espacio de búsqueda lo más rápido posible.

_backtrack(self, ...) (El Corazón Recursivo)
Este es el algoritmo de backtracking en su forma más pura. Imagínalo como explorar un laberinto.
Python

def _backtrack(self, unsolved_words, mapping):
    # 1. Condición de Salida (Base Case)
    if not unsolved_words:
        return mapping # ¡Éxito! Encontramos la salida del laberinto.

    word_to_solve = unsolved_words[0]
    candidate_words = self._get_candidate_words(word_to_solve, mapping)

    # 2. Exploración (Recursive Step)
    for candidate in candidate_words:
        new_mapping = self._create_new_mapping(...)
        result = self._backtrack(unsolved_words[1:], new_mapping)
        
        if result is not None:
            return result # Encontramos una solución, la pasamos hacia arriba.

    # 3. Callejón sin salida
    return None # Ningún camino desde aquí funcionó. Volvemos atrás.

    El Proceso:

        Toma la primera palabra de la lista.

        Obtiene una lista de posibles palabras en español (candidatos) para esa palabra cifrada.

        Para cada candidato:
        a. Asume que es la palabra correcta y actualiza el mapa de soluciones (new_mapping).
        b. Llama a _backtrack de nuevo con el resto de las palabras.
        c. Si esa llamada recursiva devuelve una solución completa (no None), ¡genial! Hemos terminado. Devuelve esa solución hacia arriba.

        Si pruebas todos los candidatos y ninguno lleva a una solución, significa que tomaste una decisión equivocada en un paso anterior. Devuelve None para decirle al nivel superior "este camino no funciona, prueba tu siguiente opción".

_get_candidate_words(self, ...) (El Consejero Inteligente)
Este método no solo encuentra candidatos, sino que los ordena del más probable al menos probable.
Python

def _get_candidate_words(self, crypto_word, mapping):
    # ... filtra palabras por longitud y consistencia ...
    
    # Heurística Clave #2: El Sistema de Puntuación
    for word in possible_words:
        score = 0
        # ...
        for num, letter in temp_mapping.items():
            num_freq = self.crypto_freq.get(num, 0)
            letter_freq = self.letter_frequency.get(letter.lower(), 0)
            score += num_freq * letter_freq
        scored_candidates.append((word, score))
        
    # Ordena por puntuación, de mayor a menor
    scored_candidates.sort(key=lambda x: x[1], reverse=True)
    
    return [word for word, score in scored_candidates]

    La Lógica: El número más frecuente en tu criptograma (ej: el '8') probablemente sea la letra más frecuente en español (la 'e' o la 'a'). Esta función calcula una "puntuación de probabilidad" para cada palabra candidata. Un candidato que mapea números frecuentes a letras frecuentes obtendrá una puntuación alta.

    lambda x: x[1]: Esto es una función anónima, muy similar a las lambdas de Java ((x) -> x[1]). Le dice a la función sort que ordene la lista de tuplas (word, score) basándose en el segundo elemento de la tupla (el score).

_is_consistent(self, ...) (El Guardián de las Reglas)
Esta función es crucial. Se asegura de que no rompamos las reglas del criptograma.
Python

def _is_consistent(self, crypto_word, plain_word, mapping):
    temp_mapping = mapping.copy()
    used_letters = set(temp_mapping.values())
    for i, num in enumerate(crypto_word):
        letter = plain_word[i]
        if num in temp_mapping:
            # Regla 1: Si el '5' ya es 'A', no puede ser 'B' ahora.
            if temp_mapping[num] != letter:
                return False
        else:
            # Regla 2: Si 'A' ya se usa para el '3', el '5' no puede ser 'A'.
            if letter in used_letters:
                return False
            temp_mapping[num] = letter
            used_letters.add(letter)
    return True

    Aquí, el uso de un set (conjunto) para used_letters es clave. Comprobar si un elemento está en un set (letter in used_letters) es una operación extremadamente rápida (O(1)), mucho más que buscar en una list. Es el equivalente directo a usar un HashSet en Java para comprobaciones de pertenencia rápidas.


