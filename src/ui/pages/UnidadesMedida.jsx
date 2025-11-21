import React, { useEffect, useState } from "react";
import "./UnidadesMedida.css";
import Navbar from "../components/Navbar";
import CadastrarUnidade from "../components/Cadastrar_unidade";
import WindowControls from "../components/WindowControls";

function UnidadesMedida() {
  const [unidades, setUnidades] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showCadastroModal, setShowCadastroModal] = useState(false);

  const fetchUnidades = async () => {
    const token = JSON.parse(localStorage.getItem("userData"))?.token;

    if (!token) {
      console.error("Token não encontrado no localStorage.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        "http://127.0.0.1:3000/unidades/visualizar",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (data.success && Array.isArray(data.values)) {
        setUnidades(data.values);
      } else {
        console.error("Formato inesperado:", data);
      }
    } catch (error) {
      console.error("Erro no fetch:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnidades();
  }, []);

  const handleSuccess = () => {
    setTimeout(() => {
      setShowCadastroModal(false);
      fetchUnidades();
    }, 1000);
  };

  const handleDelete = async (idUnidade) => {
    const token = JSON.parse(localStorage.getItem("userData"))?.token;

    if (!token) {
      console.error("Token não encontrado no localStorage.");
      return;
    }

    if (
      window.confirm("Tem certeza que deseja excluir esta unidade de medida?")
    ) {
      try {
        const response = await fetch(
          `http://127.0.0.1:3000/unidades/deletar/${idUnidade}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (
          response.headers.get("Content-Type")?.includes("application/json")
        ) {
          const data = await response.json();

          if (data.success) {
            alert("Unidade de medida excluída com sucesso!");
            fetchUnidades();
          } else {
            console.error("Erro ao excluir unidade de medida:", data.message);
            alert("Erro ao excluir unidade de medida.");
          }
        } else {
          const text = await response.text();
          console.error("Resposta inesperada da API:", text);
          alert("Erro inesperado ao excluir unidade de medida.");
        }
      } catch (error) {
        console.error("Erro no fetch:", error);
        alert("Erro ao excluir unidade de medida.");
      }
    }
  };

  const filteredUnidades = unidades.filter(
    (unidade) =>
      unidade.sigla.toLowerCase().includes(search.toLowerCase()) ||
      unidade.descricao.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="unidades-container">
      <WindowControls />
      <Navbar />

      <div className="content">
        <header className="top-row">
          <div className="title">
            <h1>LISTAGEM DE UNIDADES DE MEDIDA</h1>
          </div>

          <div className="right-actions">
            <button
              className="btn-cadastrar"
              onClick={() => setShowCadastroModal(true)}
            >
              Cadastrar
            </button>
          </div>
        </header>

        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="   Pesquisar unidade de medida"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <p style={{ textAlign: "center", marginTop: "20px" }}>
            Carregando unidades de medida...
          </p>
        ) : filteredUnidades.length === 0 ? (
          <p style={{ textAlign: "center", marginTop: "20px" }}>
            Nenhuma unidade de medida encontrada.
          </p>
        ) : (
          <table className="unidades-table">
            <thead>
              <tr>
                <th>Sigla</th>
                <th>Descrição</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredUnidades.map((unidade) => (
                <tr key={unidade.id_unidade_medida}>
                  <td>{unidade.sigla}</td>
                  <td>{unidade.descricao}</td>
                  <td>
                    <button
                      className="btn-excluir"
                      onClick={() => handleDelete(unidade.id_unidade_medida)}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showCadastroModal && (
        <CadastrarUnidade
          onClose={() => setShowCadastroModal(false)}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}

export default UnidadesMedida;
