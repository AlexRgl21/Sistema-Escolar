const express = require('express');
const router = express.Router();
const controller = require('../controllers/auth.controller');

router.post('/solicitar-codigo', controller.solicitarCodigo);
router.post('/verificar-codigo', controller.verificarCodigo);
router.post('/actualizar-password', controller.actualizarPassword);

module.exports = router;