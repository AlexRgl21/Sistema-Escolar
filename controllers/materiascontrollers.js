const db = require('../db');

// OBTENER TODAS
exports.obtenermaterias = (req, res) => {
    const sql = 'SELECT * FROM materias ORDER BY nombre_materia ASC';

    db.query(sql, (err, results) => {
        if (err) {
            res.status(500).json(err);
            return;
        }
        res.json(results);
    });
};

// CREAR (materia nueva, disponible luego para inscribir alumnos en ella)
exports.crearmateria = (req, res) => {
    const {
        nombre_materia,
        creditos
    } = req.body;

    const sql = `
        INSERT INTO materias
        (nombre_materia, creditos)
        VALUES (?, ?)
    `;

    db.query(
        sql,
        [nombre_materia, creditos],
        (err, result) => {
            if (err) {
                res.status(500).json(err);
                return;
            }
            res.json({
                mensaje: 'Materia creada',
                id: result.insertId
            });
        }
    );
};

// OBTENER UNA
exports.obtenermateria = (req, res) => {
    const { id } = req.params;

    const sql = 'SELECT * FROM materias WHERE id_materia = ?';

    db.query(sql, [id], (err, results) => {
        if (err) {
            res.status(500).json(err);
            return;
        }

        if (results.length === 0) {
            res.status(404).json({ mensaje: 'Materia no encontrada' });
            return;
        }

        res.json(results[0]);
    });
};

// ACTUALIZAR
exports.actualizarmateria = (req, res) => {
    const { id } = req.params;

    const {
        nombre_materia,
        creditos
    } = req.body;

    const sql = `
        UPDATE materias
        SET nombre_materia = ?,
            creditos = ?
        WHERE id_materia = ?
    `;

    db.query(
        sql,
        [nombre_materia, creditos, id],
        (err) => {
            if (err) {
                res.status(500).json(err);
                return;
            }
            res.json({
                mensaje: 'Materia actualizada'
            });
        }
    );
};

// ELIMINAR
exports.eliminarmateria = (req, res) => {
    const { id } = req.params;

    const sql = 'DELETE FROM materias WHERE id_materia = ?';

    db.query(sql, [id], (err) => {
        if (err) {
            // La FK de inscripciones no tiene ON DELETE CASCADE a propósito:
            // si hay alumnos inscritos en esta materia, MySQL rechaza el
            // DELETE con error 1451, así que se traduce a un mensaje claro.
            if (err.errno === 1451) {
                res.status(409).json({
                    mensaje: 'No se puede eliminar: hay alumnos inscritos en esta materia. Quita primero esas inscripciones.'
                });
                return;
            }
            res.status(500).json(err);
            return;
        }
        res.json({
            mensaje: 'Materia eliminada'
        });
    });
};
