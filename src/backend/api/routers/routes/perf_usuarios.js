const express = require("express");
const router = express.Router();
const perf = require("../../controllers/Perf_usuariosController");

router.post("/cadastrar", perf.cadastrarPerfil);
router.get("/visualizar", perf.visualizarPerfis);
router.get("/visualizar/:id", perf.visualizarPerfil);
router.put("/alterar/:id", perf.alterarPerfil);
router.delete("/deletar/:id", perf.deletarPerfil);

module.exports = router;
