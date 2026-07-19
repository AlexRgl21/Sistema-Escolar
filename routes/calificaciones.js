const express = require('express');
const router = express.Router();
const controller = require('../controllers/calificacionescontrollers');

router.post('/', controller.crearcalificacion);
router.delete('/:id', controller.eliminarcalificacion);

module.exports = router;
