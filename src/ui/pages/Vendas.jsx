import React, { useState, useEffect } from "react";
import "./Vendas.css";
import Navbar from "../components/Navbar";
import VisualizaVenda from "../components/Visualiza_venda";
import logo from "../assets/vendas_icon.png";
import WindowControls from "../components/WindowControls";

function Vendas() {
  const [vendas, setVendas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedVenda, setSelectedVenda] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    fetchVendas();
  }, []);

  const fetchVendas = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://127.0.0.1:3000/vendas/visualizar");
      const data = await response.json();

      if (data.success) {
        setVendas(data.vendas);
      } else {
        setError("Erro ao carregar vendas");
      }
    } catch (err) {
      setError("Erro ao conectar com o servidor");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchVendaDetails = async (id) => {
    try {
      setLoadingDetails(true);
      const response = await fetch(`http://127.0.0.1:3000/vendas/visualizar/${id}`);
      const data = await response.json();

      if (data.success) {
        setSelectedVenda({
          pedido: data.pedido,
          itens: data.itens
        });
        setShowModal(true);
      } else {
        alert("Erro ao carregar detalhes da venda");
      }
    } catch (err) {
      alert("Erro ao conectar com o servidor");
      console.error(err);
    } finally {
      setLoadingDetails(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedVenda(null);
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

  const filteredVendas = vendas.filter((venda) =>
    venda.pedido.num_venda.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="vendas-container">
      <WindowControls />
      <Navbar />

      <div className="content">
        <header className="top-row">
          <div className="title">
            <span className="building-icon"></span>
            <img src={logo} alt="Logo" className="logo" />
            <h1>LISTAGEM DE VENDAS</h1>
          </div>
        </header>

        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="   Pesquisar por número da venda"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading && <p>Carregando vendas...</p>}
        {error && <p className="error-message">{error}</p>}

        {!loading && !error && (
          <table className="vendas-table">
            <thead>
              <tr>
                <th>N° Venda</th>
                <th>Data e Hora</th>
                <th>Cliente</th>
                <th>Valor Total</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredVendas.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center" }}>
                    Nenhuma venda encontrada
                  </td>
                </tr>
              ) : (
                filteredVendas.map((venda) => (
                  <tr key={venda.pedido.id_venda}>
                    <td>{venda.pedido.num_venda}</td>
                    <td>{formatDate(venda.pedido.data_venda)}</td>
                    <td>{venda.pedido.nome_cliente}</td>
                    <td>{formatCurrency(venda.pedido.total_venda)}</td>
                    <td>
                      <button 
                        className="btn-visualizar"
                        onClick={() => fetchVendaDetails(venda.pedido.id_venda)}
                        disabled={loadingDetails}
                      >
                        👁️ Ver
                      </button>
                      <button className="btn-editar">✏️ Editar</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {showModal && selectedVenda && (
        <VisualizaVenda venda={selectedVenda} onClose={closeModal} />
      )}
    </div>
  );
}

export default Vendas;
