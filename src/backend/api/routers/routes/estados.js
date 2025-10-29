const express = require("express");
const EstadoController = require("../../controllers/EstadoController");

const router = express.Router();

router.post("/estados", EstadoController.cadastrarEstado);
router.get("/estados", EstadoController.visualizarEstados);
router.get("/estados/:id", EstadoController.visualizarEstado);
router.put("/estados/:id", EstadoController.alterarEstado);
router.delete("/estados/:id", EstadoController.deletarEstado);

module.exports = router;
