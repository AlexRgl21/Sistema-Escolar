const db = require('../db');
const emailService = require('../services/email.service');
const tokenService = require('../services/token.service');

exports.solicitarCodigo = (req, res) => {
    const { correo, tabla } = req.body; // 'tabla' puede ser 'alumnos' o 'administradores'
    const sql = `SELECT * FROM ${tabla} WHERE correo = ?`;

    db.query(sql, [correo], async (err, results) => {
        if (err || results.length === 0) return res.status(404).json({ mensaje: 'Correo no encontrado' });

        const token = Math.floor(100000 + Math.random() * 900000).toString();
        tokenService.guardarToken(correo, token);
        
        try {
            await emailService.enviarToken(correo, token);
            res.json({ mensaje: 'Código enviado a tu correo' });
        } catch (e) { res.status(500).json({ mensaje: 'Error al enviar correo' }); }
    });
};

exports.verificarCodigo = (req, res) => {
    const { correo, token } = req.body;
    if (tokenService.validarToken(correo, token)) {
        res.json({ valido: true });
    } else {
        res.status(400).json({ valido: false, mensaje: 'Código inválido o expirado' });
    }
};

exports.actualizarPassword = (req, res) => {
    const { correo, nuevaPass, tabla } = req.body;
    // IMPORTANTE: Asegúrate de validar que el correo ya pasó por la verificación de token antes
    const sql = `UPDATE ${tabla} SET contrasena = ? WHERE correo = ?`;
    
    db.query(sql, [nuevaPass, correo], (err) => {
        if (err) return res.status(500).json({ mensaje: 'Error al actualizar' });
        res.json({ mensaje: 'Contraseña actualizada con éxito' });
    });
};