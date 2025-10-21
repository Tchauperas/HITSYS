const grupo = require("../models/Grupo");

class GrupoController {
  async cadastrarGrupo(req, res) {
    let data = req.body;
    if (data != undefined) {
      try {
        let result = await grupo.cadastrarGrupo(data);
        result.validated
          ? res.status(201).json({
              success: true,
              message: "Grupo cadastrado com sucesso",
            })
          : res.status(400).json({
              success: false,
              message: `Erro ao cadastrar grupo: ${result.error}`,
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

  async visualizarGrupos(req, res) {
    try {
      let result = await grupo.visualizarGrupos();
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

  async alterarGrupo(req, res) {
    let id = req.params.id;
    let data = req.body;
    if (!(isNaN(id) || data != undefined)) {
      try {
        let result = await grupo.alterarGrupo(id, data);
        result.validated
          ? res
              .status(200)
              .json({ success: true, message: "Grupo alterado com sucesso" })
          : res.status(400).json({
              success: false,
              message: `Erro ao alterar grupo: ${result.error}`,
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

  async deletarGrupo(req, res) {
    let id = req.params.id;
    if (!isNaN(id)) {
      try {
        let result = await grupo.deletarGrupo(id);
        result.validated
          ? res
              .status(200)
              .json({ success: true, message: "Grupo deletado com sucesso" })
          : res.status(400).json({
              success: false,
              message: `Erro ao deletar grupo: ${result.error}`,
            });
      } catch (e) {
        res.status(500).json({
          success: false,
          message: `Internal server error: ${e.message}`,
        });
      }
    } else {
      res.status(400).json({ success: false, message: "Id de busca inválido" });
    }
  }

  async visualizarGrupo(req, res) {
    let id = req.params.id;
    if (!isNaN(id)) {
      try {
        let result = await grupo.visualizarGrupo(id);
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
      res.status(400).json({ success: false, message: "Id de busca inválido" });
    }
  }
}

module.exports = new GrupoController();
