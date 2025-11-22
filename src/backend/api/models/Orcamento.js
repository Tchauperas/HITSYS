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
        .leftJoin("pessoas", "orcamentos.id_cliente", "pessoas.id_pessoa").where({ "orcamentos.id_status_orcamento": 2 });

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

  async faturarOrcamento(id) {
    const trx = await db.transaction();
    try {
      // Buscar dados do orçamento
      const orcamento = await trx("orcamentos")
        .where({ id_orcamento: id, id_status_orcamento: 2 })
        .first();

      if (!orcamento) {
        await trx.rollback();
        return {
          validated: false,
          error: "Orçamento não encontrado ou já está fechado",
        };
      }

      // Buscar itens do orçamento
      const itensOrcamento = await trx("itens_orcamento")
        .where({ id_orcamento: id });

      if (itensOrcamento.length === 0) {
        await trx.rollback();
        return {
          validated: false,
          error: "Orçamento sem itens",
        };
      }

      // Buscar dados do vendedor para obter a taxa de comissão
      let margem_comissao = 0;
      let total_comissao = 0;

      if (orcamento.id_vendedor) {
        const vendedor = await trx("vendedores")
          .where({ id_vendedor: orcamento.id_vendedor })
          .first();

        if (vendedor && vendedor.taxa_comissao) {
          margem_comissao = vendedor.taxa_comissao;
          // Calcular comissão sobre o total da venda (total_orcamento - total_desconto)
          const valorBase = parseFloat(orcamento.total_orcamento) - parseFloat(orcamento.total_desconto || 0);
          total_comissao = (valorBase * parseFloat(vendedor.taxa_comissao)) / 100;
        }
      }

      // Criar objeto de venda com apenas os campos que existem na tabela vendas
      const dadosVenda = {
        num_venda: orcamento.num_orcamento, // Mapeia num_orcamento para num_venda
        data_venda: orcamento.data_orcamento, // Mapeia data_orcamento para data_venda
        id_empresa: orcamento.id_empresa,
        id_usuario_lancamento: orcamento.id_usuario_lancamento,
        id_cliente: orcamento.id_cliente,
        id_vendedor: orcamento.id_vendedor,
        total_produtos: orcamento.total_produtos,
        total_venda: orcamento.total_orcamento, // Mapeia total_orcamento para total_venda
        margem_total_desconto: orcamento.margem_total_desconto,
        total_desconto: orcamento.total_desconto,
        margem_comissao: margem_comissao, // Taxa de comissão do vendedor
        total_comissao: total_comissao, // Valor calculado da comissão
        observacoes_internas: orcamento.observacoes_internas,
        id_orcamento: orcamento.id_orcamento, // Relaciona com o orçamento original
        id_status_venda: 1, // Status padrão para venda (assumindo 1 = ativa/em aberto)
      };

      // Inserir venda
      const [id_venda] = await trx("vendas")
        .insert(dadosVenda)
        .returning("id_venda");

      // Inserir itens da venda
      const itensVenda = itensOrcamento.map((item) => {
        const { id_item_orcamento, id_orcamento, ...dadosItem } = item;
        return {
          ...dadosItem,
          id_venda: id_venda,
        };
      });

      await trx("itens_venda").insert(itensVenda);

      // Atualizar status do orçamento para fechado (1)
      await trx("orcamentos")
        .where({ id_orcamento: id })
        .update({ id_status_orcamento: 1 });

      await trx.commit();

      return {
        validated: true,
        id_venda: id_venda,
        message: "Orçamento faturado com sucesso",
      };
    } catch (e) {
      await trx.rollback();
      return { validated: false, error: e.message };
    }
  }
}

module.exports = new Orcamento();
