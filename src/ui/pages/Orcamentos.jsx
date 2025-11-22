import React, { useState, useEffect } from "react";
import "./Orcamentos.css";
import Navbar from "../components/Navbar";
import VisualizaOrcamento from "../components/Visualiza_orcamento";
import logo from "../assets/orcamentos_icon.png";
import WindowControls from "../components/WindowControls";

function Orcamentos() {
  const [orcamentos, setOrcamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedOrcamento, setSelectedOrcamento] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    fetchOrcamentos();
  }, []);

  const fetchOrcamentos = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://127.0.0.1:3000/orcamentos/visualizar");
      const data = await response.json();

      if (data.success) {
        setOrcamentos(data.orcamentos);
      } else {
        setError("Erro ao carregar orçamentos");
      }
    } catch (err) {
      setError("Erro ao conectar com o servidor");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrcamentoDetails = async (id) => {
    try {
      setLoadingDetails(true);
      const response = await fetch(`http://127.0.0.1:3000/orcamentos/visualizar/${id}`);
      const data = await response.json();

      if (data.success) {
        setSelectedOrcamento({
          pedido: data.pedido,
          itens: data.itens
        });
        setShowModal(true);
      } else {
        alert("Erro ao carregar detalhes do orçamento");
      }
    } catch (err) {
      alert("Erro ao conectar com o servidor");
      console.error(err);
    } finally {
      setLoadingDetails(false);
    }
  };

  const faturarOrcamento = async (id, numOrcamento) => {
    if (!window.confirm(`Deseja realmente faturar o orçamento ${numOrcamento}? Esta ação irá converter o orçamento em uma venda.`)) {
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:3000/orcamentos/faturar/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();

      if (data.success) {
        alert(`Orçamento faturado com sucesso! Venda #${data.id_venda} criada.`);
        fetchOrcamentos(); // Recarrega a lista
      } else {
        alert(`Erro ao faturar orçamento: ${data.message}`);
      }
    } catch (err) {
      alert("Erro ao conectar com o servidor");
      console.error(err);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedOrcamento(null);
  };

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

  const filteredOrcamentos = orcamentos.filter((orcamento) =>
    orcamento.pedido.num_orcamento.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="orcamentos-container">
      <WindowControls />
      <Navbar />

      <div className="content">
        <header className="top-row">
          <div className="title">
            <span className="building-icon"></span>
            <img src={logo} alt="Logo" className="logo" />
            <h1>LISTAGEM DE ORÇAMENTOS</h1>
          </div>
        </header>

        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Pesquisar por número do orçamento"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading && <p>Carregando orçamentos...</p>}
        {error && <p className="error-message">{error}</p>}

        {!loading && !error && (
          <table className="orcamentos-table">
            <thead>
              <tr>
                <th>N° Orçamento</th>
                <th>Data e Hora</th>
                <th>Cliente</th>
                <th>Valor Total</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrcamentos.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center" }}>
                    Nenhum orçamento encontrado
                  </td>
                </tr>
              ) : (
                filteredOrcamentos.map((orcamento) => (
                  <tr key={orcamento.pedido.id_orcamento}>
                    <td>{orcamento.pedido.num_orcamento}</td>
                    <td>{formatDate(orcamento.pedido.data_orcamento)}</td>
                    <td>{orcamento.pedido.nome_cliente}</td>
                    <td>{formatCurrency(orcamento.pedido.total_orcamento)}</td>
                    <td className="acoes">
                      <button 
                        className="btn-visualizar"
                        onClick={() => fetchOrcamentoDetails(orcamento.pedido.id_orcamento)}
                        disabled={loadingDetails}
                        title="Visualizar"
                      >
                        👁️
                      </button>
                      <button 
                        className="btn-faturar" 
                        onClick={() => faturarOrcamento(orcamento.pedido.id_orcamento, orcamento.pedido.num_orcamento)}
                        title="Faturar Orçamento"
                      >
                        💰
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {showModal && selectedOrcamento && (
        <VisualizaOrcamento orcamento={selectedOrcamento} onClose={closeModal} />
      )}
    </div>
  );
}

export default Orcamentos;