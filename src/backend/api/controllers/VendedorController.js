const vendedor = require("../models/Vendedor");

class VendedorController {
  async cadastrarVendedor(req, res) {
    let data = req.body;
    if (data != undefined) {
      try {
        let result = await vendedor.cadastrarVendedor(data);
        result.validated
          ? res
              .status(201)
              .json({ success: true, message: "Vendedor cadastrado com sucesso" })
          : res.status(400).json({
              success: false,
              message: `Erro ao cadastrar vendedor: ${result.error}`,
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

  async visualizarVendedores(req, res) {
    try {
      let result = await vendedor.visualizarVendedores();
      result.validated
        ? res.status(200).json({ success: true, values: result.values })
        : res.status(404).json({
            success: false,
            message: `Erro ao listar vendedores: ${result.error}`,
          });
    } catch (e) {
      res.status(500).json({
        success: false,
        message: `Internal server error: ${e.message}`,
      });
    }
  }

  async alterarVendedor(req, res) {
    let id = req.params.id;
    if (!isNaN(id)) {
      try {
        let result = await vendedor.alterarVendedor(id, req.body);
        result.validated
          ? res
              .status(200)
              .json({ success: true, message: "Vendedor alterado com sucesso" })
          : res.status(404).json({
              success: false,
              message: `Erro ao alterar vendedor: ${result.error}`,
            });
      } catch (e) {
        res.status(500).json({
          success: false,
          message: `Internal server error: ${e.message}`,
        });
      }
    } else {
      res.status(400).json({ success: false, message: "ID de busca inválido" });
    }
  }

  async deletarVendedor(req, res) {
    let id = req.params.id;
    if (!isNaN(id)) {
      try {
        let result = await vendedor.deletarVendedor(id);
        result.validated
          ? res
              .status(200)
              .json({ success: true, message: "Vendedor deletado com sucesso" })
          : res.status(404).json({
              success: false,
              message: `Erro ao deletar vendedor: ${result.error}`,
            });
      } catch (e) {
        res.status(500).json({
          success: false,
          message: `Internal server error: ${e.message}`,
        });
      }
    } else {
      res.status(400).json({ success: false, message: "ID de busca inválido" });
    }
  }

  async visualizarVendedor(req, res) {
    let id = req.params.id;
    if (!isNaN(id)) {
      try {
        let result = await vendedor.visualizarVendedor(id);
        result.validated
          ? res.status(200).json({ success: true, values: result.values })
          : res.status(404).json({
              success: false,
              message: `Erro ao visualizar vendedor: ${result.error}`,
            });
      } catch (e) {
        res.status(500).json({
          success: false,
          message: `Internal server error: ${e.message}`,
        });
      }
    } else {
      res.status(400).json({ success: false, message: "ID de busca inválido" });
    }
  }
}

module.exports = new VendedorController();