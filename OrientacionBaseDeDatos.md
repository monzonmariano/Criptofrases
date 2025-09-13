1. Conectarse a la consola de psql

Usa este comando para iniciar sesión como el usuario por defecto "postgres", que tiene permisos de superusuario.

psql -U postgres

2. Crear un nuevo usuario (rol)

Una vez dentro de la consola (el prompt cambiará a postgres=#), usa este comando para crear un usuario con el mismo nombre que tu usuario de sistema.

CREATE ROLE "nombre_usuario" WITH LOGIN CREATEDB PASSWORD 'tu_contraseña_segura';

Nota: Reemplaza tu_contraseña_segura con una contraseña fuerte y que recuerdes.
3. Crear una nueva base de datos

Ahora que tu usuario existe, puedes crear una base de datos y asignársela como propietario.

CREATE DATABASE mi_nueva_db WITH OWNER nombre_usuario;

4. Ver todas las bases de datos

Puedes usar este comando para listar todas las bases de datos que existen en tu sistema.

\l

5. Conectarse a una base de datos específica

Usa este comando para cambiar de base de datos y trabajar dentro de ella.

\c mi_nueva_db

6. Salir de la consola de psql

Cuando termines de trabajar, usa este comando para salir de la consola y volver a la terminal de tu sistema.

\qCambia al usuario postgres de tu sistema operativo.
Para obtener los permisos necesarios, debes actuar como el usuario postgres del sistema.
Bash

sudo -i -u postgres

Este comando te convertirá en el usuario postgres en tu terminal. Verás que el prompt (el texto que indica que puedes escribir un comando) cambiará.

Ahora, conéctate a la base de datos.
Como ya eres el usuario postgres del sistema, la autenticación "peer" funcionará y podrás acceder a la consola de PostgreSQL.
Bash

psql

Si todo va bien, verás el prompt de la consola de psql (postgres=#).

Crea un nuevo usuario (rol) para ti.
Una vez dentro, puedes crear un nuevo rol de usuario con tu nombre y una contraseña. Este es el método más seguro y recomendado para el uso diario.
SQL

CREATE ROLE tu_nombre_de_usuario WITH LOGIN CREATEDB PASSWORD 'tu_contraseña_segura';

Importante: Reemplaza tu_nombre_de_usuario con el nombre de usuario que uses en tu computadora (por ejemplo, mariano) y tu_contraseña_segura con una contraseña fuerte.

Crea una base de datos para tu nuevo usuario.
Ahora crea una base de datos y asígnale la propiedad a tu nuevo usuario.
SQL

    CREATE DATABASE mi_db WITH OWNER tu_nombre_de_usuario;

    Sal de la consola y vuelve a tu usuario.
    Escribe \q y presiona Enter para salir de la consola de psql. Luego escribe exit para volver a tu usuario original de la terminal.

Ahora, cuando quieras conectarte a tu base de datos, puedes hacerlo directamente con tu propio usuario y la contraseña que creaste.
Bash

psql -U tu_nombre_de_usuario -d mi_db

🔑 Solución Rápida: Conectarse a través de localhost

La forma más sencilla de evitar la autenticación peer es forzar a psql a conectarse a través de la red local, lo que activará la autenticación por contraseña.

Usa este comando en tu terminal, añadiendo -h localhost:
Bash

psql -U criptofrases_user -d mi_nueva_db -h localhost

Te pedirá la contraseña que definiste para criptofrases_user y deberías poder conectarte sin problemas.


psql: error: connection to server on socket "/var/run/postgresql/.s.PGSQL.5432" failed: FATAL:  Peer authentication failed for user "criptofrases_user" 

🔧 Solución Permanente: Cambiar el Método de Autenticación

Esta es la solución recomendada si vas a trabajar mucho con este usuario. Consiste en editar el archivo de configuración de PostgreSQL para que pida contraseña en lugar de usar la autenticación peer.

    Encuentra el archivo pg_hba.conf:
    Ejecuta este comando para que PostgreSQL te diga dónde está el archivo.
    Bash

sudo -u postgres psql -c 'SHOW hba_file;'

Te devolverá una ruta, por ejemplo: /etc/postgresql/15/main/pg_hba.conf.

Edita el archivo:
Usa nano o tu editor preferido con sudo para abrir esa ruta.
Bash

sudo nano /etc/postgresql/15/main/pg_hba.conf

Modifica la línea de conexión local:
Busca una línea que se parezca a esta:

# "local" is for Unix domain socket connections only
local   all             all                                     peer

Cambia la palabra peer por scram-sha-256 (o md5 si usas una versión más antigua de PostgreSQL).

# "local" is for Unix domain socket connections only
local   all             all                                     scram-sha-256

Guarda el archivo y ciérralo (en nano, es Ctrl+O, Enter, y luego Ctrl+X).

Reinicia el servicio de PostgreSQL:
Para que los cambios surtan efecto, debes reiniciar el servicio.
Bash

    sudo systemctl restart postgresql

Ahora, cuando intentes conectarte con el comando original, te pedirá la contraseña en lugar de darte el error de peer authentication.

SI no funciona y sale error : 

Crear por única vez la tabla principal de nuestra base de datos criptofrases_db:

CREATE TABLE entries (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    result TEXT NOT NULL,
    author TEXT,
    is_cryptogram BOOLEAN NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    user_id TEXT NOT NULL
);
