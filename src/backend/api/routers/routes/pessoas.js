const express = require("express");
const router = express.Router();
const pessoa = require("../../controllers/PessoaController");
const auth = require("../../middlewares/PessoaAuth")

router.get("/visualizar", auth.visualiza_pessoa,pessoa.visualizarPessoas);
router.post("/cadastrar", auth.insere_pessoa,pessoa.cadastrarPessoa);
router.put("/alterar/:id", auth.altera_pessoa,pessoa.alterarPessoa);
router.delete("/deletar/:id", auth.deleta_pessoa,pessoa.deletarPessoa);
router.get("/visualizar/:id", pessoa.visualizarPessoa);

module.exports = router;
