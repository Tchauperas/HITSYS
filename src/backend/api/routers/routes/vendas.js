const express = require("express");
const router = express.Router();
const venda = require("../../controllers/VendaController")

router.post("/lancar", venda.lancarVenda)
router.get("/visualizar/:id", venda.visualizarVenda)

module.exports = router;
