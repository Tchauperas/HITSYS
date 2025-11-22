import React, { useState, useEffect } from "react";
import "./Cidades.css";
import Navbar from "../components/Navbar";
import WindowControls from "../components/WindowControls";
import CadastrarCidade from "../components/Cadastrar_cidade";
import AlterarCidade from "../components/Alterar_cidade";

function Cidades() {
  const [cidades, setCidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCidade, setSelectedCidade] = useState(null);

  useEffect(() => {
    fetchCidades();
  }, []);

  const fetchCidades = async () => {
    const token = JSON.parse(localStorage.getItem("userData"))?.token;

    if (!token) {
      console.error("Token não encontrado no localStorage.");
      setError("Token de autenticação não encontrado.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("http://127.0.0.1:3000/cidades/cidades", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (data.success) {
        setCidades(data.values);
      } else {
        setError("Erro ao carregar cidades");
      }
    } catch (err) {
      setError("Erro ao conectar com o servidor");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCidades = cidades.filter((cidade) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      cidade.cidade?.toLowerCase().includes(searchLower) ||
      cidade.ibge?.includes(searchTerm)
    );
  });

  const handleEdit = (cidade) => {
    setSelectedCidade(cidade);
    setShowEditModal(true);
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedCidade(null);
  };

  const handleSuccess = () => {
    fetchCidades();
  };

  const handleUpdate = () => {
    fetchCidades();
  };

  const handleDelete = async (id) => {
    const token = JSON.parse(localStorage.getItem("userData"))?.token;

    if (!token) {
      alert("Token de autenticação não encontrado.");
      return;
    }

    if (window.confirm("Deseja realmente deletar esta cidade?")) {
      try {
        const response = await fetch(
          `http://127.0.0.1:3000/cidades/cidades/${id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          alert("Cidade deletada com sucesso!");
          fetchCidades();
        } else {
          const data = await response.json();
          alert(data.message || "Erro ao deletar cidade");
        }
      } catch (err) {
        alert("Erro ao conectar com o servidor");
        console.error(err);
      }
    }
  };

  return (
    <div className="cidades-container">
      <WindowControls />
      <Navbar />

      <div className="content">
        <header className="top-row">
          <div className="title">
            <h1>LISTAGEM DE CIDADES</h1>
          </div>

          <div className="right-actions">
            <button className="btn-cadastrar" onClick={handleOpenModal}>
              Cadastrar
            </button>
          </div>
        </header>

        <div className="search-bar">
          <input
            type="text"
            placeholder="     Pesquisar cidade"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="search-icon">🔍</span>
        </div>

        {loading && <p>Carregando...</p>}
        {error && <p className="error-message">{error}</p>}

        {!loading && !error && (
          <table className="cidades-table">
            <thead>
              <tr>
                <th>Cidade</th>
                <th>UF</th>
                <th>IBGE</th>
                <th style={{ textAlign: "center", width: 140 }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredCidades.length > 0 ? (
                filteredCidades.map((cidade) => (
                  <tr key={cidade.id_cidade}>
                    <td>{cidade.cidade}</td>
                    <td>{cidade.uf}</td>
                    <td>{cidade.ibge}</td>
                    <td className="acoes">
                      <button
                        className="btn-editar"
                        onClick={() => handleEdit(cidade)}
                        title="Editar"
                      >
                        ✏️
                      </button>
                      <button
                        className="btn-excluir"
                        onClick={() => handleDelete(cidade.id_cidade)}
                        title="Excluir"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center" }}>
                    Nenhuma cidade encontrada
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <CadastrarCidade onClose={handleCloseModal} onSuccess={handleSuccess} />
      )}

      {showEditModal && selectedCidade && (
        <AlterarCidade
          isOpen={showEditModal}
          onClose={handleCloseEditModal}
          cidade={selectedCidade}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
}

export default Cidades;