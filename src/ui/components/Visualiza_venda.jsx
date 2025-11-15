import React from "react";
import "./Visualiza_venda.css";

function VisualizaVenda({ venda, onClose }) {
  if (!venda) return null;

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
    <div className="modal-overlay-venda" onClick={onClose}>
      <div className="modal-content-venda" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-venda">
          <h2>Detalhes da Venda</h2>
          <button className="modal-close-venda" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-body-venda">
          {/* Informações Gerais */}
          <div className="venda-info-section">
            <h3>Informações Gerais</h3>
            <div className="info-grid">
              <div className="info-item">
                <label>Número da Venda:</label>
                <span>{venda.pedido.num_venda}</span>
              </div>
              <div className="info-item">
                <label>Data:</label>
                <span>{formatDate(venda.pedido.data_venda)}</span>
              </div>
              <div className="info-item">
                <label>Cliente:</label>
                <span>{venda.pedido.nome_cliente}</span>
              </div>
              <div className="info-item">
                <label>Status:</label>
                <span className={`status-badge ${venda.pedido.cancelada === 2 ? 'status-ativa' : 'status-cancelada'}`}>
                  {venda.pedido.cancelada === 2 ? "Ativa" : "Cancelada"}
                </span>
              </div>
              <div className="info-item">
                <label>Margem Desconto:</label>
                <span>{venda.pedido.margem_total_desconto}%</span>
              </div>
              <div className="info-item">
                <label>Margem Comissão:</label>
                <span>{venda.pedido.margem_comissao}%</span>
              </div>
            </div>
          </div>

          {/* Itens da Venda */}
          <div className="venda-items-section">
            <h3>Itens da Venda</h3>
            <div className="table-wrapper">
              <table className="items-table-venda">
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
                  {venda.itens.map((item) => (
                    <tr key={item.id_item_venda}>
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
          <div className="venda-totals-section">
            <h3>Resumo Financeiro</h3>
            <div className="totals-grid">
              <div className="total-item">
                <label>Total Produtos:</label>
                <span>{formatCurrency(venda.pedido.total_produtos)}</span>
              </div>
              <div className="total-item desconto">
                <label>Total Desconto:</label>
                <span>- {formatCurrency(venda.pedido.total_desconto)}</span>
              </div>
              <div className="total-item comissao">
                <label>Total Comissão:</label>
                <span>{formatCurrency(venda.pedido.total_comissao)}</span>
              </div>
              <div className="total-item highlight">
                <label>Total da Venda:</label>
                <span>{formatCurrency(venda.pedido.total_venda)}</span>
              </div>
            </div>
          </div>

          {/* Observações */}
          {(venda.pedido.observacoes_venda || venda.pedido.observacoes_internas) && (
            <div className="venda-observacoes-section">
              {venda.pedido.observacoes_venda && (
                <div className="observacao-box">
                  <h3>Observações da Venda</h3>
                  <p>{venda.pedido.observacoes_venda}</p>
                </div>
              )}
              {venda.pedido.observacoes_internas && (
                <div className="observacao-box internas">
                  <h3>Observações Internas</h3>
                  <p>{venda.pedido.observacoes_internas}</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="modal-footer-venda">
          <button className="btn-fechar" onClick={onClose}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

export default VisualizaVenda;