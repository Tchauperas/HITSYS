const express = require("express");
const router = express.Router();
const venda = require("../../controllers/VendaController")

router.post("/lancar", venda.lancarVenda)

module.exports = router;
