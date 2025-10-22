const venda = require("../models/Venda");
const itensVenda = require("../models/ItenVenda")

class VendaController {
  async lancarVenda(req, res) {
    let pedido = req.body.pedido;
    let itens = req.body.itens;
    if (pedido != undefined || itens != undefined) {
        try {
            let resultPedido = await venda.lancarVenda(pedido)
            if (resultPedido.validated) {
                let result = await itensVenda.inserirItem(resultPedido.id, itens)
                result.validated ? res.status(201).json({success: true}) : res.status(400).json({success: false, message: `Erro ao inserir itens: ${result.error}`})
            } else {
                res.status(400).json({success: false, message: `Erro ao lançar venda: ${resultPedido.error}`})
            }
        }catch(e) {
            res.stauts(500).json({success: false, message: `Internal server error: ${e.message}`})
        }
    } else {
        res.status(400).json({success: false, message: "Invalid body request"})
    }
  }
}

module.exports = new VendaController();
