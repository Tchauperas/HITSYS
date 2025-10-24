const db = require("../configs/config");

class Venda {
  async lancarVenda(data) {
    try {
      const [id] = await db.insert(data).table("vendas").returning("id_venda");
      return { validated: true, id };
    } catch (e) {
      return { validated: false, error: e.message };
    }
  }

  async visualizarVenda(id) {
    try {
      let venda = await db.select("*").where({ id_venda: id }).table("vendas");
      if (venda.length > 0) {
        return { validated: true, values: venda };
      } else {
        return {
          validated: false,
          error: "Nenhum resultado disponível para visualização",
        };
      }
    } catch (e) {
      return { validated: false, error: e.message };
    }
  }
}

module.exports = new Venda();
