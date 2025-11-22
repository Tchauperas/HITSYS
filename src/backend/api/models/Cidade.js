const db = require("../configs/config");

class Cidade {
  async cadastrarCidade(data) {
    try {
      await db.insert(data).table("cidades");
      return { validated: true };
    } catch (e) {
      return { validated: false, error: e.message };
    }
  }

  async visualizarCidades() {
    try {
      let cidades = await db
        .select("cidades.*", "estados.uf")
        .table("cidades")
        .leftJoin("estados", "cidades.id_uf", "estados.id_estado");
      if (cidades.length > 0) {
        return { validated: true, values: cidades };
      } else {
        return { validated: false, error: "Nenhuma cidade cadastrada" };
      }
    } catch (e) {
      return { validated: false, error: e.message };
    }
  }

  async alterarCidade(id, data) {
    try {
      let cidade = await db
        .update(data)
        .where({ id_cidade: id })
        .table("cidades");
      if (cidade) {
        return { validated: true };
      } else {
        return { validated: false, error: "Cidade não encontrada" };
      }
    } catch (e) {
      return { validated: false, error: e.message };
    }
  }

  async deletarCidade(id) {
    try {
      let cidade = await db
        .delete("*")
        .where({ id_cidade: id })
        .table("cidades");
      if (cidade != 0) {
        return { validated: true };
      } else {
        return { validated: false, error: "Cidade não encontrada" };
      }
    } catch (e) {
      return { validated: false, error: e.message };
    }
  }

  async visualizarCidade(id) {
    try {
      let cidade = await db
        .select("*")
        .where({ id_cidade: id })
        .table("cidades");
      if (cidade.length > 0) {
        return { validated: true, values: cidade };
      } else {
        return { validated: false, error: "Cidade não encontrada" };
      }
    } catch (e) {
      return { validated: false, error: e.message };
    }
  }
}

module.exports = new Cidade();