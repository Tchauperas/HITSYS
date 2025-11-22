const db = require("../configs/config");

class Orcamento {
  async lancarOrcamento(data) {
    try {
      const [id] = await db.insert(data).table("orcamentos").returning("id_orcamento");
      return { validated: true, id };
    } catch (e) {
      return { validated: false, error: e.message };
    }
  }

  async visualizarOrcamento(id) {
    try {
      let orcamento = await db
        .select(
          "orcamentos.*",
          "pessoas.nome_razao_social as nome_cliente"
        )
        .from("orcamentos")
        .leftJoin("pessoas", "orcamentos.id_cliente", "pessoas.id_pessoa")
        .where({ "orcamentos.id_orcamento": id });

      if (orcamento.length > 0) {
        return { validated: true, values: orcamento };
      } else {
        return {
          validated: false,
          error: "Nenhum resultado disponível para visualização",
        };
      }
    } catch (e) {
      return { validated: false, error: e.message };
    }
  }

  async visualizarOrcamentos() {
    try {
      let orcamento = await db
        .select(
          "orcamentos.*",
          "pessoas.nome_razao_social as nome_cliente"
        )
        .from("orcamentos")
        .leftJoin("pessoas", "orcamentos.id_cliente", "pessoas.id_pessoa");

      if (orcamento.length > 0) {
        return { validated: true, values: orcamento };
      } else {
        return { validated: false, error: "Sem dados para visualização" };
      }
    } catch (e) {
      return { validated: false, error: e.message };
    }
  }

  async atualizarOrcamento(id, data) {
    try {
      const updated = await db("orcamentos").where({ id_orcamento: id }).update(data);

      if (updated > 0) {
        return { validated: true };
      } else {
        return { validated: false, error: "Orçamento não encontrado" };
      }
    } catch (e) {
      return { validated: false, error: e.message };
    }
  }

  async deletarOrcamento(id) {
    try {
      const deleted = await db("orcamentos").where({ id_orcamento: id }).delete();

      if (deleted > 0) {
        return { validated: true };
      } else {
        return { validated: false, error: "Orçamento não encontrado" };
      }
    } catch (e) {
      return { validated: false, error: e.message };
    }
  }
}

module.exports = new Orcamento();
