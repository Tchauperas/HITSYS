const express = require('express');
const router = express.Router();
const tiposController = require('../../controllers/TiposCadastrosController');

router.get('/visualizar', tiposController.visualizarTipos);

module.exports = router;
