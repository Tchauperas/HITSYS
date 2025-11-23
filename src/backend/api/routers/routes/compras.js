const express = require("express");
const router = express.Router();
const compra = require("../../controllers/ComprasController");

router.get("/proximo-numero", compra.obterProximoNumero);
router.post("/lancar", compra.lancarCompra);
router.get("/visualizar/:id", compra.visualizarCompra);
router.get("/visualizar", compra.visualizarCompras);
router.put("/atualizar/:id", compra.atualizarCompra);
router.delete("/deletar/:id", compra.deletarCompra);

module.exports = router;
