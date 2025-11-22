import React from "react";
import "./Visualiza_orcamento.css";

function VisualizaOrcamento({ orcamento, onClose }) {
  if (!orcamento) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <div className="modal-overlay-orcamento" onClick={onClose}>
      <div className="modal-content-orcamento" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-orcamento">
          <h2>Detalhes do Orçamento</h2>
          <button className="modal-close-orcamento" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-body-orcamento">
          {/* Informações Gerais */}
          <div className="orcamento-info-section">
            <h3>Informações Gerais</h3>
            <div className="info-grid">
              <div className="info-item">
                <label>Número do Orçamento:</label>
                <span>{orcamento.pedido.num_orcamento}</span>
              </div>
              <div className="info-item">
                <label>Data:</label>
                <span>{formatDate(orcamento.pedido.data_orcamento)}</span>
              </div>
              <div className="info-item">
                <label>Cliente:</label>
                <span>{orcamento.pedido.nome_cliente}</span>
              </div>
              <div className="info-item">
                <label>Status:</label>
                <span className={`status-badge ${orcamento.pedido.cancelado === 2 ? 'status-ativo' : 'status-cancelado'}`}>
                  {orcamento.pedido.cancelado === 2 ? "Ativo" : "Cancelado"}
                </span>
              </div>
              <div className="info-item">
                <label>Margem Desconto:</label>
                <span>{orcamento.pedido.margem_total_desconto}%</span>
              </div>
            </div>
          </div>

          {/* Itens do Orçamento */}
          <div className="orcamento-items-section">
            <h3>Itens do Orçamento</h3>
            <div className="table-wrapper">
              <table className="items-table-orcamento">
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Descrição</th>
                    <th>Quantidade</th>
                    <th>Unidade</th>
                    <th>Preço Unit.</th>
                    <th>% Desc.</th>
                    <th>Desconto</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {orcamento.itens.map((item) => (
                    <tr key={item.id_item_orcamento}>
                      <td>{item.codigo}</td>
                      <td>{item.descricao}</td>
                      <td className="text-center">{parseFloat(item.quantidade).toFixed(3)}</td>
                      <td className="text-center">{item.unidade_medida}</td>
                      <td className="text-right">{formatCurrency(item.preco_unitario)}</td>
                      <td className="text-center">{item.margem_desconto}%</td>
                      <td className="text-right">{formatCurrency(item.valor_desconto)}</td>
                      <td className="text-right total-cell">{formatCurrency(item.preco_total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totais */}
          <div className="orcamento-totals-section">
            <h3>Resumo Financeiro</h3>
            <div className="totals-grid">
              <div className="total-item">
                <label>Total Produtos:</label>
                <span>{formatCurrency(orcamento.pedido.total_produtos)}</span>
              </div>
              <div className="total-item desconto">
                <label>Total Desconto:</label>
                <span>- {formatCurrency(orcamento.pedido.total_desconto)}</span>
              </div>
              <div className="total-item highlight">
                <label>Total do Orçamento:</label>
                <span>{formatCurrency(orcamento.pedido.total_orcamento)}</span>
              </div>
            </div>
          </div>

          {/* Observações */}
          {(orcamento.pedido.observacoes_orcamento || orcamento.pedido.observacoes_internas) && (
            <div className="orcamento-observacoes-section">
              {orcamento.pedido.observacoes_orcamento && (
                <div className="observacao-box">
                  <h3>Observações do Orçamento</h3>
                  <p>{orcamento.pedido.observacoes_orcamento}</p>
                </div>
              )}
              {orcamento.pedido.observacoes_internas && (
                <div className="observacao-box internas">
                  <h3>Observações Internas</h3>
                  <p>{orcamento.pedido.observacoes_internas}</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="modal-footer-orcamento">
          <button className="btn-fechar" onClick={onClose}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

export default VisualizaOrcamento;
