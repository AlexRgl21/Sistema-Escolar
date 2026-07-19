const express = require('express');
const router = express.Router();
const controller = require('../controllers/periodoscontrollers');

router.get('/', controller.obtenerperiodos);
router.get('/:id', controller.obtenerperiodo);
router.get('/:id/detalle', controller.obtenerdetalleperiodo);
router.post('/', controller.crearperiodo);
router.put('/:id', controller.actualizarperiodo);
router.delete('/:id', controller.eliminarperiodo);

module.exports = router;
