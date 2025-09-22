+-----------+
|           |        1. Petición Segura
|  USUARIO  +--------------------------------> +-------------------+
|           |         (HTTPS encriptado)       |                   |
+-----------+                                  |     REVERSE       | (Internet Público)
                                               |      PROXY        |
                                               |(Nginx / Google LB)|
+-----------+                                  |                   |
|           |        4. Respuesta Segura       |    (Maneja el     |
|  NUESTRO  | <--------------------------------+     Certificado   |
|  BACKEND  |        3. Petición Interna       |      SSL/TLS)     |
| (Python)  |          (HTTP rápido)           |                   |
+-----------+                                  +-------------------+
  (Red Privada y Segura del Servidor)