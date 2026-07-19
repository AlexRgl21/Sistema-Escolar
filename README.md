# Gestión Escolar — Backend Node.js

Servidor Express (Node.js) que se conecta a MySQL (base de datos `gestion_escolar`) y sirve el frontend estático en `public/`.

## 1. Requisitos
- Node.js instalado
- MySQL Server corriendo localmente, con la base `gestion_escolar` ya importada (tu archivo `Dump20260701.sql`)

## 2. Instalación
```bash
npm install
```

## 3. Configurar la conexión a MySQL
Edita `db.js` si tu usuario, contraseña o puerto de MySQL son distintos a los que trae por defecto:
```js
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345',
    database: 'gestion_escolar'
});
```

## 4. Levantar el servidor
```bash
npm start
```
Esto ejecuta `node app.js`. Deberías ver en consola:
```
MySQL conectado
Servidor corriendo en puerto 3000
```

Para desarrollo (reinicio automático al guardar cambios):
```bash
npm run dev
```

## 5. Páginas disponibles
- `login.html` — inicio de sesión (valida contra `administradores`)
- `index.html` — alta de alumnos + lista con buscador por ID
- `alumno.html?id=N` — detalle de un alumno: editar sus datos, eliminarlo, y ver sus materias inscritas con sus calificaciones
- `administradores.html` — alta de administradores + lista con buscador por ID
- `administrador.html?id=N` — detalle de un administrador: editar sus datos o eliminarlo

## 6. Endpoints disponibles

### Administradores (`/administradores`)
| Método | Ruta | Descripción |
|---|---|---|
| POST | /administradores/login | Login (correo + contrasena) |
| GET | /administradores | Listar todos |
| GET | /administradores/:id_administrador | Obtener uno |
| POST | /administradores | Crear |
| PUT | /administradores/:id_administrador | Actualizar |
| DELETE | /administradores/:id_administrador | Eliminar |

### Alumnos (`/alumnos`)
| Método | Ruta | Descripción |
|---|---|---|
| GET | /alumnos | Listar todos |
| GET | /alumnos/:id | Obtener uno |
| GET | /alumnos/:id/detalle | Obtener uno + sus inscripciones, materias, periodos y calificaciones |
| POST | /alumnos | Crear |
| PUT | /alumnos/:id | Actualizar |
| DELETE | /alumnos/:id | Eliminar |

## 7. Nota importante
Tu dump (`Dump20260701.sql`) no trae registros en `administradores` ni en `alumnos`, así que para poder iniciar sesión necesitas crear un administrador manualmente, por ejemplo desde MySQL Workbench o consola:
```sql
INSERT INTO administradores (nombre, apellidos, correo, contrasena, estatus, id_rol)
VALUES ('Admin', 'Principal', 'admin@correo.com', '12345', 'Activo', 2);
```
