const express = require('express');
const router = express.Router();
const controller = require('../controllers/anunciocontrollers');

router.get('/', controller.obteneranuncios);
router.get('/:id', controller.obteneranuncio);
router.post('/', controller.crearanuncio);
router.put('/:id', controller.actualizaranuncio);
router.delete('/:id', controller.eliminaranuncio);

module.exports = router;
