const express = require("express");
const router = express.Router();
const FormaPagamentoController = require("../../controllers/FormaPagamentoController");

router.get("/visualizar", FormaPagamentoController.visualizar);
router.post("/cadastrar", FormaPagamentoController.cadastrar);
router.put("/alterar/:id", FormaPagamentoController.alterar);
router.delete("/deletar/:id", FormaPagamentoController.deletar);

module.exports = router;
