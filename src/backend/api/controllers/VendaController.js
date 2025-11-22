const venda = require("../models/Venda");
const itensVenda = require("../models/ItenVenda");
const db = require("../configs/config");

class VendaController {
  async lancarVenda(req, res) {
    let pedido = req.body.pedido;
    let itens = req.body.itens;
    if (pedido != undefined || itens != undefined) {
      try {
        let resultPedido = await venda.lancarVenda(pedido);
        if (resultPedido.validated) {
          let result = await itensVenda.inserirItem(resultPedido.id, itens);
          result.validated
            ? res.status(201).json({ 
                success: true,
                id_venda: resultPedido.id
              })
            : res.status(400).json({
                success: false,
                message: `Erro ao inserir itens: ${result.error}`,
              });
        } else {
          res.status(400).json({
            success: false,
            message: `Erro ao lançar venda: ${resultPedido.error}`,
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

  async visualizarVenda(req, res) {
    let id = req.params.id;
    if (!isNaN(id)) {
      try {
        let resultPedido = await venda.visualizarVenda(id);
        if (resultPedido.validated) {
          let resultItens = await itensVenda.visualizarItensVenda(id);
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
            message: `Erro ao visualizar venda: ${resultPedido.error}`,
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

  async visualizarVendas(req, res) {
    try {
      const vendas = [];
      const pedidosResult = await venda.visualizarVendas();

      if (!pedidosResult.validated) {
        return res.status(400).json({
          success: false,
          message: `Erro ao buscar vendas: ${pedidosResult.error}`,
        });
      }

      const pedidos = pedidosResult.values;

      for (const pedido of pedidos) {
        const itensResult = await itensVenda.visualizarItensVenda(
          pedido.id_venda
        );

        if (!itensResult.validated) {
          return res.status(400).json({
            success: false,
            message: `Erro ao buscar itens da venda ${pedido.id_venda}: ${itensResult.error}`,
          });
        }

        vendas.push({ pedido, itens: itensResult.values });
      }

      res.status(200).json({ success: true, vendas });
    } catch (e) {
      res
        .status(500)
        .json({
          success: false,
          message: `Internal server error: ${e.message}`,
        });
    }
  }

  async atualizarVenda(req, res) {
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
        const resultPedido = await venda.atualizarVenda(id, pedido);
        if (!resultPedido.validated) {
          return res.status(400).json({
            success: false,
            message: `Erro ao atualizar venda: ${resultPedido.error}`,
          });
        }
      }

      // Atualizar itens se fornecido
      if (itens && Array.isArray(itens)) {
        // Deletar itens existentes e inserir novos
        await itensVenda.deletarItensPorVenda(id);
        const resultItens = await itensVenda.inserirItem(id, itens);

        if (!resultItens.validated) {
          return res.status(400).json({
            success: false,
            message: `Erro ao atualizar itens: ${resultItens.error}`,
          });
        }
      }

      res.status(200).json({
        success: true,
        message: "Venda atualizada com sucesso",
      });
    } catch (e) {
      res.status(500).json({
        success: false,
        message: `Internal server error: ${e.message}`,
      });
    }
  }

  async deletarVenda(req, res) {
    const id = req.params.id;

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Id inválido",
      });
    }

    try {
      // Deletar itens da venda primeiro
      const resultItens = await itensVenda.deletarItensPorVenda(id);

      if (!resultItens.validated) {
        return res.status(400).json({
          success: false,
          message: `Erro ao deletar itens: ${resultItens.error}`,
        });
      }

      // Deletar venda
      const resultVenda = await venda.deletarVenda(id);

      if (resultVenda.validated) {
        res.status(200).json({
          success: true,
          message: "Venda deletada com sucesso",
        });
      } else {
        res.status(404).json({
          success: false,
          message: `Erro ao deletar venda: ${resultVenda.error}`,
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

module.exports = new VendaController();
