const cidade = require("../models/Cidade");

class CidadeController {
  async cadastrarCidade(req, res) {
    let data = req.body;
    if (data != undefined) {
      try {
        let result = await cidade.cadastrarCidade(data);
        result.validated
          ? res.status(201).json({
              success: true,
              message: "Cidade cadastrada com sucesso",
            })
          : res.status(400).json({
              success: false,
              message: `Erro ao cadastrar cidade: ${result.error}`,
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

  async visualizarCidades(req, res) {
    try {
      let result = await cidade.visualizarCidades();
      result.validated
        ? res.status(200).json({ success: true, values: result.values })
        : res.status(404).json({
            success: false,
            message: `Erro ao listar cidades: ${result.error}`,
          });
    } catch (e) {
      res.status(500).json({
        success: false,
        message: `Internal server error: ${e.message}`,
      });
    }
  }

  async alterarCidade(req, res) {
    let id = req.params.id;
    let data = req.body;
    if (!isNaN(id)) {
      try {
        let result = await cidade.alterarCidade(id, data);
        result.validated
          ? res.status(200).json({ success: true })
          : res.status(404).json({
              success: false,
              message: `Erro ao alterar cidade: ${result.error}`,
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

  async deletarCidade(req, res) {
    let id = req.params.id;
    if (!isNaN(id)) {
      try {
        let result = await cidade.deletarCidade(id);
        result.validated
          ? res.status(200).json({ success: true })
          : res.status(404).json({
              success: false,
              message: `Erro ao deletar cidade: ${result.error}`,
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

  async visualizarCidade(req, res) {
    let id = req.params.id;
    if (!isNaN(id)) {
      try {
        let result = await cidade.visualizarCidade(id);
        result.validated
          ? res.status(200).json({ success: true, values: result.values })
          : res.status(404).json({
              success: false,
              message: `Erro ao visualizar cidade: ${result.error}`,
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

module.exports = new CidadeController();