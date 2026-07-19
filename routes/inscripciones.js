const express = require('express');
const router = express.Router();
const controller = require('../controllers/inscripcionescontrollers');

router.post('/', controller.crearinscripcion);
router.delete('/:id', controller.eliminarinscripcion);

module.exports = router;
