const express = require("express");
const router = express.Router();
const produto = require("../../controllers/ProdutoController");

router.get("/", (req, res) => {
  res.redirect("http://localhost:5173/produtos");
});

router.get("/visualizar", produto.visualizarProdutos);
router.post("/cadastrar", produto.cadastrarProduto);
router.put("/alterar/:id", produto.alterarProduto);
router.delete("/deletar/:id", produto.deletarProduto);
router.get("/visualizar/:id", produto.visualizarProduto);

module.exports = router;
