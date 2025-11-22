const express = require("express");
const router = express.Router();
const pagamentoVendaController = require("../../controllers/PagamentoVendaController");

router.post("/criar", pagamentoVendaController.criarPagamentosVenda);
router.get("/visualizar/:id_venda", pagamentoVendaController.visualizarPagamentosVenda);

module.exports = router;
