const db = require("../configs/config");
const bc = require("../services/hash_pass");

class Usuario {
  async sign_in(nome, login, senha_hash, id_perfil_usuario, ativo) {
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
      let data = await db.select("*").where({ login: login }).table("usuarios");
      if (!(data.length <= 0)) {
        return { validated: true, values: data };
      } else {
        return { validated: false, error: "Usuario não encontrado" };
      }
    } catch (e) {
      return { validated: false, error: e.message };
    }
  }

  async viewUsers() {
    try {
      let data = await db.select("*").table("usuarios");
      if (data.length >= 0) {
        return { validated: true, values: data };
      } else {
        return { validated: false, error: "Nenhum dado disponivel" };
      }
    } catch (e) {
      return { validated: false, error: e.message };
    }
  }

  async viewUser(id) {
    try {
      let data = await db
        .select("*")
        .where({ id_usuario: id })
        .table("usuarios");
      if (data.length >= 0) {
        return { validated: true, values: data };
      } else {
        return { validated: false, error: "Sem dados disponiveis" };
      }
    } catch (e) {
      return { validated: false, error: e };
    }
  }

  async updateUser(id, fieldsToUpdate) {
    try {
      const updatedRows = await db("usuarios")
        .where({ id: id })
        .update(fieldsToUpdate);

      if (updatedRows > 0) {
        return { validated: true, message: "Usuário atualizado com sucesso" };
      } else {
        return {
          validated: false,
          error: "Usuário não encontrado para atualização",
        };
      }
    } catch (e) {
      return { validated: false, error: e.message };
    }
  }

  async deleteUser(id) {
    try {
      const deletedRows = await db("usuarios").where({ id_usuario: id }).del();

      if (deletedRows > 0) {
        return { validated: true, message: "Usuário excluído com sucesso" };
      } else {
        return {
          validated: false,
          error: "Usuário não encontrado para exclusão",
        };
      }
    } catch (e) {
      return { validated: false, error: e.message };
    }
  }
}

module.exports = new Usuario();
