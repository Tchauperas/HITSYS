const compra = require("../models/Compras");
const itensCompra = require("../models/ItensCompra");
const db = require("../configs/config");

class ComprasController {
  async lancarCompra(req, res) {
    let pedido = req.body.pedido;
    let itens = req.body.itens;
    if (pedido != undefined || itens != undefined) {
      try {
        let resultPedido = await compra.lancarCompra(pedido);
        if (resultPedido.validated) {
          let result = await itensCompra.inserirItem(resultPedido.id, itens);
          result.validated
            ? res.status(201).json({ 
                success: true,
                id_compra: resultPedido.id,
                num_compra: resultPedido.num_compra
              })
            : res.status(400).json({
                success: false,
                message: `Erro ao inserir itens: ${result.error}`,
              });
        } else {
          res.status(400).json({
            success: false,
            message: `Erro ao lançar compra: ${resultPedido.error}`,
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

  async visualizarCompra(req, res) {
    let id = req.params.id;
    if (!isNaN(id)) {
      try {
        let resultPedido = await compra.visualizarCompra(id);
        if (resultPedido.validated) {
          let resultItens = await itensCompra.visualizarItensCompra(id);
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
            message: `Erro ao visualizar compra: ${resultPedido.error}`,
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

  async visualizarCompras(req, res) {
    try {
      const compras = [];
      const pedidosResult = await compra.visualizarCompras();

      if (!pedidosResult.validated) {
        return res.status(400).json({
          success: false,
          message: `Erro ao buscar compras: ${pedidosResult.error}`,
        });
      }

      const pedidos = pedidosResult.values;

      for (const pedido of pedidos) {
        const itensResult = await itensCompra.visualizarItensCompra(
          pedido.id_compra
        );

        if (!itensResult.validated) {
          return res.status(400).json({
            success: false,
            message: `Erro ao buscar itens da compra ${pedido.id_compra}: ${itensResult.error}`,
          });
        }

        compras.push({ pedido, itens: itensResult.values });
      }

      res.status(200).json({ success: true, compras });
    } catch (e) {
      res
        .status(500)
        .json({
          success: false,
          message: `Internal server error: ${e.message}`,
        });
    }
  }

  async atualizarCompra(req, res) {
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
        const resultPedido = await compra.atualizarCompra(id, pedido);
        if (!resultPedido.validated) {
          return res.status(400).json({
            success: false,
            message: `Erro ao atualizar compra: ${resultPedido.error}`,
          });
        }
      }

      // Atualizar itens se fornecido
      if (itens && Array.isArray(itens)) {
        // Deletar itens existentes e inserir novos
        await itensCompra.deletarItensPorCompra(id);
        const resultItens = await itensCompra.inserirItem(id, itens);

        if (!resultItens.validated) {
          return res.status(400).json({
            success: false,
            message: `Erro ao atualizar itens: ${resultItens.error}`,
          });
        }
      }

      res.status(200).json({
        success: true,
        message: "Compra atualizada com sucesso",
      });
    } catch (e) {
      res.status(500).json({
        success: false,
        message: `Internal server error: ${e.message}`,
      });
    }
  }

  async deletarCompra(req, res) {
    const id = req.params.id;

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Id inválido",
      });
    }

    try {
      // Deletar itens da compra primeiro
      const resultItens = await itensCompra.deletarItensPorCompra(id);

      if (!resultItens.validated) {
        return res.status(400).json({
          success: false,
          message: `Erro ao deletar itens: ${resultItens.error}`,
        });
      }

      // Deletar compra
      const resultCompra = await compra.deletarCompra(id);

      if (resultCompra.validated) {
        res.status(200).json({
          success: true,
          message: "Compra deletada com sucesso",
        });
      } else {
        res.status(404).json({
          success: false,
          message: `Erro ao deletar compra: ${resultCompra.error}`,
        });
      }
    } catch (e) {
      res.status(500).json({
        success: false,
        message: `Internal server error: ${e.message}`,
      });
    }
  }

  async obterProximoNumero(req, res) {
    try {
      const id_empresa = req.query.id_empresa || 1;
      const data_compra = req.query.data_compra || null;
      const result = await compra.obterProximoNumero(id_empresa, data_compra);
      
      if (result.validated) {
        res.status(200).json({
          success: true,
          proximoNumero: result.proximoNumero,
        });
      } else {
        res.status(400).json({
          success: false,
          message: `Erro ao obter próximo número: ${result.error}`,
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

module.exports = new ComprasController();
