const express = require("express");
const router = express.Router();
const empresa = require("../../controllers/EmpresaController")

router.get("/", (req, res) => {
  res.redirect("http://localhost:5173/empresas");
});

router.post("/cadastrar", empresa.cadastrarEmpresa)
router.get("/visualizar", empresa.visualizarEmpresas)
router.get("/visualizar/:id", empresa.visualizarEmpresa)
router.put("/alterar/:id", empresa.alterarEmpresa)
router.delete("/deletar/:id", empresa.deletarEmpresa)

module.exports = router;
