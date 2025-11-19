const relatorio = require("../models/Relatorio");
const auditar = require("../services/auditar");

class RelatorioController {
  async vendasPorPeriodo(req, res) {
    const { dataInicio, dataFim } = req.body;

    if (!dataInicio || !dataFim) {
      return res.status(400).json({
        success: false,
        message: "Data de início e fim são obrigatórias",
      });
    }

    try {
      let result = await relatorio.vendasPorPeriodo(dataInicio, dataFim);
      if (result.validated) {
        await auditar(
          req.headers.authorization,
          2,
          `Gerou relatório de vendas por período: ${dataInicio} a ${dataFim}`
        );
        res.status(200).json({
          success: true,
          resumo: result.resumo,
          vendas: result.vendas,
        });
      } else {
        res.status(404).json({
          success: false,
          message: `Erro ao gerar relatório: ${result.error}`,
        });
      }
    } catch (e) {
      res.status(500).json({
        success: false,
        message: `Internal server error: ${e.message}`,
      });
    }
  }

  async vendasPorDia(req, res) {
    const { data } = req.body;

    if (!data) {
      return res.status(400).json({
        success: false,
        message: "Data é obrigatória",
      });
    }

    try {
      let result = await relatorio.vendasPorDia(data);
      if (result.validated) {
        await auditar(
          req.headers.authorization,
          2,
          `Gerou relatório de vendas do dia: ${data}`
        );
        res.status(200).json({
          success: true,
          resumo: result.resumo,
          vendas: result.vendas,
        });
      } else {
        res.status(404).json({
          success: false,
          message: `Erro ao gerar relatório: ${result.error}`,
        });
      }
    } catch (e) {
      res.status(500).json({
        success: false,
        message: `Internal server error: ${e.message}`,
      });
    }
  }

  async vendasPorMes(req, res) {
    const { mes, ano } = req.body;

    if (!mes || !ano) {
      return res.status(400).json({
        success: false,
        message: "Mês e ano são obrigatórios",
      });
    }

    if (isNaN(mes) || isNaN(ano) || mes < 1 || mes > 12) {
      return res.status(400).json({
        success: false,
        message: "Mês ou ano inválidos",
      });
    }

    try {
      let result = await relatorio.vendasPorMes(parseInt(mes), parseInt(ano));
      if (result.validated) {
        await auditar(
          req.headers.authorization,
          2,
          `Gerou relatório de vendas do mês: ${mes}/${ano}`
        );
        res.status(200).json({
          success: true,
          resumo: result.resumo,
          vendas: result.vendas,
        });
      } else {
        res.status(404).json({
          success: false,
          message: `Erro ao gerar relatório: ${result.error}`,
        });
      }
    } catch (e) {
      res.status(500).json({
        success: false,
        message: `Internal server error: ${e.message}`,
      });
    }
  }

  async comissaoVendedores(req, res) {
    const { dataInicio, dataFim } = req.body;

    if (!dataInicio || !dataFim) {
      return res.status(400).json({
        success: false,
        message: "Data de início e fim são obrigatórias",
      });
    }

    try {
      let result = await relatorio.comissaoVendedores(dataInicio, dataFim);
      if (result.validated) {
        await auditar(
          req.headers.authorization,
          2,
          `Gerou relatório de comissões de vendedores: ${dataInicio} a ${dataFim}`
        );
        res.status(200).json({
          success: true,
          resumo: result.resumo,
          vendedores: result.vendedores,
        });
      } else {
        res.status(404).json({
          success: false,
          message: `Erro ao gerar relatório: ${result.error}`,
        });
      }
    } catch (e) {
      res.status(500).json({
        success: false,
        message: `Internal server error: ${e.message}`,
      });
    }
  }
}

module.exports = new RelatorioController();
