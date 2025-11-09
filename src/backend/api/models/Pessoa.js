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

      if (pessoas.length === 0) {
        return { validated: false, error: "Nenhuma pessoa cadastrada" };
      }

      // Buscar todos os relacionamentos de tipos de cadastro e agrupar por id_pessoa
      const tiposRows = await db
        .select('id_pessoa', 'id_tipo_cadastro')
        .from('pessoas_tipos_cadastros');

      const tiposMap = {};
      tiposRows.forEach((r) => {
        if (!tiposMap[r.id_pessoa]) tiposMap[r.id_pessoa] = [];
        tiposMap[r.id_pessoa].push(r.id_tipo_cadastro);
      });

      // Anexar array de ids de tipos_cadastros em cada pessoa
      const pessoasWithTipos = pessoas.map((p) => {
        return { ...p, tipos_cadastros: tiposMap[p.id_pessoa] || [] };
      });

      return { validated: true, values: pessoasWithTipos };
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
      // Primeiro remover relacionamentos em pessoas_tipos_cadastros para evitar violação de FK
      // Usar transação para garantir atomicidade
      const result = await db.transaction(async (trx) => {
        await trx.where({ id_pessoa: id }).del().table("pessoas_tipos_cadastros");
        const deleted = await trx.where({ id_pessoa: id }).del().table("pessoas");
        return deleted;
      });

      if (result > 0) {
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
