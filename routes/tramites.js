const express = require('express');
const router = express.Router();
const controller = require('../controllers/tramites.controller');

router.get('/', controller.obtenertramites);
router.get('/:id', controller.obtenertramite);
router.get('/alumno/:id_alumno', controller.obtenertramitesalumno);
router.post('/', controller.creartramite);
router.put('/:id', controller.actualizartramite);

module.exports = router;
