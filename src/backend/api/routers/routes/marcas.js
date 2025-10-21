const express = require("express");
const router = express.Router();
const marca = require("../../controllers/MarcaController");

router.post("/cadastrar", marca.cadastrarMarca);
router.get("/visualizar", marca.visualizarMarcas);
router.get("/visualizar/:id", marca.visualizarMarca);
router.put("/alterar/:id", marca.alterarMarca);
router.delete("/deletar/:id", marca.deletarMarca);

module.exports = router;