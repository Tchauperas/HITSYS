const express = require("express");
const router = express.Router();
const CidadeController = require("../../controllers/CidadeController");

router.post("/cidades", CidadeController.cadastrarCidade);
router.get("/cidades", CidadeController.visualizarCidades);
router.get("/cidades/:id", CidadeController.visualizarCidade);
router.put("/cidades/:id", CidadeController.alterarCidade);
router.delete("/cidades/:id", CidadeController.deletarCidade);

module.exports = router;
