const cidade = require("../models/Cidade");
const auditar = require("../services/auditar");

class CidadeController {
  async cadastrarCidade(req, res) {
    let data = req.body;
    if (data != undefined) {
      try {
        let result = await cidade.cadastrarCidade(data);
        if (result.validated) {
          await auditar(
            req.headers.authorization,
            1,
            `Cadastrou cidade: ${data.nome || 'sem nome'}`
          );
          res.status(201).json({
            success: true,
            message: "Cidade cadastrada com sucesso",
          });
        } else {
          res.status(400).json({
            success: false,
            message: `Erro ao cadastrar cidade: ${result.error}`,
          });
        }
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
      if (result.validated) {
        await auditar(
          req.headers.authorization,
          2,
          `Visualizou lista de cidades`
        );
        res.status(200).json({ success: true, values: result.values });
      } else {
        res.status(404).json({
          success: false,
          message: `Erro ao listar cidades: ${result.error}`,
        });
      }
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
        if (result.validated) {
          await auditar(
            req.headers.authorization,
            3,
            `Alterou cidade ID: ${id}`
          );
          res.status(200).json({ success: true });
        } else {
          res.status(404).json({
            success: false,
            message: `Erro ao alterar cidade: ${result.error}`,
          });
        }
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
        if (result.validated) {
          await auditar(
            req.headers.authorization,
            4,
            `Deletou cidade ID: ${id}`
          );
          res.status(200).json({ success: true });
        } else {
          res.status(404).json({
            success: false,
            message: `Erro ao deletar cidade: ${result.error}`,
          });
        }
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
        if (result.validated) {
          await auditar(
            req.headers.authorization,
            5,
            `Visualizou cidade ID: ${id}`
          );
          res.status(200).json({ success: true, values: result.values });
        } else {
          res.status(404).json({
            success: false,
            message: `Erro ao visualizar cidade: ${result.error}`,
          });
        }
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