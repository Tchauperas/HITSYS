const express = require("express");
const router = express.Router();
const unidade = require("../../controllers/UnidadeController");

router.post("/cadastrar", unidade.cadastrarUnidade);
router.get("/visualizar", unidade.visualizarUnidades);
router.put("/alterar/:id", unidade.alterarUnidade);
router.delete("/deletar/:id", unidade.deletarUnidade);
router.get("/visualizar/:id", unidade.visualizarUnidade);

module.exports = router;