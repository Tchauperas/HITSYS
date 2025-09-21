const db = require("../configs/config");
const bc = require("../services/hash_pass");

class Usuario {
  async sign_in(
    nome,
    login,
    senha_hash,
    id_perfil_usuario,
    ativo
  ) {
    try {
      await db
        .insert({
          nome: nome,
          login: login,
          senha_hash: await bc(senha_hash),
          id_perfil_usuario: id_perfil_usuario,
          ativo: ativo,
        })
        .table("usuarios");
      return { validated: true };
    } catch (e) {
      return { validated: false, error: e.message };
    }
  }

  async findByLogin(login) {
    try {
        let data = await db.select("*").where({login: login}).table("usuarios")
        if (!(data.length <= 0)) {
          return {validated: true, values: data}
        } else {
          return {validated: false, error: "Usuario não encontrado"}
        }
    } catch(e) {
        return {validated: false, error: e.message}
    }
  }

  async changePassword(password) {
    try {
      
    } catch (e) {

    }
  }

}

module.exports = new Usuario();