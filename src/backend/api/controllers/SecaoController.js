const secao = require("../models/Secao");

class SecaoController {
  async cadastrarSecao(req, res) {
    let data = req.body;
    if (data != undefined) {
      try {
        let result = await secao.cadastrarSecao(data);
        result.validated
          ? res.status(201).json({
              success: true,
              message: "Seção cadastrada com sucesso",
            })
          : res.status(400).json({
              success: false,
              message: `Erro ao cadastrar seção: ${result.error}`,
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

  async visualizarSecoes(req, res) {
    try {
      let result = await secao.visualizarSecoes();
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

  async alterarSecao(req, res) {
    let id = req.params.id;
    let data = req.body;
    if (!(isNaN(id) || data != undefined)) {
      try {
        let result = await secao.alterarSecao(id, data);
        result.validated
          ? res
              .status(200)
              .json({ success: true, message: "Seção alterada com sucesso" })
          : res.status(400).json({
              success: false,
              message: `Erro ao alterar seção: ${result.error}`,
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

  async deletarSecao(req, res) {
    let id = req.params.id;
    if (!isNaN(id)) {
      try {
        let result = await secao.deletarSecao(id);
        result.validated
          ? res
              .status(200)
              .json({ success: true, message: "Seção deletada com sucesso" })
          : res.status(400).json({
              success: false,
              message: `Erro ao deletar seção: ${result.error}`,
            });
      } catch (e) {
        res.status(500).json({
          success: false,
          message: `Internal server error: ${e.message}`,
        });
      }
    } else {
      res.status(400).json({ success: false, message: "Invalid id parameter" });
    }
  }

  async visualizarSecao(req, res) {
    let id = req.params.id;
    if (!isNaN(id)) {
      try {
        let result = await secao.visualizarSecao(id);
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
      res.status(400).json({ success: false, message: "Invalid id parameter" });
    }
  }
}

module.exports = new SecaoController();
