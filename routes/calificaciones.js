const express = require('express');
const router = express.Router();
const controller = require('../controllers/calificaciones.controller');

router.post('/', controller.crearcalificacion);
router.delete('/:id', controller.eliminarcalificacion);

module.exports = router;
