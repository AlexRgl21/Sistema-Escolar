const express = require('express');
const router = express.Router();
const controller = require('../controllers/inscripciones.controller');

router.post('/', controller.crearinscripcion);
router.delete('/:id', controller.eliminarinscripcion);

module.exports = router;
