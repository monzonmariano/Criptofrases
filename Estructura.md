Estructura del proyecto:


cryptograms-app/
├── backend/
│   ├── app.py                     # Punto de entrada del servidor.
│   ├── api.py                     # Define y enruta las peticiones de la API.
│   ├── db.py                      # Gestiona la conexión a la base de datos.
│   ├── core/
│   │   ├── api_manager.py         # Orquesta las interacciones con los servicios.
│   │   └── database_manager.py    # Abstracción para las operaciones de la base de datos.
│   ├── services/
│   │   ├── crypto_solver.py       # Lógica para resolver criptogramas.
│   │   ├── crypto_generator.py    # Lógica para generar criptogramas.
│   │   └── author_finder.py       # Lógica para encontrar autores.
│   ├── crud/
│   │   ├── create.py              # Operaciones de inserción de datos.
│   │   ├── read.py                # Operaciones de lectura de datos.
│   │   ├── update.py              # Operaciones de actualización de datos.
│   │   └── delete.py              # Operaciones de borrado de datos.
│   └── .env                       # Archivo de variables de entorno.
└── frontend/
    └── src/
        ├── App.jsx                # El componente principal de la aplicación.
        ├── index.js               # El punto de entrada de React.
        ├── components/            # Componentes de la interfaz de usuario.
        │   ├── SolveCryptogramForm.jsx
        │   ├── FindAuthorForm.jsx
        │   ├── GenerateCryptogramForm.jsx
        │   └── History.jsx
        └── utils/                 # Funciones de utilidad y módulos de ayuda.
            └── sanitizeInput.js   # Función para limpiar y validar inputs.
