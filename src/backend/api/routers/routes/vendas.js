const express = require("express");
const router = express.Router();
const venda = require("../../controllers/VendaController")

router.post("/lancar", venda.lancarVenda)
router.get("/visualizar/:id", venda.visualizarVenda)
router.get("/visualizar", venda.visualizarVendas)
router.put("/atualizar/:id", venda.atualizarVenda)
router.delete("/deletar/:id", venda.deletarVenda)

module.exports = router;
