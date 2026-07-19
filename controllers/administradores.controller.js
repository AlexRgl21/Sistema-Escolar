const db = require('../db');

// OBTENER TODOS
exports.obteneradministradores = (req, res) => {
    const sql = 'SELECT * FROM administradores';

    db.query(sql, (err, results) => {
        if (err) {
            res.status(500).json(err);
            return;
        }
        res.json(results);
    });
};

// OBTENER UNO
exports.obtenerunadministrador = (req, res) => {
    const { id_administrador } = req.params;

    const sql = 'SELECT * FROM administradores WHERE id_administrador = ?';

    db.query(sql, [id_administrador], (err, results) => {
        if (err) {
            res.status(500).json(err);
            return;
        }

        if (results.length === 0) {
            res.status(404).json({ mensaje: 'Administrador no encontrado' });
            return;
        }

        res.json(results[0]);
    });
};

// CREAR
const emailService = require('../services/email.service');

const generarContrasenaAleatoria = () => {
    return Math.random().toString(36).slice(-8); 
};

exports.crearadministrador = async (req, res) => {
    const { nombre, apellidos, correo, estatus, id_rol } = req.body;
    const contrasenaGenerada = generarContrasenaAleatoria(); 

    const sql = `INSERT INTO administradores (nombre, apellidos, correo, contrasena, estatus, id_rol) VALUES (?, ?, ?, ?, ?, ?)`;

    db.query(sql, [nombre, apellidos, correo, contrasenaGenerada, estatus, id_rol || 2], async (err, result) => {
        if (err) {
            res.status(500).json(err);
            return;
        }

        try {
            await emailService.enviarCredenciales(correo, nombre, correo, contrasenaGenerada);
            res.json({ mensaje: 'Administrador creado y credenciales enviadas', id: result.insertId });
        } catch (emailError) {
            res.json({ mensaje: 'Administrador creado, pero error al enviar correo', id: result.insertId });
        }
    });
};

// ACTUALIZAR
exports.actualizaradministrador = (req, res) => {
    const { id_administrador } = req.params;

    const {
        nombre,
        apellidos,
        correo,
        contrasena,
        estatus,
        id_rol
    } = req.body;

    const sql = `
        UPDATE administradores
        SET nombre = ?,
            apellidos = ?,
            correo = ?,
            contrasena = ?,
            estatus = ?,
            id_rol = ?
        WHERE id_administrador = ?
    `;

    db.query(
        sql,
        [nombre, apellidos, correo, contrasena, estatus, id_rol, id_administrador],
        (err) => {
            if (err) {
                res.status(500).json(err);
                return;
            }
            res.json({
                mensaje: 'Administrador actualizado'
            });
        }
    );
};

// ELIMINAR
exports.eliminaradministrador = (req, res) => {
    const { id_administrador } = req.params;

    const sql = 'DELETE FROM administradores WHERE id_administrador = ?';

    db.query(sql, [id_administrador], (err) => {
        if (err) {
            res.status(500).json(err);
            return;
        }
        res.json({
            mensaje: 'Administrador eliminado'
        });
    });
};

// LOGIN (solo administradores)
exports.loginadministrador = (req, res) => {
    const { correo, contrasena } = req.body;

    const sql = 'SELECT * FROM administradores WHERE correo = ? AND contrasena = ?';

    db.query(sql, [correo, contrasena], (err, results) => {
        if (err) {
            res.status(500).json({
                exito: false,
                mensaje: 'Error en el servidor',
                error: err
            });
            return;
        }

        if (results.length > 0) {
            res.json({
                exito: true,
                mensaje: 'Login exitoso',
                usuario: results[0]
            });
        } else {
            res.status(401).json({
                exito: false,
                mensaje: 'Correo o contraseña incorrectos'
            });
        }
    });
};
