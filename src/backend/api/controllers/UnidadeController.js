const unidade = require("../models/Unidade");

class UnidadeController {
  async cadastrarUnidade(req, res) {
    let data = req.body;
    if (data != undefined) {
      try {
        let result = await unidade.cadastrarUnidade(data);
        result.validated
          ? res.status(201).json({
              success: true,
              message: "Unidade cadastrada com sucesso",
            })
          : res.status(400).json({
              success: false,
              message: `Erro ao cadastrar unidade: ${result.error}`,
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

  async visualizarUnidades(req, res) {
    try {
      let result = await unidade.visualizarUnidades();
      result.validated
        ? res.status(200).json({ success: true, values: result.values })
        : res.status(400).json({
            success: false,
            message: `Erro ao listar unidades: ${result.error}`,
          });
    } catch (e) {
      res.status(500).json({
        success: false,
        message: `Internal server error: ${e.message}`,
      });
    }
  }

  async alterarUnidade(req, res) {
    let id = req.params.id;
    let data = req.body;
    if (!isNaN(id) && data != undefined) {
      try {
        let result = await unidade.alterarUnidade(id, data);
        result.validated
          ? res
              .status(200)
              .json({ success: true, message: "Unidade alterada com sucesso" })
          : res.status(400).json({
              success: false,
              message: `Erro ao alterar unidade: ${result.error}`,
            });
      } catch (e) {
        res.status(500).json({
          success: false,
          message: `Internal server error: ${e.message}`,
        });
      }
    } else {
      res.status(400).json({ success: false, message: "Invalid parameters" });
    }
  }

  async deletarUnidade(req, res) {
    let id = req.params.id;
    if (!isNaN(id)) {
      try {
        let result = await unidade.deletarUnidade(id);
        result.validated
          ? res
              .status(200)
              .json({ success: true, message: "Unidade deletada com sucesso" })
          : res.status(400).json({
              success: false,
              message: `Erro ao deletar unidade: ${result.error}`,
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

  async visualizarUnidade(req, res) {
    let id = req.params.id;
    if (!isNaN(id)) {
      try {
        let result = await unidade.visualizarUnidade(id);
        result.validated
          ? res.status(200).json({ success: true, values: result.values })
          : res
              .status(404)
              .json({ success: false, message: `Erro: ${result.error}` });
      } catch (e) {
        res
          .status(500)
          .json({
            success: false,
            message: `Internal server error: ${e.message}`,
          });
      }
    } else {
      res.status(400).json({ success: false, message: "Invalid parameters" });
    }
  }
}

module.exports = new UnidadeController();
