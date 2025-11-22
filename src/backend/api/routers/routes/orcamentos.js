const express = require("express");
const router = express.Router();
const orcamento = require("../../controllers/OrcamentoController");

router.post("/lancar", orcamento.lancarOrcamento);
router.get("/visualizar/:id", orcamento.visualizarOrcamento);
router.get("/visualizar", orcamento.visualizarOrcamentos);
router.put("/atualizar/:id", orcamento.atualizarOrcamento);
router.delete("/deletar/:id", orcamento.deletarOrcamento);

module.exports = router;
