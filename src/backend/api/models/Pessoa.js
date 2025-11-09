const db = require("../configs/config");

class Pessoa {
  async cadastrarPessoa(data) {
    try {
      // extrai tipos de cadastro, se enviados
      const tipos = data.tipos_cadastros || [];
      // remove propriedade para inserção na tabela pessoas
      const pessoaData = { ...data };
      delete pessoaData.tipos_cadastros;

      // insere pessoa e obtém id
      const insertResult = await db.insert(pessoaData).into("pessoas");
      const insertedId = Array.isArray(insertResult) ? insertResult[0] : insertResult;

      // insere relacionamentos com tipos_cadastros, se existirem
      if (tipos && Array.isArray(tipos) && tipos.length > 0) {
        const rows = tipos.map((id_tipo) => ({ id_pessoa: insertedId, id_tipo_cadastro: id_tipo }));
        await db.insert(rows).into("pessoas_tipos_cadastros");
      }

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
      // extrai tipos de cadastro (se enviados)
      const tipos = data.tipos_cadastros;
      const pessoaData = { ...data };
      delete pessoaData.tipos_cadastros;

      let pessoa = await db
        .update(pessoaData)
        .where({ id_pessoa: id })
        .table("pessoas");

      if (pessoa) {
        // atualiza relacionamentos: remove existentes e insere novos (se fornecidos)
        if (Array.isArray(tipos)) {
          await db.where({ id_pessoa: id }).del().table("pessoas_tipos_cadastros");
          if (tipos.length > 0) {
            const rows = tipos.map((id_tipo) => ({ id_pessoa: id, id_tipo_cadastro: id_tipo }));
            await db.insert(rows).into("pessoas_tipos_cadastros");
          }
        }

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
        const pessoaObj = pessoa[0];
        // buscar tipos associados
        const tipos = await db
          .select("tipos_cadastros.id_tipo_cadastro", "tipos_cadastros.descricao")
          .from("pessoas_tipos_cadastros")
          .where({ id_pessoa: id })
          .leftJoin("tipos_cadastros", "pessoas_tipos_cadastros.id_tipo_cadastro", "tipos_cadastros.id_tipo_cadastro");

        // anexar tipos ao objeto retornado
        pessoaObj.tipos_cadastros = tipos;

        return { validated: true, values: pessoaObj };
      } else {
        return { validated: false, error: "Pessoa não encontrada" };
      }
    } catch (e) {
      return { validated: false, error: e.message };
    }
  }
}

module.exports = new Pessoa();
