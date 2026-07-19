const db = require('../db');

// OBTENER TODOS
exports.obteneralumnos = (req, res) => {
    const sql = 'SELECT * FROM alumnos';

    db.query(sql, (err, results) => {
        if (err) {
            res.status(500).json(err);
            return;
        }
        res.json(results);
    });
};

// OBTENER UNO
exports.obteneralumno = (req, res) => {
    const { id } = req.params;

    const sql = 'SELECT * FROM alumnos WHERE id_alumno = ?';

    db.query(sql, [id], (err, results) => {
        if (err) {
            res.status(500).json(err);
            return;
        }
        res.json(results[0]);
    });
};

// CREAR
// Nota: id_alumno es AUTO_INCREMENT, no se debe enviar desde el front.
exports.crearalumno = (req, res) => {
    const {
        nombre,
        apellidos,
        correo,
        contrasena,
        estatus,
        id_rol
    } = req.body;

    const sql = `
        INSERT INTO alumnos
        (nombre, apellidos, correo, contrasena, estatus, id_rol)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [nombre, apellidos, correo, contrasena, estatus, id_rol || 1],
        (err, result) => {
            if (err) {
                res.status(500).json(err);
                return;
            }
            res.json({
                mensaje: 'Alumno creado',
                id: result.insertId
            });
        }
    );
};

// ACTUALIZAR
exports.actualizaralumno = (req, res) => {
    const { id } = req.params;

    const {
        nombre,
        apellidos,
        correo,
        contrasena,
        estatus,
        id_rol
    } = req.body;

    const sql = `
        UPDATE alumnos
        SET nombre = ?,
            apellidos = ?,
            correo = ?,
            contrasena = ?,
            estatus = ?,
            id_rol = ?
        WHERE id_alumno = ?
    `;

    db.query(
        sql,
        [nombre, apellidos, correo, contrasena, estatus, id_rol, id],
        (err) => {
            if (err) {
                res.status(500).json(err);
                return;
            }
            res.json({
                mensaje: 'Alumno actualizado'
            });
        }
    );
};

// OBTENER DETALLE (inscripciones + materias + periodos + calificaciones)
exports.obtenerdetallealumno = (req, res) => {
    const { id } = req.params;

    const sqlAlumno = `
        SELECT id_alumno, nombre, apellidos, correo, contrasena, estatus, id_rol
        FROM alumnos
        WHERE id_alumno = ?
    `;

    db.query(sqlAlumno, [id], (err, alumnoResults) => {
        if (err) {
            res.status(500).json(err);
            return;
        }

        if (alumnoResults.length === 0) {
            res.status(404).json({ mensaje: 'Alumno no encontrado' });
            return;
        }

        // Nota: la PK de periodos se llama id_periodos (plural),
        // e inscripciones la referencia como id_periodo (singular).
        const sqlInscripciones = `
            SELECT
                i.id_inscripcion,
                m.id_materia,
                m.nombre_materia,
                m.creditos,
                p.id_periodos,
                p.nombre_periodo,
                p.fecha_inicio,
                p.fecha_fin,
                p.estatus AS estatus_periodo
            FROM inscripciones i
            LEFT JOIN materias m ON i.id_materia = m.id_materia
            LEFT JOIN periodos p ON i.id_periodo = p.id_periodos
            WHERE i.id_alumno = ?
            ORDER BY p.fecha_inicio DESC, m.nombre_materia ASC
        `;

        db.query(sqlInscripciones, [id], (err, inscripciones) => {
            if (err) {
                res.status(500).json(err);
                return;
            }

            const sqlCalificaciones = `
                SELECT
                    c.id_calificacion,
                    c.id_inscripcion,
                    c.tipo_corte,
                    c.nota
                FROM calificaciones c
                INNER JOIN inscripciones i ON c.id_inscripcion = i.id_inscripcion
                WHERE i.id_alumno = ?
                ORDER BY c.id_inscripcion, c.tipo_corte
            `;

            db.query(sqlCalificaciones, [id], (err, calificaciones) => {
                if (err) {
                    res.status(500).json(err);
                    return;
                }

                const inscripcionesConNotas = inscripciones.map((insc) => ({
                    ...insc,
                    calificaciones: calificaciones.filter(
                        (c) => c.id_inscripcion === insc.id_inscripcion
                    )
                }));

                res.json({
                    alumno: alumnoResults[0],
                    inscripciones: inscripcionesConNotas
                });
            });
        });
    });
};

// ELIMINAR
exports.eliminaralumno = (req, res) => {
    const { id } = req.params;

    const sql = 'DELETE FROM alumnos WHERE id_alumno = ?';

    db.query(sql, [id], (err) => {
        if (err) {
            res.status(500).json(err);
            return;
        }
        res.json({
            mensaje: 'Alumno eliminado'
        });
    });
};

// LOGIN (solo alumnos)
exports.loginalumno = (req, res) => {
    const { correo, contrasena } = req.body;

    const sql = 'SELECT * FROM alumnos WHERE correo = ? AND contrasena = ?';

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
