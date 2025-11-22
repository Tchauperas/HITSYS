const db = require("../configs/config");

class ParcelaVenda {
  async criarParcelaVenda(data) {
    try {
      const { id_parcela, id_pagamento_venda } = data;
      
      const [id] = await db.insert({
        id_parcela,
        id_pagamento_venda
      }).table("parcelas_venda").returning("id_parcela_venda");

      return { validated: true, id };
    } catch (e) {
      return { validated: false, error: e.message };
    }
  }

  async criarMultiplasParcelasVenda(parcelas_venda) {
    try {
      const ids = await db.insert(parcelas_venda).table("parcelas_venda").returning("id_parcela_venda");
      return { validated: true, ids };
    } catch (e) {
      return { validated: false, error: e.message };
    }
  }

  async visualizarParcelasVenda(id_pagamento_venda) {
    try {
      const parcelas = await db
        .select("*")
        .from("parcelas_venda")
        .where({ id_pagamento_venda });

      if (parcelas.length > 0) {
        return { validated: true, values: parcelas };
      } else {
        return { validated: false, error: "Nenhuma parcela encontrada" };
      }
    } catch (e) {
      return { validated: false, error: e.message };
    }
  }

  async deletarParcelaVenda(id_parcela_venda) {
    try {
      await db("parcelas_venda").where({ id_parcela_venda }).del();
      return { validated: true };
    } catch (e) {
      return { validated: false, error: e.message };
    }
  }
}

module.exports = new ParcelaVenda();
