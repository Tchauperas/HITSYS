const produto = require("../../controllers/ProdutoController");

class ProdutoController {
  async cadastrarProduto(req, res) {
    let data = req.body;
    if (data != undefined) {
      try {
        let result = await produto.cadastrarProduto(data);
        result.validated
          ? res.status(201).json({
              success: true,
              message: "Produto cadastrado com sucesso",
            })
          : res.status(400).json({
              success: false,
              message: `Erro ao cadastrar produto: ${result.error}`,
            });
      } catch (e) {
        res.status(500).json({
          success: false,
          message: `Internal server error: ${e.message}`,
        });
      }
    } else {
      res.status(400).json({ success: false, message: "Invalid body request" });
    }
  }

  async visualizarProdutos(req, res) {
    try {
      let result = await produto.visualizarProdutos();
      result.validated
        ? res.status(200).json({ success: true, values: result.values })
        : res
            .status(404)
            .json({ success: false, message: `Erro: ${result.error}` });
    } catch (e) {
      res.status(500).json({
        success: false,
        message: `Internal server error: ${e.message}`,
      });
    }
  }

  async alterarProduto(req, res) {
    let id = req.params.id;
    let data = req.body;
    if ((data != undefined && id != undefined) || !isNaN(id)) {
      try {
        let result = await produto.alterarProduto(id, data);
        result.validated
          ? res
              .status(200)
              .json({ success: true, message: "Produto alterado com sucesso" })
          : res.status(400).json({
              success: false,
              message: `Erro ao alterar produto: ${result.error}`,
            });
      } catch (e) {
        res.status(500).json({
          success: false,
          message: `Internal server error: ${e.message}`,
        });
      }
    } else {
      res.status(400).json({ success: false, message: "Invalid body request" });
    }
  }

  async deletarProduto(req, res) {
    let id = req.params.id;
    if (id != undefined || !isNaN(id)) {
      try {
        let result = await produto.deletarProduto(id);
        result.validated
          ? res
              .status(200)
              .json({ success: true, message: "Produto deletado com sucesso" })
          : res.status(400).json({
              success: false,
              message: `Erro ao deletar produto: ${result.error}`,
            });
      } catch (e) {
        res.status(500).json({
          success: false,
          message: `Internal server error: ${e.message}`,
        });
      }
    } else {
      res.status(400).json({ success: false, message: "Invalid body request" });
    }
  }

  async visualizarProduto(req, res) {
    let id = req.params.id;
    if (id != undefined || !isNaN(id)) {
      try {
        let result = await produto.visualizarProduto(id);
        result.validated
          ? res.status(200).json({ success: true, values: result.values })
          : res
              .status(404)
              .json({ success: false, message: `Erro: ${result.error}` });
      } catch (e) {
        res.status(500).json({
          success: false,
          message: `Internal server error: ${e.message}`,
        });
      }
    } else {
      res.status(400).json({ success: false, message: "Invalid body request" });
    }
  }
}

module.exports = new ProdutoController();
