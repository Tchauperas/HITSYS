const db = require("../configs/config");

class PagamentoVenda {
  async criarPagamentoVenda(data) {
    try {
      const { id_venda, id_forma_pagamento, valor, a_prazo } = data;
      
      const [id] = await db.insert({
        id_venda,
        id_forma_pagamento,
        valor: parseFloat(valor).toFixed(6),
        a_prazo
      }).table("pagamento_vendas").returning("id_pagamento_venda");

      return { validated: true, id };
    } catch (e) {
      return { validated: false, error: e.message };
    }
  }

  async visualizarPagamentosVenda(id_venda) {
    try {
      const pagamentos = await db
        .select("*")
        .from("pagamento_vendas")
        .where({ id_venda });

      if (pagamentos.length > 0) {
        return { validated: true, values: pagamentos };
      } else {
        return { validated: false, error: "Nenhum pagamento encontrado" };
      }
    } catch (e) {
      return { validated: false, error: e.message };
    }
  }

  async deletarPagamentoVenda(id_pagamento_venda) {
    try {
      await db("pagamento_vendas").where({ id_pagamento_venda }).del();
      return { validated: true };
    } catch (e) {
      return { validated: false, error: e.message };
    }
  }
}

module.exports = new PagamentoVenda();
