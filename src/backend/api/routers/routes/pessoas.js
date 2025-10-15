const express = require("express");
const router = express.Router();
const pessoa = require("../../controllers/PessoaController");

router.get("/visualizar", pessoa.visualizarPessoas);
router.post("/cadastrar", pessoa.cadastrarPessoa);
router.put("/alterar/:id", pessoa.alterarPessoa);
router.delete("/deletar/:id", pessoa.deletarPessoa);
router.get("/visualizar/:id", pessoa.visualizarPessoa);

module.exports = router;
