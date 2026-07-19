const express = require('express');
const router = express.Router();
const controller = require('../controllers/materiascontrollers');

router.get('/', controller.obtenermaterias);
router.get('/:id', controller.obtenermateria);
router.post('/', controller.crearmateria);
router.put('/:id', controller.actualizarmateria);
router.delete('/:id', controller.eliminarmateria);

module.exports = router;
