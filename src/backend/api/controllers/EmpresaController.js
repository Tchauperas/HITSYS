const empresa = require("../models/Empresa");

class EmpresaController {
  async cadastrarEmpresa(req, res) {
    let data = req.body;
    if (data != undefined) {
      try {
        let result = await empresa.cadastrarEmpresa(data);
        result.validated
          ? res.status(201).json({
              success: true,
              message: "Empresa cadastrado com sucesso",
            })
          : res.status(400).json({
              success: false,
              message: `Erro ao cadastrar empresa: ${result.error}`,
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

  async visualizarEmpresas(req, res) {
    try {
      let result = await empresa.visualizarEmpresas();
      result.validated
        ? res.status(200).json({ success: true, values: result.values })
        : res
            .status(400)
            .json({
              success: false,
              message: `Erro ao listar empresas: ${result.error}`,
            });
    } catch (e) {
      res
        .status(500)
        .json({
          success: false,
          message: `Internal server error: ${e.message}`,
        });
    }
  }
}

module.exports = new EmpresaController();
