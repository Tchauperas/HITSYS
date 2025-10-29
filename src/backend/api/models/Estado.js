const db = require("../configs/config");

class Estado {
  async cadastrarEstado(data) {
    try {
      await db.insert(data).table("estados");
      return { validated: true };
    } catch (e) {
      return { validated: false, error: e.message };
    }
  }

  async visualizarEstados() {
    try {
      let estados = await db.select("*").table("estados");
      if (estados.length > 0) {
        return { validated: true, values: estados };
      } else {
        return { validated: false, error: "Nenhum estado cadastrado" };
      }
    } catch (e) {
      return { validated: false, error: e.message };
    }
  }

  async alterarEstado(id, data) {
    try {
      let estado = await db
        .update(data)
        .where({ id_estado: id })
        .table("estados");
      if (estado) {
        return { validated: true };
      } else {
        return { validated: false, error: "Estado não encontrado" };
      }
    } catch (e) {
      return { validated: false, error: e.message };
    }
  }

  async deletarEstado(id) {
    try {
      let estado = await db
        .delete("*")
        .where({ id_estado: id })
        .table("estados");
      if (estado != 0) {
        return { validated: true };
      } else {
        return { validated: false, error: "Estado não encontrado" };
      }
    } catch (e) {
      return { validated: false, error: e.message };
    }
  }

  async visualizarEstado(id) {
    try {
      let estado = await db
        .select("*")
        .where({ id_estado: id })
        .table("estados");
      if (estado.length > 0) {
        return { validated: true, values: estado };
      } else {
        return { validated: false, error: "Estado não encontrado" };
      }
    } catch (e) {
      return { validated: false, error: e.message };
    }
  }
}

module.exports = new Estado();