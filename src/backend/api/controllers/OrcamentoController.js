const orcamento = require("../models/Orcamento");
const itensOrcamento = require("../models/ItensOrcamento");
const db = require("../configs/config");

class OrcamentoController {
  async lancarOrcamento(req, res) {
    let pedido = req.body.pedido;
    let itens = req.body.itens;
    if (pedido != undefined || itens != undefined) {
      try {
        let resultPedido = await orcamento.lancarOrcamento(pedido);
        if (resultPedido.validated) {
          let result = await itensOrcamento.inserirItem(resultPedido.id, itens);
          result.validated
            ? res.status(201).json({ success: true })
            : res.status(400).json({
                success: false,
                message: `Erro ao inserir itens: ${result.error}`,
              });
        } else {
          res.status(400).json({
            success: false,
            message: `Erro ao lançar orçamento: ${resultPedido.error}`,
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

  async visualizarOrcamento(req, res) {
    let id = req.params.id;
    if (!isNaN(id)) {
      try {
        let resultPedido = await orcamento.visualizarOrcamento(id);
        if (resultPedido.validated) {
          let resultItens = await itensOrcamento.visualizarItensOrcamento(id);
          resultItens.validated
            ? res.status(200).json({
                success: true,
                pedido: resultPedido.values[0],
                itens: resultItens.values,
              })
            : res.status(404).json({
                success: false,
                message: `Erro ao visualizar itens: ${resultItens.error}`,
              });
        } else {
          res.status(404).json({
            success: false,
            message: `Erro ao visualizar orçamento: ${resultPedido.error}`,
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

  async visualizarOrcamentos(req, res) {
    try {
      const orcamentos = [];
      const pedidosResult = await orcamento.visualizarOrcamentos();

      if (!pedidosResult.validated) {
        return res.status(400).json({
          success: false,
          message: `Erro ao buscar orçamentos: ${pedidosResult.error}`,
        });
      }

      const pedidos = pedidosResult.values;

      for (const pedido of pedidos) {
        const itensResult = await itensOrcamento.visualizarItensOrcamento(
          pedido.id_orcamento
        );

        if (!itensResult.validated) {
          return res.status(400).json({
            success: false,
            message: `Erro ao buscar itens do orçamento ${pedido.id_orcamento}: ${itensResult.error}`,
          });
        }

        orcamentos.push({ pedido, itens: itensResult.values });
      }

      res.status(200).json({ success: true, orcamentos });
    } catch (e) {
      res.status(500).json({
        success: false,
        message: `Internal server error: ${e.message}`,
      });
    }
  }

  async atualizarOrcamento(req, res) {
    const id = req.params.id;
    const { pedido, itens } = req.body;

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Id inválido",
      });
    }

    if (!pedido && !itens) {
      return res.status(400).json({
        success: false,
        message: "Nenhum dado para atualizar",
      });
    }

    try {
      // Atualizar pedido se fornecido
      if (pedido) {
        const resultPedido = await orcamento.atualizarOrcamento(id, pedido);
        if (!resultPedido.validated) {
          return res.status(400).json({
            success: false,
            message: `Erro ao atualizar orçamento: ${resultPedido.error}`,
          });
        }
      }

      // Atualizar itens se fornecido
      if (itens && Array.isArray(itens)) {
        // Deletar itens existentes e inserir novos
        await itensOrcamento.deletarItensPorOrcamento(id);
        const resultItens = await itensOrcamento.inserirItem(id, itens);

        if (!resultItens.validated) {
          return res.status(400).json({
            success: false,
            message: `Erro ao atualizar itens: ${resultItens.error}`,
          });
        }
      }

      res.status(200).json({
        success: true,
        message: "Orçamento atualizado com sucesso",
      });
    } catch (e) {
      res.status(500).json({
        success: false,
        message: `Internal server error: ${e.message}`,
      });
    }
  }

  async deletarOrcamento(req, res) {
    const id = req.params.id;

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Id inválido",
      });
    }

    try {
      // Deletar itens do orçamento primeiro
      const resultItens = await itensOrcamento.deletarItensPorOrcamento(id);

      if (!resultItens.validated) {
        return res.status(400).json({
          success: false,
          message: `Erro ao deletar itens: ${resultItens.error}`,
        });
      }

      // Deletar orçamento
      const resultOrcamento = await orcamento.deletarOrcamento(id);

      if (resultOrcamento.validated) {
        res.status(200).json({
          success: true,
          message: "Orçamento deletado com sucesso",
        });
      } else {
        res.status(404).json({
          success: false,
          message: `Erro ao deletar orçamento: ${resultOrcamento.error}`,
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

module.exports = new OrcamentoController();
