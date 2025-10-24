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
            ? res.status(201).json({ success: true })
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
        res.stauts(500).json({
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
            ? res
                .status(200)
                .json({
                  success: true,
                  pedido: resultPedido.values[0],
                  itens: resultItens.values,
                })
            : res
                .status(404)
                .json({
                  success: false,
                  message: `Erro ao visualizar itens: ${resultItens.error}`,
                });
        } else {
          res
            .status(404)
            .json({
              success: false,
              message: `Erro ao visualizar venda: ${resultPedido.error}`,
            });
        }
      } catch (e) {
        res
          .status(500)
          .json({
            success: false,
            message: `Internala server error: ${e.message}`,
          });
      }
    } else {
      res.status(400).json({ succes: false, message: "Id de busca inválido" });
    }
  }
}

module.exports = new VendaController();
