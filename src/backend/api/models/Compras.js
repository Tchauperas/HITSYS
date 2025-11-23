const db = require("../configs/config");

class Compra {
  async lancarCompra(data) {
    const trx = await db.transaction();
    try {
      // Se num_compra não foi fornecido, gerar automaticamente
      let numCompra = data.num_compra;
      
      if (!numCompra) {
        // Extrair ano, mês e dia da data da compra
        const dataCompra = new Date(data.data_compra);
        const ano = dataCompra.getFullYear();
        const mes = String(dataCompra.getMonth() + 1).padStart(2, '0');
        const dia = String(dataCompra.getDate()).padStart(2, '0');
        const prefixoData = `CP-${ano}${mes}${dia}`;
        
        // Buscar a última compra do mesmo dia
        const result = await trx("compras")
          .select("num_compra")
          .where("id_empresa", data.id_empresa)
          .where("num_compra", "like", `${prefixoData}%`)
          .orderBy("num_compra", "desc")
          .first();
        
        let sequencia = 1;
        if (result && result.num_compra) {
          // Extrair os últimos 3 dígitos e incrementar
          const ultimaSequencia = parseInt(result.num_compra.slice(-3));
          sequencia = ultimaSequencia + 1;
        }
        
        // Formatar: CP-AAAAMMDDNNN
        numCompra = `${prefixoData}${String(sequencia).padStart(3, '0')}`;
      }
      
      const dataComNumero = { ...data, num_compra: numCompra };
      
      const [id] = await trx.insert(dataComNumero).table("compras").returning("id_compra");
      
      await trx.commit();
      return { validated: true, id, num_compra: numCompra };
    } catch (e) {
      await trx.rollback();
      return { validated: false, error: e.message };
    }
  }

  async visualizarCompra(id) {
    try {
      let compra = await db
        .select(
          "compras.*",
          "pessoas.nome_razao_social as nome_fornecedor"
        )
        .from("compras")
        .leftJoin("pessoas", "compras.id_fornecedor", "pessoas.id_pessoa")
        .where({ "compras.id_compra": id });

      if (compra.length > 0) {
        return { validated: true, values: compra };
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

  async visualizarCompras() {
    try {
      let compra = await db
        .select(
          "compras.*",
          "pessoas.nome_razao_social as nome_fornecedor"
        )
        .from("compras")
        .leftJoin("pessoas", "compras.id_fornecedor", "pessoas.id_pessoa");

      if (compra.length > 0) {
        return { validated: true, values: compra };
      } else {
        return { validated: false, error: "Sem dados para visualização" };
      }
    } catch (e) {
      return { validated: false, error: e.message };
    }
  }

  async atualizarCompra(id, data) {
    try {
      const updated = await db("compras").where({ id_compra: id }).update(data);

      if (updated > 0) {
        return { validated: true };
      } else {
        return { validated: false, error: "Compra não encontrada" };
      }
    } catch (e) {
      return { validated: false, error: e.message };
    }
  }

  async deletarCompra(id) {
    try {
      const deleted = await db("compras").where({ id_compra: id }).delete();

      if (deleted > 0) {
        return { validated: true };
      } else {
        return { validated: false, error: "Compra não encontrada" };
      }
    } catch (e) {
      return { validated: false, error: e.message };
    }
  }

  async obterProximoNumero(id_empresa = 1, data_compra = null) {
    try {
      // Usar data atual se não fornecida
      const dataCompra = data_compra ? new Date(data_compra) : new Date();
      const ano = dataCompra.getFullYear();
      const mes = String(dataCompra.getMonth() + 1).padStart(2, '0');
      const dia = String(dataCompra.getDate()).padStart(2, '0');
      const prefixoData = `CP-${ano}${mes}${dia}`;
      
      // Buscar a última compra do mesmo dia
      const result = await db("compras")
        .select("num_compra")
        .where("id_empresa", id_empresa)
        .where("num_compra", "like", `${prefixoData}%`)
        .orderBy("num_compra", "desc")
        .first();
      
      let sequencia = 1;
      if (result && result.num_compra) {
        // Extrair os últimos 3 dígitos e incrementar
        const ultimaSequencia = parseInt(result.num_compra.slice(-3));
        sequencia = ultimaSequencia + 1;
      }
      
      // Formatar: CP-AAAAMMDDNNN
      const proximoNumero = `${prefixoData}${String(sequencia).padStart(3, '0')}`;
      return { validated: true, proximoNumero };
    } catch (e) {
      return { validated: false, error: e.message };
    }
  }
}

module.exports = new Compra();
