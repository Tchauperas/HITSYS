import React from "react";
import "./Visualiza_compra.css";

function VisualizaCompra({ compra, onClose }) {
  if (!compra) return null;

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
    <div className="modal-overlay-compra" onClick={onClose}>
      <div className="modal-content-compra" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-compra">
          <h2>Detalhes da Compra</h2>
          <button className="modal-close-compra" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-body-compra">
          {/* Informações Gerais */}
          <div className="compra-info-section">
            <h3>Informações Gerais</h3>
            <div className="info-grid">
              <div className="info-item">
                <label>Número da Compra:</label>
                <span>{compra.pedido.num_compra}</span>
              </div>
              <div className="info-item">
                <label>Data:</label>
                <span>{formatDate(compra.pedido.data_compra)}</span>
              </div>
              <div className="info-item">
                <label>Fornecedor:</label>
                <span>{compra.pedido.nome_fornecedor}</span>
              </div>
              <div className="info-item">
                <label>Status:</label>
                <span className={`status-badge ${compra.pedido.cancelada === 0 ? 'status-ativa' : 'status-cancelada'}`}>
                  {compra.pedido.cancelada === 0 ? "Ativa" : "Cancelada"}
                </span>
              </div>
              <div className="info-item">
                <label>Margem Desconto:</label>
                <span>{compra.pedido.margem_total_desconto}%</span>
              </div>
            </div>
          </div>

          {/* Itens da Compra */}
          <div className="compra-items-section">
            <h3>Itens da Compra</h3>
            <div className="table-wrapper">
              <table className="items-table-compra">
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Código Fornecedor</th>
                    <th>Descrição</th>
                    <th>Qtd. Compra</th>
                    <th>Und. Compra</th>
                    <th>Custo Unit.</th>
                    <th>% Desc.</th>
                    <th>Desconto</th>
                    <th>Margem Lucro</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {compra.itens.map((item) => (
                    <tr key={item.id_item_compra}>
                      <td>{item.codigo}</td>
                      <td>{item.codigo_fornecedor}</td>
                      <td>{item.descricao}</td>
                      <td className="text-center">{parseFloat(item.quantidade_compra).toFixed(3)}</td>
                      <td className="text-center">{item.und_compra}</td>
                      <td className="text-right">{formatCurrency(item.custo_und_compra)}</td>
                      <td className="text-center">{item.margem_desconto}%</td>
                      <td className="text-right">{formatCurrency(item.valor_desconto)}</td>
                      <td className="text-center">{item.margem_lucro}%</td>
                      <td className="text-right total-cell">{formatCurrency(item.custo_compra)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totais */}
          <div className="compra-totals-section">
            <h3>Resumo Financeiro</h3>
            <div className="totals-grid">
              <div className="total-item">
                <label>Total Produtos:</label>
                <span>{formatCurrency(compra.pedido.total_produtos)}</span>
              </div>
              <div className="total-item">
                <label>Outros Custos:</label>
                <span>{formatCurrency(compra.pedido.outros_custos)}</span>
              </div>
              <div className="total-item desconto">
                <label>Total Desconto:</label>
                <span>- {formatCurrency(compra.pedido.total_desconto)}</span>
              </div>
              <div className="total-item highlight">
                <label>Total da Compra:</label>
                <span>{formatCurrency(compra.pedido.total_compra)}</span>
              </div>
            </div>
          </div>

          {/* Observações */}
          {(compra.pedido.observacoes_compra || compra.pedido.observacoes_internas) && (
            <div className="compra-observacoes-section">
              {compra.pedido.observacoes_compra && (
                <div className="observacao-box">
                  <h3>Observações da Compra</h3>
                  <p>{compra.pedido.observacoes_compra}</p>
                </div>
              )}
              {compra.pedido.observacoes_internas && (
                <div className="observacao-box internas">
                  <h3>Observações Internas</h3>
                  <p>{compra.pedido.observacoes_internas}</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="modal-footer-compra">
          <button className="btn-fechar" onClick={onClose}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

export default VisualizaCompra;
