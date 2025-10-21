const express = require("express");
const router = express.Router();
const secao = require("../../controllers/SecaoController");

router.post("/cadastrar", secao.cadastrarSecao);
router.get("/visualizar", secao.visualizarSecoes);
router.get("/visualizar/:id", secao.visualizarSecao);
router.put("/alterar/:id", secao.alterarSecao);
router.delete("/deletar/:id", secao.deletarSecao);

module.exports = router;