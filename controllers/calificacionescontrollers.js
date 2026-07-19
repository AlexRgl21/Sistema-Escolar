const db = require('../db');

// CREAR (captura una calificación para una inscripción específica)
exports.crearcalificacion = (req, res) => {
    const {
        id_inscripcion,
        tipo_corte,
        nota
    } = req.body;

    const sql = `
        INSERT INTO calificaciones
        (id_inscripcion, tipo_corte, nota)
        VALUES (?, ?, ?)
    `;

    db.query(
        sql,
        [id_inscripcion, tipo_corte, nota],
        (err, result) => {
            if (err) {
                res.status(500).json(err);
                return;
            }
            res.json({
                mensaje: 'Calificación registrada',
                id: result.insertId
            });
        }
    );
};

// ELIMINAR
exports.eliminarcalificacion = (req, res) => {
    const { id } = req.params;

    const sql = 'DELETE FROM calificaciones WHERE id_calificacion = ?';

    db.query(sql, [id], (err) => {
        if (err) {
            res.status(500).json(err);
            return;
        }
        res.json({
            mensaje: 'Calificación eliminada'
        });
    });
};
