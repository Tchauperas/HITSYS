const db = require("../configs/config");

const visualizarFormasPagamento = async () => {
  try {
    const formas = await db("formas_pagamento").select(
      "id_forma_pagamento",
      "descricao", 
      "a_prazo",
      "num_parcelas",
      "dia_vencimento",
      "periodo_dias",
      "ativa"
    );
    
    // Adiciona campo tipo calculado baseado em a_prazo
    const formasComTipo = formas.map(forma => ({
      ...forma,
      tipo: forma.a_prazo === 2 ? "À Vista" : "A Prazo"
    }));
    
    return { validated: true, values: formasComTipo };
  } catch (err) {
    console.error("Erro ao buscar formas de pagamento:", err);
    return { validated: false, message: "Erro ao buscar formas de pagamento" };
  }
};

const criarFormaPagamento = async (dados) => {
  try {
    const [id] = await db("formas_pagamento").insert(dados);
    return { validated: true, id_forma_pagamento: id };
  } catch (err) {
    console.error("Erro ao criar forma de pagamento:", err);
    return { validated: false, message: "Erro ao criar forma de pagamento" };
  }
};

const alterarFormaPagamento = async (id, dados) => {
  try {
    await db("formas_pagamento").where("id_forma_pagamento", id).update(dados);
    return { validated: true };
  } catch (err) {
    console.error("Erro ao alterar forma de pagamento:", err);
    return { validated: false, message: "Erro ao alterar forma de pagamento" };
  }
};

const deletarFormaPagamento = async (id) => {
  try {
    await db("formas_pagamento").where("id_forma_pagamento", id).del();
    return { validated: true };
  } catch (err) {
    console.error("Erro ao deletar forma de pagamento:", err);
    return { validated: false, message: "Erro ao deletar forma de pagamento" };
  }
};

module.exports = {
  visualizarFormasPagamento,
  criarFormaPagamento,
  alterarFormaPagamento,
  deletarFormaPagamento
};
