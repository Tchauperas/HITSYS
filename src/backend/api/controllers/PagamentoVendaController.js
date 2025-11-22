const pagamentoVenda = require("../models/PagamentoVenda");
const parcela = require("../models/Parcela");
const parcelaVenda = require("../models/ParcelaVenda");

class PagamentoVendaController {
  async criarPagamentosVenda(req, res) {
    const { id_venda, pagamentos } = req.body;

    if (!id_venda || !pagamentos || pagamentos.length === 0) {
      return res.status(400).json({
        success: false,
        message: "id_venda e pagamentos são obrigatórios"
      });
    }

    try {
      const pagamentosInsertados = [];

      for (const pagto of pagamentos) {
        // Criar registro em pagamento_vendas
        const resultPagto = await pagamentoVenda.criarPagamentoVenda({
          id_venda,
          id_forma_pagamento: pagto.id_forma_pagamento,
          valor: pagto.valor,
          a_prazo: pagto.a_prazo
        });

        if (!resultPagto.validated) {
          return res.status(400).json({
            success: false,
            message: `Erro ao criar pagamento: ${resultPagto.error}`
          });
        }

        const id_pagamento_venda = resultPagto.id;

        // Se for A Prazo, criar parcelas
        if (pagto.a_prazo === 1 || pagto.a_prazo === "1") {
          // Criar parcelas
          const resultParcelas = await parcela.criarMultiplasParcelas(pagto.parcelas_geradas);

          if (!resultParcelas.validated) {
            return res.status(400).json({
              success: false,
              message: `Erro ao criar parcelas: ${resultParcelas.error}`
            });
          }

          // Linkar parcelas com pagamento_venda
          const parcelas_venda = resultParcelas.ids.map(id_parcela => ({
            id_parcela,
            id_pagamento_venda
          }));

          const resultParcelasVenda = await parcelaVenda.criarMultiplasParcelasVenda(parcelas_venda);

          if (!resultParcelasVenda.validated) {
            return res.status(400).json({
              success: false,
              message: `Erro ao linkar parcelas: ${resultParcelasVenda.error}`
            });
          }
        }

        pagamentosInsertados.push({
          id_pagamento_venda,
          id_forma_pagamento: pagto.id_forma_pagamento,
          valor: pagto.valor,
          a_prazo: pagto.a_prazo
        });
      }

      return res.status(201).json({
        success: true,
        message: "Pagamentos criados com sucesso",
        pagamentos: pagamentosInsertados
      });

    } catch (error) {
      console.error("Erro ao criar pagamentos:", error);
      return res.status(500).json({
        success: false,
        message: `Erro interno: ${error.message}`
      });
    }
  }

  async visualizarPagamentosVenda(req, res) {
    const { id_venda } = req.params;

    if (!id_venda) {
      return res.status(400).json({
        success: false,
        message: "id_venda é obrigatório"
      });
    }

    try {
      const result = await pagamentoVenda.visualizarPagamentosVenda(id_venda);

      if (result.validated) {
        return res.status(200).json({
          success: true,
          pagamentos: result.values
        });
      } else {
        return res.status(404).json({
          success: false,
          message: result.error
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: `Erro interno: ${error.message}`
      });
    }
  }
}

module.exports = new PagamentoVendaController();
