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
}

module.exports = new Venda();
