const db = require("../configs/config");

class Secao {
  async cadastrarSecao(data) {
    try {
      await db.insert(data).table("secoes");
      return { validated: true };
    } catch (e) {
      return { validated: false, error: e.message };
    }
  }

  async visualizarSecoes() {
    try {
      let secoes = await db.select("*").table("secoes");
      if (secoes.length > 0) {
        return { validated: true, values: secoes };
      } else {
        return { validated: false, error: "Nenhuma seção cadastrada" };
      }
    } catch (e) {
      return { validated: false, error: e.message };
    }
  }

  async alterarSecao(id, data) {
    try {
      let secao = await db.update(data).where({ id_secao: id }).table("secoes");
      if (secao != 0 || secao != undefined) {
        return { validated: true };
      } else {
        return { validated: false, error: "Seção não encontrada" };
      }
    } catch (e) {
      return { validated: false, error: e.message };
    }
  }

  async deletarSecao(id) {
    try {
      let secao = await db.delete().where({ id_secao: id }).table("secoes");
      if (secao != 0) {
        return { validated: true };
      } else {
        return { validated: false, error: "Seção não encontrada" };
      }
    } catch (e) {
      return { validated: false, error: e.message };
    }
  }

  async visualizarSecao(id) {
    try {
      let secao = await db.select("*").where({ id_secao: id }).table("secoes");
      if (secao.length > 0) {
        return { validated: true, values: secao };
      } else {
        return { validated: false, error: "Seção não encontrada" };
      }
    } catch (e) {
      return { validated: false, error: e.message };
    }
  }
}

module.exports = new Secao();
