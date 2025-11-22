import React, { useState } from "react";
import "./VendasPorPeriodo.css";
import Navbar from "../components/Navbar";
import WindowControls from "../components/WindowControls";
import logo from "../assets/vendas_periodo_icon.png";

const VendasPorPeriodo = () => {
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [relatorio, setRelatorio] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [vendaSelecionada, setVendaSelecionada] = useState(null);

  const formatDateToAPI = (dateString) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  const formatDateFromAPI = (dateString) => {
    if (!dateString) return "";
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

  const buscarRelatorio = async () => {
    if (!dataInicio || !dataFim) {
      alert("Por favor, preencha as datas de início e fim");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const token = JSON.parse(localStorage.getItem("userData"))?.token;

      const response = await fetch(
        "http://127.0.0.1:3000/relatorios/vendas/periodo",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            dataInicio: formatDateToAPI(dataInicio),
            dataFim: formatDateToAPI(dataFim),
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      const text = await response.text();

      if (!text) {
        throw new Error("Resposta vazia do servidor");
      }

      const data = JSON.parse(text);

      if (data.success) {
        setRelatorio(data);
      } else {
        setError(data.message || "Erro ao carregar relatório");
      }
    } catch (err) {
      setError(`Erro ao conectar com o servidor: ${err.message}`);
      console.error("Erro completo:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleDetalhesVenda = (idVenda) => {
    if (vendaSelecionada === idVenda) {
      setVendaSelecionada(null);
    } else {
      setVendaSelecionada(idVenda);
    }
  };

  const limparFiltros = () => {
    setDataInicio("");
    setDataFim("");
    setRelatorio(null);
    setError(null);
  };

  return (
    <div className="vendas-periodo-container">
      <WindowControls />
      <Navbar />

      <div className="content">
        <header className="top-row">
          <div className="title">
            <span className="icon-bg">
              <img src={logo} alt="Ícone Relatório" className="title-icon" />
        </span>
        <h1>RELATÓRIO DE VENDAS POR PERÍODO</h1>
      </div>

        </header>

        <div className="filtros-container">
          <div className="filtro-group">
            <label>Data Início:</label>
            <input
              type="date"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
            />
          </div>
          <div className="filtro-group">
            <label>Data Fim:</label>
            <input
              type="date"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
            />
          </div>
          <button
            className="btn-buscar"
            onClick={buscarRelatorio}
            disabled={loading}
          >
            {loading ? "Buscando..." : "🔍 Buscar"}
          </button>
          <button className="btn-limpar" onClick={limparFiltros}>
            🗑️ Limpar
          </button>
        </div>

        {error && <p className="error-message">{error}</p>}

        {relatorio && (
          <>
            <div className="resumo-container">
              <h2>Resumo do Período</h2>
              <div className="resumo-cards">
                <div className="resumo-card">
                  <h3>Total de Vendas</h3>
                  <p className="resumo-valor">
                    {relatorio.resumo.total_vendas}
                  </p>
                </div>
                <div className="resumo-card">
                  <h3>Valor Total</h3>
                  <p className="resumo-valor destaque">
                    {formatCurrency(relatorio.resumo.valor_total_vendas)}
                  </p>
                </div>
                <div className="resumo-card">
                  <h3>Total Desconto</h3>
                  <p className="resumo-valor">
                    {formatCurrency(relatorio.resumo.total_desconto)}
                  </p>
                </div>
                <div className="resumo-card">
                  <h3>Total Comissão</h3>
                  <p className="resumo-valor">
                    {formatCurrency(relatorio.resumo.total_comissao)}
                  </p>
                </div>
                <div className="resumo-card">
                  <h3>Vendas Canceladas</h3>
                  <p className="resumo-valor canceladas">
                    {relatorio.resumo.vendas_canceladas}
                  </p>
                </div>
              </div>
              <div className="periodo-info">
                <p>
                  Período: {relatorio.resumo.data_inicio} até{" "}
                  {relatorio.resumo.data_fim}
                </p>
              </div>
            </div>

            <div className="vendas-lista-container">
              <h2>Detalhamento das Vendas ({relatorio.vendas.length})</h2>
              {relatorio.vendas.map((venda) => (
                <div key={venda.id_venda} className="venda-card">
                  <div
                    className="venda-header"
                    onClick={() => toggleDetalhesVenda(venda.id_venda)}
                  >
                    <div className="venda-info">
                      <span className="venda-numero">{venda.num_venda}</span>
                      <span className="venda-data">
                        {formatDateFromAPI(venda.data_venda)}
                      </span>
                    </div>
                    <div className="venda-cliente">
                      <strong>Cliente:</strong> {venda.nome_cliente}
                    </div>
                    <div className="venda-valores">
                      <span>Total: {formatCurrency(venda.total_venda)}</span>
                      {venda.total_comissao > 0 && (
                        <span className="comissao">
                          Comissão: {formatCurrency(venda.total_comissao)}
                        </span>
                      )}
                    </div>
                    <div className="venda-expand">
                      {vendaSelecionada === venda.id_venda ? "▼" : "▶"}
                    </div>
                  </div>

                  {vendaSelecionada === venda.id_venda && (
                    <div className="venda-detalhes">
                      <div className="detalhes-info">
                        <div className="info-row">
                          <strong>Vendedor:</strong> {venda.nome_vendedor}
                        </div>
                        <div className="info-row">
                          <strong>Empresa:</strong> {venda.nome_empresa}
                        </div>
                        <div className="info-row">
                          <strong>Usuário:</strong> {venda.usuario_lancamento}
                        </div>
                        <div className="info-row">
                          <strong>Margem Comissão:</strong>{" "}
                          {venda.margem_comissao}%
                        </div>
                        {venda.observacoes_venda && (
                          <div className="info-row">
                            <strong>Observações:</strong>{" "}
                            {venda.observacoes_venda}
                          </div>
                        )}
                      </div>

                      <div className="itens-table">
                        <h3>Itens da Venda</h3>
                        <table>
                          <thead>
                            <tr>
                              <th>Código</th>
                              <th>Produto</th>
                              <th>Qtd</th>
                              <th>Preço Unit.</th>
                              <th>Desconto</th>
                              <th>Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {venda.itens.map((item) => (
                              <tr key={item.id_item_venda}>
                                <td>{item.codigo}</td>
                                <td>{item.produto}</td>
                                <td>
                                  {parseFloat(item.quantidade).toFixed(3)}{" "}
                                  {item.unidade_medida}
                                </td>
                                <td>{formatCurrency(item.preco_unitario)}</td>
                                <td>
                                  {item.margem_desconto}% (
                                  {formatCurrency(item.valor_desconto)})
                                </td>
                                <td>{formatCurrency(item.preco_total)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VendasPorPeriodo;
