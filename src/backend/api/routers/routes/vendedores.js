const express = require("express");
const router = express.Router();
const VendedorController = require("../../controllers/VendedorController");

router.post("/vendedores", VendedorController.cadastrarVendedor);
router.get("/vendedores", VendedorController.visualizarVendedores);
router.get("/vendedores/:id", VendedorController.visualizarVendedor);
router.put("/vendedores/:id", VendedorController.alterarVendedor);
router.delete("/vendedores/:id", VendedorController.deletarVendedor);

module.exports = router;
