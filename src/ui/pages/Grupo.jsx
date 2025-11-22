import React, { useEffect, useState } from "react";
import "./Grupo.css";
import Navbar from "../components/Navbar";
import CadastrarGrupo from "../components/Cadastrar_grupo";
import WindowControls from "../components/WindowControls";

function Grupo() {
  const [grupos, setGrupos] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showCadastroModal, setShowCadastroModal] = useState(false);

  const fetchGrupos = async () => {
    const token = JSON.parse(localStorage.getItem("userData"))?.token;

    if (!token) {
      console.error("Token não encontrado no localStorage.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        "http://127.0.0.1:3000/grupos/visualizar",
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
        setGrupos(data.values);
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
    fetchGrupos();
  }, []);

  const handleSuccess = () => {
    setTimeout(() => {
      setShowCadastroModal(false);
      fetchGrupos();
    }, 1000);
  };

  const handleDelete = async (idGrupo) => {
    const token = JSON.parse(localStorage.getItem("userData"))?.token;

    if (!token) {
      console.error("Token não encontrado no localStorage.");
      return;
    }

    if (
      window.confirm("Tem certeza que deseja excluir este grupo?")
    ) {
      try {
        const response = await fetch(
          `http://127.0.0.1:3000/grupos/deletar/${idGrupo}`,
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
            alert("Grupo excluído com sucesso!");
            fetchGrupos();
          } else {
            console.error("Erro ao excluir grupo:", data.message);
            alert("Erro ao excluir grupo.");
          }
        } else {
          const text = await response.text();
          console.error("Resposta inesperada da API:", text);
          alert("Erro inesperado ao excluir grupo.");
        }
      } catch (error) {
        console.error("Erro no fetch:", error);
        alert("Erro ao excluir grupo.");
      }
    }
  };

  const filteredGrupos = grupos.filter(
    (grupo) =>
      grupo.descricao.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="grupos-container">
      <WindowControls />
      <Navbar />

      <div className="content">
        <header className="top-row">
          <div className="title">
            <h1>LISTAGEM DE GRUPOS</h1>
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
            placeholder="   Pesquisar grupo"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <p style={{ textAlign: "center", marginTop: "20px" }}>
            Carregando grupos...
          </p>
        ) : filteredGrupos.length === 0 ? (
          <p style={{ textAlign: "center", marginTop: "20px" }}>
            Nenhum grupo encontrado.
          </p>
        ) : (
          <table className="grupos-table">
            <thead>
              <tr>
                <th>Descrição</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredGrupos.map((grupo) => (
                <tr key={grupo.id_grupo}>
                  <td>{grupo.descricao}</td>
                  <td>
                    <button
                      className="btn-excluir"
                      onClick={() => handleDelete(grupo.id_grupo)}
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
        <CadastrarGrupo
          onClose={() => setShowCadastroModal(false)}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}

export default Grupo;
