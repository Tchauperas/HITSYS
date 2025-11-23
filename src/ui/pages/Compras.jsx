import React, { useState, useEffect } from "react";
import "./Compras.css";
import Navbar from "../components/Navbar";
import VisualizaCompra from "../components/Visualiza_compra";
import LancarCompra from "../components/Lancar_compra";
import logo from "../assets/compras_icon.png";
import WindowControls from "../components/WindowControls";

function Compras() {
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedCompra, setSelectedCompra] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [showLancarModal, setShowLancarModal] = useState(false);

  useEffect(() => {
    fetchCompras();
  }, []);

  const fetchCompras = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://127.0.0.1:3000/compras/visualizar");
      const data = await response.json();

      if (data.success) {
        setCompras(data.compras);
      } else {
        setError("Erro ao carregar compras");
      }
    } catch (err) {
      setError("Erro ao conectar com o servidor");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCompraDetails = async (id) => {
    try {
      setLoadingDetails(true);
      const response = await fetch(`http://127.0.0.1:3000/compras/visualizar/${id}`);
      const data = await response.json();

      if (data.success) {
        setSelectedCompra({
          pedido: data.pedido,
          itens: data.itens
        });
        setShowModal(true);
      } else {
        alert("Erro ao carregar detalhes da compra");
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
    setSelectedCompra(null);
  };

  const openLancarModal = () => {
    setShowLancarModal(true);
  };

  const closeLancarModal = () => {
    setShowLancarModal(false);
  };

  const handleCompraSuccess = () => {
    fetchCompras();
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

  const filteredCompras = compras.filter((compra) =>
    compra.pedido.num_compra.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="compras-container">
      <WindowControls />
      <Navbar />

      <div className="content">
        <header className="top-row">
          <div className="title">
            <span className="building-icon"></span>
            <img src={logo} alt="Logo" className="logo" />
            <h1>LISTAGEM DE COMPRAS</h1>
          </div>

          <div className="right-actions">
            <button
              className="btn-cadastrar"
              onClick={openLancarModal}
            >
              Lançar Compra
            </button>
          </div>
        </header>

        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Pesquisar por número da compra"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading && <p>Carregando compras...</p>}
        {error && <p className="error-message">{error}</p>}

        {!loading && !error && (
          <table className="compras-table">
            <thead>
              <tr>
                <th>N° Compra</th>
                <th>Data e Hora</th>
                <th>Fornecedor</th>
                <th>Valor Total</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredCompras.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center" }}>
                    Nenhuma compra encontrada
                  </td>
                </tr>
              ) : (
                filteredCompras.map((compra) => (
                  <tr key={compra.pedido.id_compra}>
                    <td>{compra.pedido.num_compra}</td>
                    <td>{formatDate(compra.pedido.data_compra)}</td>
                    <td>{compra.pedido.nome_fornecedor}</td>
                    <td>{formatCurrency(compra.pedido.total_compra)}</td>
                    <td className="acoes">
                      <button 
                        className="btn-visualizar"
                        onClick={() => fetchCompraDetails(compra.pedido.id_compra)}
                        disabled={loadingDetails}
                        title="Visualizar"
                      >
                        👁️
                      </button>
                      <button className="btn-editar" title="Editar">
                        ✏️
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {showModal && selectedCompra && (
        <VisualizaCompra compra={selectedCompra} onClose={closeModal} />
      )}

      {showLancarModal && (
        <LancarCompra onClose={closeLancarModal} onSuccess={handleCompraSuccess} />
      )}
    </div>
  );
}

export default Compras;
