import React, { useState } from "react";
import "./ComissaoVendedor.css";
import Navbar from "../components/Navbar";
import WindowControls from "../components/WindowControls";

const ComissaoVendedor = () => {
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [relatorio, setRelatorio] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [vendedorSelecionado, setVendedorSelecionado] = useState(null);

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

  const formatCPFCNPJ = (cpf, cnpj) => {
    if (cnpj) {
      return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
    }
    if (cpf) {
      return cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");
    }
    return "N/A";
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
        "http://127.0.0.1:3000/relatorios/comissao/vendedores",
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

  const toggleDetalhesVendedor = (idVendedor) => {
    if (vendedorSelecionado === idVendedor) {
      setVendedorSelecionado(null);
    } else {
      setVendedorSelecionado(idVendedor);
    }
  };

  const limparFiltros = () => {
    setDataInicio("");
    setDataFim("");
    setRelatorio(null);
    setError(null);
  };

  return (
    <div className="comissao-vendedor-container">
      <WindowControls />
      <Navbar />

      <div className="content">
        <header className="top-row">
          <div className="title">
            <h1>💰 RELATÓRIO DE COMISSÃO DE VENDEDORES</h1>
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
                  <h3>Total de Vendedores</h3>
                  <p className="resumo-valor">
                    {relatorio.resumo.total_vendedores}
                  </p>
                </div>
                <div className="resumo-card">
                  <h3>Total de Vendas</h3>
                  <p className="resumo-valor">
                    {relatorio.resumo.total_vendas}
                  </p>
                </div>
                <div className="resumo-card">
                  <h3>Valor Total de Vendas</h3>
                  <p className="resumo-valor destaque">
                    {formatCurrency(relatorio.resumo.valor_total_vendas)}
                  </p>
                </div>
                <div className="resumo-card">
                  <h3>Total de Comissões</h3>
                  <p className="resumo-valor comissao-total">
                    {formatCurrency(relatorio.resumo.total_comissoes)}
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

            <div className="vendedores-lista-container">
              <h2>Detalhamento por Vendedor ({relatorio.vendedores.length})</h2>
              {relatorio.vendedores.map((vendedor) => (
                <div key={vendedor.id_vendedor} className="vendedor-card">
                  <div
                    className="vendedor-header"
                    onClick={() => toggleDetalhesVendedor(vendedor.id_vendedor)}
                  >
                    <div className="vendedor-info">
                      <span className="vendedor-nome">
                        {vendedor.nome_vendedor}
                      </span>
                      <span className="vendedor-documento">
                        {formatCPFCNPJ(vendedor.cpf, vendedor.cnpj)}
                      </span>
                    </div>
                    <div className="vendedor-metricas">
                      <div className="metrica">
                        <span className="metrica-label">Vendas:</span>
                        <span className="metrica-valor">
                          {vendedor.total_vendas}
                        </span>
                      </div>
                      <div className="metrica">
                        <span className="metrica-label">Total Vendido:</span>
                        <span className="metrica-valor">
                          {formatCurrency(parseFloat(vendedor.valor_total_vendas))}
                        </span>
                      </div>
                      <div className="metrica">
                        <span className="metrica-label">Comissão Total:</span>
                        <span className="metrica-valor comissao">
                          {formatCurrency(parseFloat(vendedor.total_comissao))}
                        </span>
                      </div>
                      <div className="metrica">
                        <span className="metrica-label">Margem Média:</span>
                        <span className="metrica-valor">
                          {parseFloat(vendedor.margem_comissao_media).toFixed(2)}%
                        </span>
                      </div>
                    </div>
                    <div className="vendedor-expand">
                      {vendedorSelecionado === vendedor.id_vendedor ? "▼" : "▶"}
                    </div>
                  </div>

                  {vendedorSelecionado === vendedor.id_vendedor && (
                    <div className="vendedor-detalhes">
                      <h3>Vendas Realizadas ({vendedor.vendas.length})</h3>
                      <div className="vendas-table">
                        <table>
                          <thead>
                            <tr>
                              <th>Número da Venda</th>
                              <th>Data</th>
                              <th>Cliente</th>
                              <th>Total da Venda</th>
                              <th>Margem</th>
                              <th>Comissão</th>
                            </tr>
                          </thead>
                          <tbody>
                            {vendedor.vendas.map((venda) => (
                              <tr key={venda.id_venda}>
                                <td className="venda-numero">
                                  {venda.num_venda}
                                </td>
                                <td>{formatDateFromAPI(venda.data_venda)}</td>
                                <td>{venda.nome_cliente}</td>
                                <td className="valor-destaque">
                                  {formatCurrency(parseFloat(venda.total_venda))}
                                </td>
                                <td>
                                  {parseFloat(venda.margem_comissao).toFixed(2)}%
                                </td>
                                <td className="comissao-valor">
                                  {formatCurrency(parseFloat(venda.total_comissao))}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot>
                            <tr className="total-row">
                              <td colSpan="3"><strong>TOTAL</strong></td>
                              <td className="valor-destaque">
                                <strong>
                                  {formatCurrency(parseFloat(vendedor.valor_total_vendas))}
                                </strong>
                              </td>
                              <td>
                                <strong>
                                  {parseFloat(vendedor.margem_comissao_media).toFixed(2)}%
                                </strong>
                              </td>
                              <td className="comissao-valor">
                                <strong>
                                  {formatCurrency(parseFloat(vendedor.total_comissao))}
                                </strong>
                              </td>
                            </tr>
                          </tfoot>
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

export default ComissaoVendedor;