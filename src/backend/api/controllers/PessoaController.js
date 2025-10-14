const pessoa = require("../models/Pessoa");

class PessoaController {
  async cadastrarPessoa(req, res) {
    let data = req.body;
    if (data != undefined) {
      try {
        let result = await pessoa.cadastrarPessoa(data);
        result.validated
          ? res
              .status(201)
              .json({ success: true, message: "Pessoa cadastrada com sucesso" })
          : res.status(400).json({
              success: false,
              message: `Erro ao cadastrar pessoa: ${result.error}`,
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

  async visualizarPessoas(req, res) {
    try {
      let result = await pessoa.visualizarPessoas();
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

  async alterarPessoa(req, res) {
    let id = req.params.id;
    let data = req.body;
    if (data != undefined && id != undefined || !(isNaN(id))) {
      try {
        let result = await pessoa.alterarPessoa(id, data);
        result.validated
          ? res
              .status(200)
              .json({ success: true, message: "Pessoa alterada com sucesso" })
          : res.status(400).json({
              success: false,
              message: `Erro ao alterar pessoa: ${result.error}`,
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

  async deletarPessoa(req, res) {
    let id = req.params.id;
    if (id != undefined || !(isNaN(id))) {
      try {
        let result = await pessoa.deletarPessoa(id);
        result.validated
          ? res
              .status(200)
              .json({ success: true, message: "Pessoa deletada com sucesso" })
          : res.status(400).json({
              success: false,
              message: `Erro ao deletar pessoa: ${result.error}`,
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

  async visualizarPessoa(req, res) {
    let id = req.params.id;
    if (id != undefined || !(isNaN(id))) {
      try {
        let result = await pessoa.visualizarPessoa(id);
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

module.exports = new PessoaController();
