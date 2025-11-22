const db = require("../configs/config");

class ItensOrcamento {
  async inserirItem(id_orcamento, data) {
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
            id_orcamento: id_orcamento,
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
          .table("itens_orcamento");
        i++;
      }
      return { validated: true };
    } catch (e) {
      return { validated: false, error: e.message };
    }
  }

  async visualizarItensOrcamento(id_orcamento) {
    try {
      let itens = await db
        .select("*")
        .where({ id_orcamento: id_orcamento })
        .table("itens_orcamento");
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
      const updated = await db("itens_orcamento")
        .where({ id_item_orcamento: id_item })
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
      const deleted = await db("itens_orcamento")
        .where({ id_item_orcamento: id_item })
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

  async deletarItensPorOrcamento(id_orcamento) {
    try {
      await db("itens_orcamento")
        .where({ id_orcamento: id_orcamento })
        .delete();

      return { validated: true };
    } catch (e) {
      return { validated: false, error: e.message };
    }
  }
}

module.exports = new ItensOrcamento();
