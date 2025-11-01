const db = require("../configs/config");

class Pessoa {
  async cadastrarPessoa(data) {
    try {
      await db.insert(data).table("pessoas");
      return { validated: true };
    } catch (e) {
      return { validated: false, error: e.message };
    }
  }

  async visualizarPessoas() {
    try {
      let pessoas = await db.select("*").table("pessoas");
      if (pessoas.length > 0) {
        return { validated: true, values: pessoas };
      } else {
        return { validated: false, error: "Nenhuma pessoa cadastrada" };
      }
    } catch (e) {
      return { validated: false, error: e.message };
    }
  }

  async alterarPessoa(id, data) {
    try {
      let pessoa = await db
        .update(data)
        .where({ id_pessoa: id })
        .table("pessoas");
      if (pessoa) {
        return { validated: true };
      } else {
        return { validated: false, error: "Pessoa não encontrada" };
      }
    } catch (e) {
      return { validated: false, error: e.message };
    }
  }

  async deletarPessoa(id) {
    try {
      let pessoa = await db
        .table("pessoas") // Especifica a tabela
        .where({ id_pessoa: id })
        .del(); // Remove o registro
      if (pessoa > 0) {
        return { validated: true };
      } else {
        return { validated: false, error: "Pessoa não encontrada" };
      }
    } catch (e) {
      return { validated: false, error: e.message };
    }
  }

  async visualizarPessoa(id) {
    try {
      let pessoa = await db
        .select("*")
        .where({ id_pessoa: id })
        .table("pessoas");
      if (pessoa.length > 0) {
        return { validated: true, values: pessoa };
      } else {
        return { validated: false, error: "Pessoa não encontrada" };
      }
    } catch (e) {
      return { validated: false, error: e.message };
    }
  }
}

module.exports = new Pessoa();
