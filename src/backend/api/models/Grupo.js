const db = require("../configs/config");

class Grupo {
  async cadastrarGrupo(data) {
    try {
      await db.insert(data).table("grupos");
      return { validated: true };
    } catch (e) {
      return { validated: false, error: e.message };
    }
  }

  async visualizarGrupos() {
    try {
      let grupos = await db.select("*").table("grupos");
      if (grupos.length > 0) {
        return { validated: true, values: grupos };
      } else {
        return { validated: false, error: "Nenhum grupo cadastrado" };
      }
    } catch (e) {
      return { validated: false, error: e.message };
    }
  }

  async alterarGrupo(id, data) {
    try {
      let grupo = await db
        .update(data)
        .where({ id_grupo: id })
        .table("grupos");
      if (grupo != 0 || grupo != undefined) {
        return { validated: true };
      } else {
        return { validated: false, error: "Grupo não encontrado" };
      }
    } catch (e) {
      return { validated: false, error: e.message };
    }
  }

  async deletarGrupo(id) {
    try {
      let grupo = await db
        .delete()
        .where({ id_grupo: id })
        .table("grupos");
      if (grupo != 0) {
        return { validated: true };
      } else {
        return { validated: false, error: "Grupo não encontrado" };
      }
    } catch (e) {
      return { validated: false, error: e.message };
    }
  }

  async visualizarGrupo(id) {
    try {
      let grupo = await db
        .select("*")
        .where({ id_grupo: id })
        .table("grupos");
      if (grupo.length > 0) {
        return { validated: true, values: grupo };
      } else {
        return { validated: false, error: "Grupo não encontrado" };
      }
    } catch (e) {
      return { validated: false, error: e.message };
    }
  }
}

module.exports = new Grupo();
