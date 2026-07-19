const db = require('../db');

// OBTENER TODOS (vista de administrador: todos los trámites, con el nombre del alumno)
exports.obtenertramites = (req, res) => {
    const sql = `
        SELECT
            t.id_tramite,
            t.id_alumno,
            al.nombre AS nombre_alumno,
            al.apellidos AS apellidos_alumno,
            t.tipo_tramite,
            t.descripcion,
            t.estatus,
            t.fecha_solicitud,
            t.respuesta,
            t.fecha_respuesta
        FROM tramites t
        LEFT JOIN alumnos al ON t.id_alumno = al.id_alumno
        ORDER BY
            (t.estatus = 'Pendiente') DESC,
            t.fecha_solicitud DESC
    `;

    db.query(sql, (err, results) => {
        if (err) {
            res.status(500).json(err);
            return;
        }
        res.json(results);
    });
};

// OBTENER UNO
exports.obtenertramite = (req, res) => {
    const { id } = req.params;

    const sql = `
        SELECT
            t.id_tramite,
            t.id_alumno,
            al.nombre AS nombre_alumno,
            al.apellidos AS apellidos_alumno,
            al.correo AS correo_alumno,
            t.tipo_tramite,
            t.descripcion,
            t.estatus,
            t.fecha_solicitud,
            t.respuesta,
            t.fecha_respuesta
        FROM tramites t
        LEFT JOIN alumnos al ON t.id_alumno = al.id_alumno
        WHERE t.id_tramite = ?
    `;

    db.query(sql, [id], (err, results) => {
        if (err) {
            res.status(500).json(err);
            return;
        }

        if (results.length === 0) {
            res.status(404).json({ mensaje: 'Trámite no encontrado' });
            return;
        }

        res.json(results[0]);
    });
};

// OBTENER LOS TRÁMITES DE UN ALUMNO EN PARTICULAR (vista del portal del alumno)
exports.obtenertramitesalumno = (req, res) => {
    const { id_alumno } = req.params;

    const sql = `
        SELECT
            id_tramite,
            tipo_tramite,
            descripcion,
            estatus,
            fecha_solicitud,
            respuesta,
            fecha_respuesta
        FROM tramites
        WHERE id_alumno = ?
        ORDER BY fecha_solicitud DESC
    `;

    db.query(sql, [id_alumno], (err, results) => {
        if (err) {
            res.status(500).json(err);
            return;
        }
        res.json(results);
    });
};

// CREAR (el alumno levanta una solicitud nueva)
exports.creartramite = (req, res) => {
    const {
        id_alumno,
        tipo_tramite,
        descripcion
    } = req.body;

    const sql = `
        INSERT INTO tramites
        (id_alumno, tipo_tramite, descripcion, estatus)
        VALUES (?, ?, ?, 'Pendiente')
    `;

    db.query(
        sql,
        [id_alumno, tipo_tramite, descripcion],
        (err, result) => {
            if (err) {
                res.status(500).json(err);
                return;
            }
            res.json({
                mensaje: 'Trámite enviado',
                id: result.insertId
            });
        }
    );
};

// ACTUALIZAR (el administrador cambia el estatus y responde)
exports.actualizartramite = (req, res) => {
    const { id } = req.params;

    const {
        estatus,
        respuesta,
        id_administrador
    } = req.body;

    const sql = `
        UPDATE tramites
        SET estatus = ?,
            respuesta = ?,
            fecha_respuesta = CURRENT_TIMESTAMP,
            id_administrador = ?
        WHERE id_tramite = ?
    `;

    db.query(
        sql,
        [estatus, respuesta, id_administrador || null, id],
        (err) => {
            if (err) {
                res.status(500).json(err);
                return;
            }
            res.json({
                mensaje: 'Trámite actualizado'
            });
        }
    );
};
