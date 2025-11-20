const express = require("express");
const router = express.Router();
const relatorio = require("../../controllers/RelatorioController");

router.post("/vendas/periodo", relatorio.vendasPorPeriodo);
router.post("/vendas/dia", relatorio.vendasPorDia);
router.post("/vendas/mes", relatorio.vendasPorMes);
router.post("/comissao/vendedores", relatorio.comissaoVendedores);

module.exports = router;
