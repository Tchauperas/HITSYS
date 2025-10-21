const marcas = require("../models/Marca");

class MarcaController {
  async cadastrarMarca(req, res) {
    let data = req.body;
    if (data != undefined) {
      try {
        let result = await marcas.cadastrarMarca(data);
        result.validated
          ? res.status(201).json({
              success: true,
              message: "Marca cadastrada com sucesso",
            })
          : res.status(400).json({
              success: false,
              message: `Erro ao cadastrar marca: ${result.error}`,
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

  async visualizarMarcas(req, res) {
    try {
      let result = await marcas.visualizarMarcas();
      result.validated
        ? res.status(200).json({ success: true, values: result.values })
        : res.status(400).json({
            success: false,
            message: `Erro ao listar marcas: ${result.error}`,
          });
    } catch (e) {
      res.status(500).json({
        success: false,
        message: `Internal server error: ${e.message}`,
      });
    }
  }

  async alterarMarca(req, res) {
    let id = req.params.id;
    let data = req.body;
    if (!isNaN(id) && data != undefined) {
      try {
        let result = await marcas.alterarMarca(id, data);
        result.validated
          ? res
              .status(200)
              .json({ success: true, message: "Marca alterada com sucesso" })
          : res.status(400).json({
              success: false,
              message: `Erro ao alterar marca: ${result.error}`,
            });
      } catch (e) {
        res.status(500).json({
          success: false,
          message: `Internal server error: ${e.message}`,
        });
      }
    } else {
      res.status(400).json({ success: false, message: "Invalid request" });
    }
  }

  async deletarMarca(req, res) {
    let id = req.params.id;
    if (!isNaN(id)) {
      try {
        let result = await marcas.deletarMarca(id);
        result.validated
          ? res
              .status(200)
              .json({ success: true, message: "Marca deletada com sucesso" })
          : res.status(404).json({
              success: false,
              message: `Erro ao deletar marca: ${result.error}`,
            });
      } catch (e) {
        res.status(500).json({
          success: false,
          message: `Internal server error: ${e.message}`,
        });
      }
    } else {
      res.status(400).json({ success: false, message: "Invalid request" });
    }
  }

  async visualizarMarca(req, res) {
    let id = req.params.id;
    if (!isNaN(id)) {
      try {
        let result = await marcas.visualizarMarca(id);
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
      res.status(400).json({ success: false, message: "Invalid request" });
    }
  }
}

module.exports = new MarcaController();
