const empresa = require("../models/Empresa");
const auditar = require("../services/auditar");

class EmpresaController {
  async cadastrarEmpresa(req, res) {
    let data = req.body;
    if (data != undefined) {
      try {
        let result = await empresa.cadastrarEmpresa(data);
        if (result.validated) {
          await auditar(
            req.headers.authorization,
            1,
            `Cadastrou empresa: ${data.nome || 'sem nome'}`
          );
          res.status(201).json({
            success: true,
            message: "Empresa cadastrado com sucesso",
          });
        } else {
          res.status(400).json({
            success: false,
            message: `Erro ao cadastrar empresa: ${result.error}`,
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

  async visualizarEmpresas(req, res) {
    try {
      let result = await empresa.visualizarEmpresas();
      if (result.validated) {
        await auditar(
          req.headers.authorization,
          2,
          `Visualizou lista de empresas`
        );
        res.status(200).json({ success: true, values: result.values });
      } else {
        res.status(400).json({
          success: false,
          message: `Erro ao listar empresas: ${result.error}`,
        });
      }
    } catch (e) {
      res.status(500).json({
        success: false,
        message: `Internal server error: ${e.message}`,
      });
    }
  }

  async alterarEmpresa(req, res) {
    let id = req.params.id;
    if (!isNaN(id)) {
      try {
        let result = await empresa.alterarEmpresa(id, req.body);
        if (result.validated) {
          await auditar(
            req.headers.authorization,
            3,
            `Alterou empresa ID: ${id}`
          );
          res.status(200).json({ success: true });
        } else {
          res.status(404).json({
            success: false,
            message: `Erro ao alterar empresa: ${result.error}`,
          });
        }
      } catch (e) {
        res.status(500).json({
          success: false,
          message: `Internal server error: ${e.message}`,
        });
      }
    } else {
      res.status(401).json({ success: false, message: "Id de busca inválido" });
    }
  }

  async deletarEmpresa(req, res) {
    let id = req.params.id;
    if (!isNaN(id)) {
      try {
        let result = await empresa.deletarEmpresa(id);
        if (result.validated) {
          await auditar(
            req.headers.authorization,
            4,
            `Deletou empresa ID: ${id}`
          );
          res.status(200).json({ success: true });
        } else {
          res.status(404).json({
            success: false,
            message: `Erro ao deletar empresa: ${result.error}`,
          });
        }
      } catch (e) {
        res.status(500).json({
          success: false,
          message: `Internal server Error: ${e.message}`,
        });
      }
    } else {
      res.status(401).json({ success: false, message: "ID de busca inválido" });
    }
  }

  async visualizarEmpresa(req, res) {
    let id = req.params.id;
    if (!isNaN(id)) {
      try {
        let result = await empresa.visualisarEmpresa(id);
        if (result.validated) {
          await auditar(
            req.headers.authorization,
            5,
            `Visualizou empresa ID: ${id}`
          );
          res.status(200).json({ success: true, values: result.values });
        } else {
          res.status(404).json({
            sucess: false,
            message: `Erro ao vizualizar empresa: ${result.error}`,
          });
        }
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

module.exports = new EmpresaController();
