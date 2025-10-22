const db = require("../configs/config");

class ItenVenda {
  async inserirItem(id_venda, data) {
    try {
      let i = 0;
      while (i < data.length) {
        let {
          id_produto,
          codigo,
          descricao,
          quantidade,
          preco_unitario,
          preco_total,
          unidade_medida,
          margem_desconto,
          valor_desconto,
        } = data[i];
        await db
          .insert({
            id_venda: id_venda,
            id_produto: id_produto,
            codigo: codigo,
            descricao: descricao,
            quantidade: quantidade,
            preco_unitario: preco_unitario,
            preco_total: preco_total,
            unidade_medida: unidade_medida,
            margem_desconto: margem_desconto,
            valor_desconto: valor_desconto,
          })
          .table("itens_venda");
        i++;
      }
      return { validated: true };
    } catch (e) {
      return { validated: false, error: e.message };
    }
  }
}

module.exports = new ItenVenda();
