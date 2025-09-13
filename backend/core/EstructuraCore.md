backend/
├── core/
│   ├── crud/
│   │   ├── create.py  # Solo para crear nuevas entradas
│   │   ├── read.py    # Solo para leer entradas (historial, etc.)
│   │   ├── update.py  # Solo para actualizar entradas
│   │   └── delete.py  # Solo para borrar entradas
│   ├── db_manager.py  # Sirve como interfaz para las funciones de crud/
│   ├── db_setup.py    # Solo para la configuración inicial de tablas
│   └── __init__.py
├── db.py               # Mantiene solo la conexión
