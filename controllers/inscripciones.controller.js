const db = require('../db');

// CREAR (inscribe a un alumno en una materia dentro de un periodo)
exports.crearinscripcion = (req, res) => {
    const {
        id_alumno,
        id_materia,
        id_periodo
    } = req.body;

    // Evita inscribir dos veces al mismo alumno en la misma materia
    // dentro del mismo periodo
    const sqlExiste = `
        SELECT id_inscripcion FROM inscripciones
        WHERE id_alumno = ? AND id_materia = ? AND id_periodo = ?
    `;

    db.query(sqlExiste, [id_alumno, id_materia, id_periodo], (err, existentes) => {
        if (err) {
            res.status(500).json(err);
            return;
        }

        if (existentes.length > 0) {
            res.status(409).json({
                mensaje: 'Este alumno ya está inscrito en esta materia dentro de este periodo.'
            });
            return;
        }

        const sqlInsertar = `
            INSERT INTO inscripciones
            (id_alumno, id_materia, id_periodo)
            VALUES (?, ?, ?)
        `;

        db.query(
            sqlInsertar,
            [id_alumno, id_materia, id_periodo],
            (err, result) => {
                if (err) {
                    res.status(500).json(err);
                    return;
                }
                res.json({
                    mensaje: 'Materia agregada al periodo',
                    id: result.insertId
                });
            }
        );
    });
};

// ELIMINAR (quita a un alumno de una materia/periodo; sus calificaciones
// de esa inscripción se eliminan en cascada por la FK de calificaciones)
exports.eliminarinscripcion = (req, res) => {
    const { id } = req.params;

    const sql = 'DELETE FROM inscripciones WHERE id_inscripcion = ?';

    db.query(sql, [id], (err) => {
        if (err) {
            res.status(500).json(err);
            return;
        }
        res.json({
            mensaje: 'Inscripción eliminada'
        });
    });
};
