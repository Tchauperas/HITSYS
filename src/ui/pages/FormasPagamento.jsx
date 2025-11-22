import React, { useState, useEffect } from "react";
import "./FormasPagamento.css";
import Navbar from "../components/Navbar";
import WindowControls from "../components/WindowControls";
import CadastroFormaPagamento from "../components/Cadastro_FormaPagamento";
import AlterarFormaPagamento from "../components/Alterar_FormaPagamento";
import logo from "../assets/forma_pagamento_icon.png";

function FormasPagamento() {
  const [formas, setFormas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedForma, setSelectedForma] = useState(null);

  useEffect(() => {
    fetchFormas();
  }, []);

  const fetchFormas = async () => {
    const token = JSON.parse(localStorage.getItem("userData"))?.token;

    if (!token) {
      setError("Token de autenticação não encontrado.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("http://localhost:3000/formas-pagamento/visualizar", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (data.success) {
        setFormas(data.values);
      } else {
        setError("Erro ao carregar formas de pagamento");
      }
    } catch (err) {
      setError("Erro ao conectar com o servidor");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredFormas = formas.filter((forma) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      forma.descricao?.toLowerCase().includes(searchLower) ||
      forma.tipo?.toLowerCase().includes(searchLower)
    );
  });

  const handleDelete = async (id) => {
    const token = JSON.parse(localStorage.getItem("userData"))?.token;

    if (!token) {
      alert("Token de autenticação não encontrado.");
      return;
    }

    if (window.confirm("Deseja realmente deletar esta forma de pagamento?")) {
      try {
        const response = await fetch(
          `http://localhost:3000/formas-pagamento/deletar/${id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          alert("Forma de pagamento deletada com sucesso!");
          fetchFormas();
        } else {
          const data = await response.json();
          alert(data.message || "Erro ao deletar forma de pagamento");
        }
      } catch (err) {
        alert("Erro ao conectar com o servidor");
        console.error(err);
      }
    }
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleOpenEditModal = (forma) => {
    setSelectedForma(forma);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedForma(null);
  };

  const handleSuccess = () => {
    fetchFormas();
  };

  return (
    <div className="formas-pagamento-container">
      <WindowControls />
      <Navbar />

      <div className="content">
        <div className="top-row">
          <div className="title">
            <img src={logo} alt="Logo" className="logo" />
            <h1>LISTAGEM DE FORMAS DE PAGAMENTO</h1>
          </div>

          <div className="right-actions">
            <button className="btn-cadastrar" onClick={handleOpenModal}>
              Cadastrar
            </button>
          </div>
        </div>

        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Pesquisar forma de pagamento..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading && <p>Carregando...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {!loading && !error && (
          <table className="formas-table">
            <thead>
              <tr>
                <th>Descrição</th>
                <th>Tipo</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredFormas.length > 0 ? (
                filteredFormas.map((forma) => (
                  <tr key={forma.id_forma_pagamento}>
                    <td>{forma.descricao}</td>
                    <td>{forma.tipo}</td>
                    <td className="acoes">
                      <button 
                        className="btn-editar" 
                        onClick={() => handleOpenEditModal(forma)}
                        title="Editar"
                      >
                        ✏️
                      </button>
                      <button
                        className="btn-excluir"
                        onClick={() => handleDelete(forma.id_forma_pagamento)}
                        title="Excluir"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center" }}>
                    Nenhuma forma de pagamento encontrada
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <CadastroFormaPagamento onClose={handleCloseModal} onSuccess={handleSuccess} />
      )}

      {showEditModal && selectedForma && (
        <AlterarFormaPagamento
          isOpen={showEditModal}
          onClose={handleCloseEditModal}
          forma={selectedForma}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}

export default FormasPagamento;