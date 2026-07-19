const db = require('../db');

// OBTENER TODOS (más recientes primero), con el nombre de quién lo publicó
exports.obteneranuncios = (req, res) => {
    const sql = `
        SELECT
            a.id_anuncio,
            a.titulo,
            a.contenido,
            a.fecha_publicacion,
            a.id_administrador,
            ad.nombre AS nombre_administrador,
            ad.apellidos AS apellidos_administrador
        FROM anuncios a
        LEFT JOIN administradores ad ON a.id_administrador = ad.id_administrador
        ORDER BY a.fecha_publicacion DESC
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
exports.obteneranuncio = (req, res) => {
    const { id } = req.params;

    const sql = `
        SELECT
            a.id_anuncio,
            a.titulo,
            a.contenido,
            a.fecha_publicacion,
            a.id_administrador,
            ad.nombre AS nombre_administrador,
            ad.apellidos AS apellidos_administrador
        FROM anuncios a
        LEFT JOIN administradores ad ON a.id_administrador = ad.id_administrador
        WHERE a.id_anuncio = ?
    `;

    db.query(sql, [id], (err, results) => {
        if (err) {
            res.status(500).json(err);
            return;
        }

        if (results.length === 0) {
            res.status(404).json({ mensaje: 'Anuncio no encontrado' });
            return;
        }

        res.json(results[0]);
    });
};

// CREAR
exports.crearanuncio = (req, res) => {
    const {
        titulo,
        contenido,
        id_administrador
    } = req.body;

    const sql = `
        INSERT INTO anuncios
        (titulo, contenido, id_administrador)
        VALUES (?, ?, ?)
    `;

    db.query(
        sql,
        [titulo, contenido, id_administrador || null],
        (err, result) => {
            if (err) {
                res.status(500).json(err);
                return;
            }
            res.json({
                mensaje: 'Anuncio publicado',
                id: result.insertId
            });
        }
    );
};

// ACTUALIZAR
exports.actualizaranuncio = (req, res) => {
    const { id } = req.params;

    const {
        titulo,
        contenido
    } = req.body;

    const sql = `
        UPDATE anuncios
        SET titulo = ?,
            contenido = ?
        WHERE id_anuncio = ?
    `;

    db.query(
        sql,
        [titulo, contenido, id],
        (err) => {
            if (err) {
                res.status(500).json(err);
                return;
            }
            res.json({
                mensaje: 'Anuncio actualizado'
            });
        }
    );
};

// ELIMINAR
exports.eliminaranuncio = (req, res) => {
    const { id } = req.params;

    const sql = 'DELETE FROM anuncios WHERE id_anuncio = ?';

    db.query(sql, [id], (err) => {
        if (err) {
            res.status(500).json(err);
            return;
        }
        res.json({
            mensaje: 'Anuncio eliminado'
        });
    });
};
