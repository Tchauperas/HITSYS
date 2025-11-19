const express = require("express");
const router = express.Router();
const relatorio = require("../../controllers/RelatorioController");

router.get("/vendas/periodo", relatorio.vendasPorPeriodo);
router.get("/vendas/dia", relatorio.vendasPorDia);
router.get("/vendas/mes", relatorio.vendasPorMes);
router.get("/comissao/vendedores", relatorio.comissaoVendedores);

module.exports = router;
