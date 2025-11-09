const express = require('express');
const router = express.Router();
const tiposController = require('../../controllers/TiposPessoasController');

router.get('/visualizar', tiposController.visualizarTipos);

module.exports = router;
