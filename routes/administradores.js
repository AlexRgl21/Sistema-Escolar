const express = require('express');
const router = express.Router();
const controller = require('../controllers/administradores.controller');

router.post('/login', controller.loginadministrador);

router.get('/', controller.obteneradministradores);
router.get('/:id_administrador', controller.obtenerunadministrador);
router.post('/', controller.crearadministrador);
router.put('/:id_administrador', controller.actualizaradministrador);
router.delete('/:id_administrador', controller.eliminaradministrador);

module.exports = router;
