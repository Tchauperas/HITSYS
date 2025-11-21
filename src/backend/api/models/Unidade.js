const db = require("../configs/config");

class Unidade {
  async cadastrarUnidade(data) {
    try {
      await db.insert(data).table("unidades_medidas");
      return { validated: true };
    } catch (e) {
      return { validated: false, error: e.message };
    }
  }

  async visualizarUnidades() {
    try {
      let unidades = await db.select("*").table("unidades_medidas");
      if (unidades.length > 0) {
        return { validated: true, values: unidades };
      } else {
        return { validated: false, error: "Nenhuma unidade cadastrada" };
      }
    } catch (e) {
      return { validated: false, error: e.message };
    }
  }

  async alterarUnidade(id, data) {
    try {
      let unidade = await db
        .update(data)
        .where({ id_unidade_medida: id })
        .table("unidades_medidas");
      if (unidade != 0 || unidade != undefined) {
        return { validated: true };
      } else {
        return { validated: false, error: "Unidade não encontrada" };
      }
    } catch (e) {
      return { validated: false, error: e.message };
    }
  }

  async deletarUnidade(id) {
    try {
      let unidade = await db
        .delete()
        .where({ id_unidade_medida: id })
        .table("unidades_medidas");
      if (unidade != 0) {
        return { validated: true };
      } else {
        return { validated: false, error: "Unidade não encontrada" };
      }
    } catch (e) {
      return { validated: false, error: e.message };
    }
  }

  async visualizarUnidade(id) {
    try {
      let unidade = await db
        .select("*")
        .where({ id_unidade_medida: id })
        .table("unidades_medidas");
      if (unidade.length > 0) {
        return { validated: true, values: unidade };
      } else {
        return { validated: false, error: "Unidade não encontrada" };
      }
    } catch (e) {
      return { validated: false, error: e.message };
    }
  }
}

module.exports = new Unidade();
