const db = require("../configs/config");

class Empresa {
  async cadastrarEmpresa(data) {
    try {
      await db.insert(data).table("empresas");
      return { validated: true };
    } catch (e) {
      return { validated: false, error: e.message };
    }
  }

  async visualizarEmpresas() {
    try {
      let empresas = await db.select("*").table("empresas");
      if (empresas != 0) {
        return { validated: true, values: empresas };
      } else {
        return { validated: false, error: "Nenhuma empresa cadastrada" };
      }
    } catch (e) {
      return { validated: false, error: e.message };
    }
  }

  async alterarEmpresa(id, data) {
    try {
      await db.update(data).where({id_empresa: id}).table("empresas")
      return {validated: true}
    } catch(e) {
      return {validated: false, error: e.message}
    }
  }

  async deletarEmpresa(id) {
    try {
      await db.delete("*").where({id_empresa: id}).table("empresas")
      return {validated: true}
    } catch(e) {
      return {validated: false, error: e.message}
    }
  }
}

module.exports = new Empresa();
