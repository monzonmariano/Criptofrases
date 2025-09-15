# backend/logger_config.py
import logging
import sys

log = logging.getLogger('CriptofrasesApp')
log.setLevel(logging.DEBUG)
log.propagate = False

if not log.handlers:
    log_format = '%(asctime)s - %(levelname)s - [%(filename)s:%(lineno)d] - %(message)s'
    formatter = logging.Formatter(log_format)
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setFormatter(formatter)
    log.addHandler(console_handler)