const db = require("../configs/config");

class Parcela {
  async criarParcela(data) {
    try {
      const { num_parcela, valor, data_vencimento } = data;
      
      const [id] = await db.insert({
        num_parcela,
        valor: parseFloat(valor).toFixed(6),
        data_vencimento
      }).table("parcelas").returning("id_parcela");

      return { validated: true, id };
    } catch (e) {
      return { validated: false, error: e.message };
    }
  }

  async criarMultiplasParcelas(parcelas) {
    try {
      const parcelasFormatadas = parcelas.map(p => ({
        num_parcela: p.num_parcela,
        valor: parseFloat(p.valor).toFixed(6),
        data_vencimento: p.data_vencimento
      }));

      const ids = await db.insert(parcelasFormatadas).table("parcelas").returning("id_parcela");
      return { validated: true, ids };
    } catch (e) {
      return { validated: false, error: e.message };
    }
  }

  async visualizarParcela(id_parcela) {
    try {
      const parcela = await db
        .select("*")
        .from("parcelas")
        .where({ id_parcela });

      if (parcela.length > 0) {
        return { validated: true, values: parcela };
      } else {
        return { validated: false, error: "Parcela não encontrada" };
      }
    } catch (e) {
      return { validated: false, error: e.message };
    }
  }

  async deletarParcela(id_parcela) {
    try {
      await db("parcelas").where({ id_parcela }).del();
      return { validated: true };
    } catch (e) {
      return { validated: false, error: e.message };
    }
  }
}

module.exports = new Parcela();
