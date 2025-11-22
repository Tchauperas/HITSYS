import React, { useState, useEffect } from "react";
import "./PagamentoVendaModal.css";

function PagamentoVendaModal({ isOpen, onClose, totalVenda, onConfirm, idVenda }) {
  const [formasPagamento, setFormasPagamento] = useState([]);
  const [pagamentos, setPagamentos] = useState([]);
  const [selectedForma, setSelectedForma] = useState("");
  const [valorPagamento, setValorPagamento] = useState("");
  const [parcelas, setParcelas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetchFormasPagamento();
    }
  }, [isOpen]);

  const fetchFormasPagamento = async () => {
    const token = JSON.parse(localStorage.getItem("userData"))?.token;
    if (!token) return;

    try {
      const response = await fetch("http://127.0.0.1:3000/formas-pagamento/visualizar", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (data.success) {
        setFormasPagamento(data.values);
      }
    } catch (err) {
      console.error("Erro ao carregar formas de pagamento:", err);
    }
  };

  const handleAddPagamento = () => {
    if (!selectedForma) {
      setError("Selecione uma forma de pagamento.");
      return;
    }

    const valor = parseFloat(valorPagamento);
    if (isNaN(valor) || valor <= 0) {
      setError("Digite um valor válido.");
      return;
    }

    const totalAtual = pagamentos.reduce((sum, p) => sum + p.valor, 0);
    if (totalAtual + valor > totalVenda) {
      setError(`Valor total não pode exceder R$ ${totalVenda.toFixed(2)}`);
      return;
    }

    const forma = formasPagamento.find(f => f.id_forma_pagamento === parseInt(selectedForma));
    const novoPagamento = {
      id_forma_pagamento: parseInt(selectedForma),
      forma_descricao: forma.descricao,
      valor: valor,
      a_prazo: forma.a_prazo,
      parcelas_geradas: []
    };

    // Se for A Prazo, gerar parcelas
    if (forma.a_prazo === 1 || forma.a_prazo === "1") {
      gerarParcelas(novoPagamento, forma);
    }

    setPagamentos([...pagamentos, novoPagamento]);
    setSelectedForma("");
    setValorPagamento("");
    setError("");
  };

  const gerarParcelas = (pagamento, forma) => {
    const numParcelas = parseInt(forma.num_parcelas) || 1;
    const valorParcela = pagamento.valor / numParcelas;
    const periodoDias = parseInt(forma.periodo_dias) || 30;

    const parcelasGeradas = [];
    const hoje = new Date();

    for (let i = 1; i <= numParcelas; i++) {
      const dataVencimento = new Date(hoje);
      
      // Somar os dias de período multiplicado pelo número da parcela
      // Parcela 1: hoje + periodo_dias
      // Parcela 2: hoje + (periodo_dias * 2)
      // Parcela 3: hoje + (periodo_dias * 3)
      const diasTotais = periodoDias * i;
      dataVencimento.setDate(dataVencimento.getDate() + diasTotais);

      parcelasGeradas.push({
        num_parcela: `${i}/${numParcelas}`,
        valor: valorParcela,
        data_vencimento: dataVencimento.toISOString().split("T")[0],
        editando: false,
      });
    }

    pagamento.parcelas_geradas = parcelasGeradas;
  };

  const removePagamento = (index) => {
    setPagamentos(pagamentos.filter((_, i) => i !== index));
  };

  const editarParcela = (pagamentoIndex, parcelaIndex, campo, valor) => {
    const novosPagamentos = [...pagamentos];
    if (campo === "valor") {
      novosPagamentos[pagamentoIndex].parcelas_geradas[parcelaIndex].valor = parseFloat(valor) || 0;
    } else if (campo === "data_vencimento") {
      novosPagamentos[pagamentoIndex].parcelas_geradas[parcelaIndex].data_vencimento = valor;
    }
    setPagamentos(novosPagamentos);
  };

  const handleConfirm = () => {
    const totalPago = pagamentos.reduce((sum, p) => sum + p.valor, 0);
    
    if (Math.abs(totalPago - totalVenda) > 0.01) {
      setError(`Total de pagamentos deve ser exatamente R$ ${totalVenda.toFixed(2)}`);
      return;
    }

    if (pagamentos.length === 0) {
      setError("Adicione pelo menos uma forma de pagamento.");
      return;
    }

    onConfirm(pagamentos);
  };

  if (!isOpen) return null;

  const totalPago = pagamentos.reduce((sum, p) => sum + p.valor, 0);
  const saldoRestante = totalVenda - totalPago;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Pagamento da Venda</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <div className="resumo-venda">
            <p><strong>Total da Venda:</strong> R$ {totalVenda.toFixed(2)}</p>
            <p><strong>Total Pago:</strong> R$ {totalPago.toFixed(2)}</p>
            <p className={saldoRestante > 0.01 ? "saldo-pendente" : "saldo-zero"}>
              <strong>Saldo Restante:</strong> R$ {saldoRestante.toFixed(2)}
            </p>
          </div>

          <div className="form-group">
            <label>Forma de Pagamento</label>
            <select 
              value={selectedForma} 
              onChange={(e) => setSelectedForma(e.target.value)}
            >
              <option value="">Selecione uma forma...</option>
              {formasPagamento.map(forma => (
                <option key={forma.id_forma_pagamento} value={forma.id_forma_pagamento}>
                  {forma.descricao} ({forma.tipo})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Valor</label>
            <input
              type="number"
              value={valorPagamento}
              onChange={(e) => setValorPagamento(e.target.value)}
              placeholder={`Máximo: R$ ${saldoRestante.toFixed(2)}`}
              max={saldoRestante}
              step="0.01"
            />
          </div>

          <button className="btn-add-pagamento" onClick={handleAddPagamento}>
            Adicionar Forma de Pagamento
          </button>

          {error && <div className="error-message">{error}</div>}

          <div className="pagamentos-list">
            <h3>Formas de Pagamento Adicionadas</h3>
            {pagamentos.map((pagamento, pIndex) => (
              <div key={pIndex} className="pagamento-item">
                <div className="pagamento-header">
                  <span>{pagamento.forma_descricao}</span>
                  <span>R$ {pagamento.valor.toFixed(2)}</span>
                  <button 
                    className="btn-remove" 
                    onClick={() => removePagamento(pIndex)}
                  >
                    ✕
                  </button>
                </div>

                {pagamento.a_prazo === 1 || pagamento.a_prazo === "1" ? (
                  <div className="parcelas-section">
                    <h4>Parcelas</h4>
                    <table className="parcelas-table">
                      <thead>
                        <tr>
                          <th>Parcela</th>
                          <th>Valor</th>
                          <th>Data Vencimento</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pagamento.parcelas_geradas.map((parcela, pIdx) => (
                          <tr key={pIdx}>
                            <td>{parcela.num_parcela}</td>
                            <td>
                              <input
                                type="number"
                                value={parcela.valor}
                                onChange={(e) => editarParcela(pIndex, pIdx, "valor", e.target.value)}
                                step="0.01"
                              />
                            </td>
                            <td>
                              <input
                                type="date"
                                value={parcela.data_vencimento}
                                onChange={(e) => editarParcela(pIndex, pIdx, "data_vencimento", e.target.value)}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="pagamento-vista">
                    Pagamento à Vista em {pagamento.forma_descricao}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button 
            className="btn-primary" 
            onClick={handleConfirm}
            disabled={saldoRestante > 0.01}
          >
            Confirmar Pagamento
          </button>
        </div>
      </div>
    </div>
  );
}

export default PagamentoVendaModal;
