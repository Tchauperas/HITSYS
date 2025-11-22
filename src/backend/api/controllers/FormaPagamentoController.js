const FormaPagamento = require("../models/FormaPagamento");

const visualizar = async (req, res) => {
  const result = await FormaPagamento.visualizarFormasPagamento();
  
  if (result.validated) {
    res.json({ success: true, values: result.values });
  } else {
    res.status(500).json({ success: false, message: result.message });
  }
};

const cadastrar = async (req, res) => {
  const dados = req.body;
  const result = await FormaPagamento.criarFormaPagamento(dados);
  
  if (result.validated) {
    res.json({ success: true, id_forma_pagamento: result.id_forma_pagamento });
  } else {
    res.status(500).json({ success: false, message: result.message });
  }
};

const alterar = async (req, res) => {
  const { id } = req.params;
  const dados = req.body;
  const result = await FormaPagamento.alterarFormaPagamento(id, dados);
  
  if (result.validated) {
    res.json({ success: true });
  } else {
    res.status(500).json({ success: false, message: result.message });
  }
};

const deletar = async (req, res) => {
  const { id } = req.params;
  const result = await FormaPagamento.deletarFormaPagamento(id);
  
  if (result.validated) {
    res.json({ success: true });
  } else {
    res.status(500).json({ success: false, message: result.message });
  }
};

module.exports = {
  visualizar,
  cadastrar,
  alterar,
  deletar
};
