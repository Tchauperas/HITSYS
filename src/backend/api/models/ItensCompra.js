const db = require("../configs/config");
const produto = require("./Produto");

class ItensCompra {
  async inserirItem(id_compra, data) {
    try {
      let i = 0;
      while (i < data.length) {
        let {
          id_produto_referenciado,
          codigo,
          descricao,
          codigo_fornecedor,
          descricao_fornecedor,
          quantidade_compra,
          und_compra,
          quantidade_convertida,
          und_venda,
          custo_und_compra,
          custo_compra,
          custo_unitario,
          margem_desconto,
          valor_desconto,
          margem_lucro,
          preco_venda,
        } = data[i];
        await db
          .insert({
            id_compra: id_compra,
            id_produto_referenciado: id_produto_referenciado,
            codigo: codigo,
            descricao: descricao,
            codigo_fornecedor: codigo_fornecedor,
            descricao_fornecedor: descricao_fornecedor,
            quantidade_compra: quantidade_compra,
            und_compra: und_compra,
            quantidade_convertida: quantidade_convertida,
            und_venda: und_venda,
            custo_und_compra: custo_und_compra,
            custo_compra: custo_compra,
            custo_unitario: custo_unitario,
            margem_desconto: margem_desconto,
            valor_desconto: valor_desconto,
            margem_lucro: margem_lucro,
            preco_venda: preco_venda,
          })
          .table("itens_compra");
        
        // Creditar estoque ao invés de debitar
        let credito = await produto.creditarEstoque(id_produto_referenciado, quantidade_compra);
        console.log(credito.validated, credito?.error, quantidade_compra);
        i++;
      }
      return { validated: true };
    } catch (e) {
      return { validated: false, error: e.message };
    }
  }

  async visualizarItensCompra(id_compra) {
    try {
      let itens = await db
        .select("*")
        .where({ id_compra: id_compra })
        .table("itens_compra");
      if (itens.length > 0) {
        return { validated: true, values: itens };
      } else {
        return { validated: false, error: "Sem itens para visualização" };
      }
    } catch (e) {
      return { validated: false, error: e.message };
    }
  }

  async atualizarItem(id_item, data) {
    try {
      const updated = await db("itens_compra")
        .where({ id_item_compra: id_item })
        .update(data);

      if (updated > 0) {
        return { validated: true };
      } else {
        return { validated: false, error: "Item não encontrado" };
      }
    } catch (e) {
      return { validated: false, error: e.message };
    }
  }

  async deletarItem(id_item) {
    try {
      const deleted = await db("itens_compra")
        .where({ id_item_compra: id_item })
        .delete();

      if (deleted > 0) {
        return { validated: true };
      } else {
        return { validated: false, error: "Item não encontrado" };
      }
    } catch (e) {
      return { validated: false, error: e.message };
    }
  }

  async deletarItensPorCompra(id_compra) {
    try {
      await db("itens_compra")
        .where({ id_compra: id_compra })
        .delete();

      return { validated: true };
    } catch (e) {
      return { validated: false, error: e.message };
    }
  }
}

module.exports = new ItensCompra();
