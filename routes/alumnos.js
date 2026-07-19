const express = require('express');
const router = express.Router();
const controller = require('../controllers/alumnos.controller');

router.get('/', controller.obteneralumnos);
router.get('/:id', controller.obteneralumno);
router.get('/:id/detalle', controller.obtenerdetallealumno);
router.post('/login', controller.loginalumno);
router.post('/', controller.crearalumno);
router.put('/:id', controller.actualizaralumno);
router.delete('/:id', controller.eliminaralumno);

module.exports = router;
