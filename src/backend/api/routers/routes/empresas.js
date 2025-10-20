const express = require("express");
const router = express.Router();
const empresa = require("../../controllers/EmpresaController");
const authEmpresa = require("../../middlewares/EmpresaAuth");

router.post("/cadastrar", authEmpresa.insere_empresa, empresa.cadastrarEmpresa);
router.get(
  "/visualizar",
  authEmpresa.visualiza_empresa,
  empresa.visualizarEmpresas
);
router.get(
  "/visualizar/:id",
  authEmpresa.visualiza_empresa,
  empresa.visualizarEmpresa
);
router.put("/alterar/:id", authEmpresa.altera_empresa, empresa.alterarEmpresa);
router.delete(
  "/deletar/:id",
  authEmpresa.deleta_empresa,
  empresa.deletarEmpresa
);

module.exports = router;
