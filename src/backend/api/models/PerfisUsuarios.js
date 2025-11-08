const db = require("../configs/config");

class PerfisUsuarios {
  async cadastrarPerfil(data) {
    try {
      await db.insert(data).table("perfis_usuarios");
      return { validated: true };
    } catch (e) {
      return { validated: false, error: e.message };
    }
  }

  async visualizarPerfis() {
    try {
      const perfis = await db.select("*").table("perfis_usuarios");
      if (perfis.length > 0) return { validated: true, values: perfis };
      return { validated: false, error: "Nenhum perfil cadastrado" };
    } catch (e) {
      return { validated: false, error: e.message };
    }
  }

  async visualizarPerfil(id) {
    try {
      const perfis = await db.select("*").where({ id_perfil_usuario: id }).table("perfis_usuarios");
      if (perfis.length > 0) return { validated: true, values: perfis };
      return { validated: false, error: "Perfil não encontrado" };
    } catch (e) {
      return { validated: false, error: e.message };
    }
  }

  async alterarPerfil(id, data) {
    try {
      const res = await db.update(data).where({ id_perfil_usuario: id }).table("perfis_usuarios");
      if (res !== 0 && res !== undefined) return { validated: true };
      return { validated: false, error: "Perfil não encontrado" };
    } catch (e) {
      return { validated: false, error: e.message };
    }
  }

  async deletarPerfil(id) {
    try {
      const res = await db.delete().where({ id_perfil_usuario: id }).table("perfis_usuarios");
      if (res !== 0) return { validated: true };
      return { validated: false, error: "Perfil não encontrado" };
    } catch (e) {
      return { validated: false, error: e.message };
    }
  }
}

module.exports = new PerfisUsuarios();
