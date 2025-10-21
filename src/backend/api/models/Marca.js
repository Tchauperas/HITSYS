const db = require("../configs/config");

class Marca {
  async cadastrarMarca(data) {
    try {
      await db.insert(data).table("marcas");
      return { validated: true };
    } catch (e) {
      return { validated: false, error: e.message };
    }
  }

  async visualizarMarcas() {
    try {
      let marcas = await db.select("*").table("marcas");
      if (marcas.length > 0) {
        return { validated: true, values: marcas };
      } else {
        return { validated: false, error: "Nenhuma marca cadastrada" };
      }
    } catch (e) {
      return { validated: false, error: e.message };
    }
  }

  async alterarMarca(id, data) {
    try {
      let marca = await db.update(data).where({ id_marca: id }).table("marcas");
      if (marca != 0 || marca != undefined) {
        return { validated: true };
      } else {
        return { validated: false, error: "Marca não encontrada" };
      }
    } catch (e) {
      return { validated: false, error: e.message };
    }
  }

  async deletarMarca(id) {
    try {
      let marca = await db.delete().where({ id_marca: id }).table("marcas");
      if (marca != 0) {
        return { validated: true };
      } else {
        return { validated: false, error: "Marca não encontrada" };
      }
    } catch (e) {
      return { validated: false, error: e.message };
    }
  }

  async visualizarMarca(id) {
    try {
      let marca = await db.select("*").where({ id_marca: id }).table("marcas");
      if (marca.length > 0) {
        return { validated: true, values: marca };
      } else {
        return { validated: false, error: "Marca não encontrada" };
      }
    } catch (e) {
      return { validated: false, error: e.message };
    }
  }
}

module.exports = new Marca();
