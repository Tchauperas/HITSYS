const express = require('express');
const router = express.Router();
const grupo = require('../../controllers/GrupoController');

router.post('/cadastrar', grupo.cadastrarGrupo);
router.get('/visualizar', grupo.visualizarGrupos);
router.get('/visualizar/:id', grupo.visualizarGrupo);
router.put('/alterar/:id', grupo.alterarGrupo);
router.delete('/deletar/:id', grupo.deletarGrupo);

module.exports = router;
