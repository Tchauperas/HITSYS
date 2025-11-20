const db = require("../configs/config");

class Relatorio {
  // Função auxiliar para converter data de DD/MM/YYYY para YYYY-MM-DD
  converterData(data) {
    // Verifica se já está no formato YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(data)) {
      return data;
    }
    // Converte de DD/MM/YYYY para YYYY-MM-DD
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(data)) {
      const [dia, mes, ano] = data.split("/");
      return `${ano}-${mes}-${dia}`;
    }
    return data;
  }

  async vendasPorPeriodo(dataInicio, dataFim) {
    try {
      // Converter datas para o formato do banco de dados
      const dataInicioConvertida = this.converterData(dataInicio);
      const dataFimConvertida = this.converterData(dataFim);
      const vendas = await db
        .select(
          "vendas.id_venda",
          "vendas.num_venda",
          "vendas.data_venda",
          "vendas.total_produtos",
          "vendas.total_venda",
          "vendas.total_desconto",
          "vendas.total_comissao",
          "vendas.margem_total_desconto",
          "vendas.margem_comissao",
          "vendas.id_status_venda",
          "vendas.observacoes_venda",
          "vendas.cancelada",
          "vendas.data_cancelamento",
          "vendas.motivo_cancelamento",
          "cliente.nome_razao_social as nome_cliente",
          "cliente.cpf as cpf_cliente",
          "cliente.cnpj as cnpj_cliente",
          "vendedor.nome_razao_social as nome_vendedor",
          "empresa.nome_fantasia as nome_empresa",
          "usuario.nome as usuario_lancamento"
        )
        .from("vendas")
        .leftJoin(
          "pessoas as cliente",
          "vendas.id_cliente",
          "cliente.id_pessoa"
        )
        .leftJoin(
          "pessoas as vendedor",
          "vendas.id_vendedor",
          "vendedor.id_pessoa"
        )
        .leftJoin(
          "empresas as empresa",
          "vendas.id_empresa",
          "empresa.id_empresa"
        )
        .leftJoin(
          "usuarios as usuario",
          "vendas.id_usuario_lancamento",
          "usuario.id_usuario"
        )
        .whereBetween("vendas.data_venda", [dataInicioConvertida, dataFimConvertida])
        .orderBy("vendas.data_venda", "desc")
        .orderBy("vendas.num_venda", "desc");

      if (vendas.length === 0) {
        return {
          validated: false,
          error: "Nenhuma venda encontrada no período informado",
        };
      }

      // Para cada venda, buscar os itens vendidos
      const vendasComItens = await Promise.all(
        vendas.map(async (venda) => {
          const itens = await db
            .select(
              "itens_venda.id_item_venda",
              "itens_venda.quantidade",
              "itens_venda.preco_unitario",
              "itens_venda.preco_total",
              "itens_venda.margem_desconto",
              "itens_venda.valor_desconto",
              "itens_venda.unidade_medida",
              "produtos.descricao as produto",
              "produtos.cod_barras",
              "produtos.codigo"
            )
            .from("itens_venda")
            .leftJoin(
              "produtos",
              "itens_venda.id_produto",
              "produtos.id_produto"
            )
            .where({ id_venda: venda.id_venda });

          return {
            ...venda,
            itens: itens,
          };
        })
      );

      // Calcular resumo do período
      const resumo = {
        total_vendas: vendas.length,
        valor_total_vendas: vendas.reduce(
          (acc, v) => acc + (parseFloat(v.total_venda) || 0),
          0
        ),
        total_desconto: vendas.reduce(
          (acc, v) => acc + (parseFloat(v.total_desconto) || 0),
          0
        ),
        total_comissao: vendas.reduce(
          (acc, v) => acc + (parseFloat(v.total_comissao) || 0),
          0
        ),
        vendas_canceladas: vendas.filter((v) => v.cancelada === 1).length,
        data_inicio: dataInicio,
        data_fim: dataFim,
      };

      return {
        validated: true,
        resumo: resumo,
        vendas: vendasComItens,
      };
    } catch (e) {
      return { validated: false, error: e.message };
    }
  }

  async vendasPorDia(data) {
    try {
      return await this.vendasPorPeriodo(data, data);
    } catch (e) {
      return { validated: false, error: e.message };
    }
  }

  async vendasPorMes(mes, ano) {
    try {
      const dataInicio = `${ano}-${String(mes).padStart(2, "0")}-01`;
      const ultimoDia = new Date(ano, mes, 0).getDate();
      const dataFim = `${ano}-${String(mes).padStart(2, "0")}-${ultimoDia}`;

      return await this.vendasPorPeriodo(dataInicio, dataFim);
    } catch (e) {
      return { validated: false, error: e.message };
    }
  }

  async comissaoVendedores(dataInicio, dataFim) {
    try {
      const dataInicioConvertida = this.converterData(dataInicio);
      const dataFimConvertida = this.converterData(dataFim);

      const vendasDebug = await db
        .select("id_venda", "data_venda", "id_vendedor", "cancelada", "total_comissao")
        .from("vendas")
        .whereBetween("data_venda", [dataInicioConvertida, dataFimConvertida]);
      
      console.log("=== DEBUG COMISSÕES ===");
      console.log("Período:", dataInicioConvertida, "até", dataFimConvertida);
      console.log("Vendas encontradas no período:", vendasDebug.length);
      console.log("Primeiras vendas:", vendasDebug.slice(0, 3));

      const comissoes = await db
        .select(
          "vendedor.id_pessoa as id_vendedor",
          "vendedor.nome_razao_social as nome_vendedor",
          "vendedor.cpf",
          "vendedor.cnpj"
        )
        .count("vendas.id_venda as total_vendas")
        .sum("vendas.total_venda as valor_total_vendas")
        .sum("vendas.total_comissao as total_comissao")
        .avg("vendas.margem_comissao as margem_comissao_media")
        .from("vendas")
        .leftJoin(
          "pessoas as vendedor",
          "vendas.id_vendedor",
          "vendedor.id_pessoa"
        )
        .whereBetween("vendas.data_venda", [dataInicioConvertida, dataFimConvertida])
        .where(function() {
          this.where("vendas.cancelada", 2).orWhereNull("vendas.cancelada");
        })
        .whereNotNull("vendas.id_vendedor")
        .groupBy(
          "vendedor.id_pessoa",
          "vendedor.nome_razao_social",
          "vendedor.cpf",
          "vendedor.cnpj"
        )
        .orderBy("total_comissao", "desc");

      if (comissoes.length === 0) {
        return {
          validated: false,
          error: "Nenhuma comissão encontrada no período informado",
        };
      }
      const comissoesDetalhadas = await Promise.all(
        comissoes.map(async (vendedor) => {
          const vendas = await db
            .select(
              "vendas.id_venda",
              "vendas.num_venda",
              "vendas.data_venda",
              "vendas.total_venda",
              "vendas.total_comissao",
              "vendas.margem_comissao",
              "cliente.nome_razao_social as nome_cliente"
            )
            .from("vendas")
            .leftJoin(
              "pessoas as cliente",
              "vendas.id_cliente",
              "cliente.id_pessoa"
            )
            .where("vendas.id_vendedor", vendedor.id_vendedor)
            .whereBetween("vendas.data_venda", [dataInicioConvertida, dataFimConvertida])
            .where(function() {
              this.where("vendas.cancelada", 2).orWhereNull("vendas.cancelada");
            })
            .orderBy("vendas.data_venda", "desc");

          return {
            ...vendedor,
            vendas: vendas,
          };
        })
      );

      const resumo = {
        total_vendedores: comissoes.length,
        total_vendas: comissoes.reduce(
          (acc, v) => acc + parseInt(v.total_vendas || 0),
          0
        ),
        valor_total_vendas: comissoes.reduce(
          (acc, v) => acc + (parseFloat(v.valor_total_vendas) || 0),
          0
        ),
        total_comissoes: comissoes.reduce(
          (acc, v) => acc + (parseFloat(v.total_comissao) || 0),
          0
        ),
        data_inicio: dataInicio,
        data_fim: dataFim,
      };

      return {
        validated: true,
        resumo: resumo,
        vendedores: comissoesDetalhadas,
      };
    } catch (e) {
      return { validated: false, error: e.message };
    }
  }
}

module.exports = new Relatorio();
