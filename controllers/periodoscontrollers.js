const db = require('../db');

// OBTENER TODOS
exports.obtenerperiodos = (req, res) => {
    const sql = 'SELECT * FROM periodos ORDER BY fecha_inicio DESC';

    db.query(sql, (err, results) => {
        if (err) {
            res.status(500).json(err);
            return;
        }
        res.json(results);
    });
};

// OBTENER UNO
exports.obtenerperiodo = (req, res) => {
    const { id } = req.params;

    const sql = 'SELECT * FROM periodos WHERE id_periodos = ?';

    db.query(sql, [id], (err, results) => {
        if (err) {
            res.status(500).json(err);
            return;
        }

        if (results.length === 0) {
            res.status(404).json({ mensaje: 'Periodo no encontrado' });
            return;
        }

        res.json(results[0]);
    });
};

// CREAR
exports.crearperiodo = (req, res) => {
    const {
        nombre_periodo,
        fecha_inicio,
        fecha_fin,
        estatus
    } = req.body;

    const sql = `
        INSERT INTO periodos
        (nombre_periodo, fecha_inicio, fecha_fin, estatus)
        VALUES (?, ?, ?, ?)
    `;

    db.query(
        sql,
        [nombre_periodo, fecha_inicio, fecha_fin, estatus],
        (err, result) => {
            if (err) {
                res.status(500).json(err);
                return;
            }
            res.json({
                mensaje: 'Periodo creado',
                id: result.insertId
            });
        }
    );
};

// ACTUALIZAR
exports.actualizarperiodo = (req, res) => {
    const { id } = req.params;

    const {
        nombre_periodo,
        fecha_inicio,
        fecha_fin,
        estatus
    } = req.body;

    const sql = `
        UPDATE periodos
        SET nombre_periodo = ?,
            fecha_inicio = ?,
            fecha_fin = ?,
            estatus = ?
        WHERE id_periodos = ?
    `;

    db.query(
        sql,
        [nombre_periodo, fecha_inicio, fecha_fin, estatus, id],
        (err) => {
            if (err) {
                res.status(500).json(err);
                return;
            }
            res.json({
                mensaje: 'Periodo actualizado'
            });
        }
    );
};

// OBTENER DETALLE (datos del periodo + alumnos inscritos en ese periodo)
exports.obtenerdetalleperiodo = (req, res) => {
    const { id } = req.params;

    const sqlPeriodo = `
        SELECT id_periodos, nombre_periodo, fecha_inicio, fecha_fin, estatus
        FROM periodos
        WHERE id_periodos = ?
    `;

    db.query(sqlPeriodo, [id], (err, periodoResults) => {
        if (err) {
            res.status(500).json(err);
            return;
        }

        if (periodoResults.length === 0) {
            res.status(404).json({ mensaje: 'Periodo no encontrado' });
            return;
        }

        // Alumnos inscritos en este periodo, con la materia en la que están inscritos
        const sqlAlumnos = `
            SELECT
                a.id_alumno,
                a.nombre,
                a.apellidos,
                a.correo,
                a.estatus AS estatus_alumno,
                i.id_inscripcion,
                m.id_materia,
                m.nombre_materia
            FROM inscripciones i
            INNER JOIN alumnos a ON i.id_alumno = a.id_alumno
            LEFT JOIN materias m ON i.id_materia = m.id_materia
            WHERE i.id_periodo = ?
            ORDER BY a.id_alumno ASC, m.nombre_materia ASC
        `;

        db.query(sqlAlumnos, [id], (err, filas) => {
            if (err) {
                res.status(500).json(err);
                return;
            }

            // Agrupa las filas por alumno: en vez de un registro por cada
            // materia (lo que repetía al alumno varias veces), se arma un
            // solo objeto por alumno con la lista completa de sus materias
            // inscritas en este periodo.
            const alumnosMap = new Map();

            filas.forEach((fila) => {
                if (!alumnosMap.has(fila.id_alumno)) {
                    alumnosMap.set(fila.id_alumno, {
                        id_alumno: fila.id_alumno,
                        nombre: fila.nombre,
                        apellidos: fila.apellidos,
                        correo: fila.correo,
                        estatus_alumno: fila.estatus_alumno,
                        materias: []
                    });
                }

                if (fila.id_materia) {
                    alumnosMap.get(fila.id_alumno).materias.push({
                        id_inscripcion: fila.id_inscripcion,
                        id_materia: fila.id_materia,
                        nombre_materia: fila.nombre_materia
                    });
                }
            });

            res.json({
                periodo: periodoResults[0],
                alumnosInscritos: Array.from(alumnosMap.values())
            });
        });
    });
};

// ELIMINAR
exports.eliminarperiodo = (req, res) => {
    const { id } = req.params;

    const sql = 'DELETE FROM periodos WHERE id_periodos = ?';

    db.query(sql, [id], (err) => {
        if (err) {
            res.status(500).json(err);
            return;
        }
        res.json({
            mensaje: 'Periodo eliminado'
        });
    });
};
