const express = require("express");
const router = express.Router();
const produto = require("../../controllers/ProdutoController")
const auth = require("../../middlewares/ProdutoAuth")

router.get("/visualizar", auth.visualiza_produto,produto.visualizarProdutos);
router.post("/cadastrar", auth.insere_produto,produto.cadastrarProduto);
router.put("/alterar/:id", auth.altera_produto,produto.alterarProduto);
router.delete("/deletar/:id", auth.deleta_produto,produto.deletarProduto);
router.get("/visualizar/:id", produto.visualizarProduto);

module.exports = router;
