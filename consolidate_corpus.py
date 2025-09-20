# consolidate_corpus.py
import os
import logging

# Configuración básica de logging para ver el progreso
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(message)s')

# --- DEFINICIÓN DE RUTAS ---
# Directorio donde has guardado todos los archivos .txt
SOURCE_DIR = os.path.join('backend', 'data', 'corpus_sources')
# Directorio de datos principal
DATA_DIR = os.path.join('backend', 'data')
# Nombre del archivo final consolidado
DESTINATION_FILE = os.path.join(DATA_DIR, 'frecuencia_corpus.txt')


def consolidate_texts():
    """
    Lee todos los archivos .txt de un directorio fuente, los une en una
    sola cadena de texto y la guarda en un archivo de destino.
    """
    if not os.path.isdir(SOURCE_DIR):
        logging.error(f"❌ ERROR: El directorio fuente no existe: '{SOURCE_DIR}'")
        return

    all_texts = []
    logging.info(f"📚 Empezando a leer archivos desde '{SOURCE_DIR}'...")

    try:
        # Itera sobre cada archivo en el directorio fuente
        for filename in sorted(os.listdir(SOURCE_DIR)):
            if filename.endswith('.txt'):
                file_path = os.path.join(SOURCE_DIR, filename)
                logging.info(f"  -> Procesando archivo: {filename}")
                
                # Leemos el contenido del archivo con codificación utf-8
                with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                    all_texts.append(f.read())

        if not all_texts:
            logging.warning("⚠️ No se encontraron archivos .txt para procesar.")
            return

        # Une todos los textos con un salto de línea doble para separarlos
        consolidated_content = "\n\n".join(all_texts)

        # Guarda el contenido consolidado en el archivo de destino
        with open(DESTINATION_FILE, 'w', encoding='utf-8') as f:
            f.write(consolidated_content)
        
        logging.info(f"✅ ¡Éxito! Se ha creado el corpus consolidado en '{DESTINATION_FILE}'")
        logging.info(f"   -> Total de caracteres: {len(consolidated_content):,}")

    except Exception as e:
        logging.error(f"❌ ERROR: Ocurrió un error durante el proceso: {e}")

if __name__ == '__main__':
    consolidate_texts()