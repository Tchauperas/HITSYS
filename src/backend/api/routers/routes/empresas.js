const express = require("express");
const router = express.Router();
const empresa = require("../../controllers/EmpresaController")

router.get("/", (req, res) => {
  res.redirect("http://localhost:5173/empresas");
});

router.post("/cadastrar", empresa.cadastrarEmpresa)
router.get("/listar", empresa.visualizarEmpresas)

module.exports = router;
