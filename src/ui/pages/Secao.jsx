import React, { useEffect, useState } from "react";
import "./Secao.css";
import Navbar from "../components/Navbar";
import CadastrarSecao from "../components/Cadastrar_secao";
import WindowControls from "../components/WindowControls";
import logo from "../assets/secoes_icon.png"; 

function Secao() {
  const [secoes, setSecoes] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showCadastroModal, setShowCadastroModal] = useState(false);

  const fetchSecoes = async () => {
    const token = JSON.parse(localStorage.getItem("userData"))?.token;

    if (!token) {
      console.error("Token não encontrado no localStorage.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        "http://127.0.0.1:3000/secoes/visualizar",
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
        setSecoes(data.values);
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
    fetchSecoes();
  }, []);

  const handleSuccess = () => {
    setTimeout(() => {
      setShowCadastroModal(false);
      fetchSecoes();
    }, 1000);
  };

  const handleDelete = async (idSecao) => {
    const token = JSON.parse(localStorage.getItem("userData"))?.token;

    if (!token) {
      console.error("Token não encontrado no localStorage.");
      return;
    }

    if (
      window.confirm("Tem certeza que deseja excluir esta seção?")
    ) {
      try {
        const response = await fetch(
          `http://127.0.0.1:3000/secoes/deletar/${idSecao}`,
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
            alert("Seção excluída com sucesso!");
            fetchSecoes();
          } else {
            console.error("Erro ao excluir seção:", data.message);
            alert("Erro ao excluir seção.");
          }
        } else {
          const text = await response.text();
          console.error("Resposta inesperada da API:", text);
          alert("Erro inesperado ao excluir seção.");
        }
      } catch (error) {
        console.error("Erro no fetch:", error);
        alert("Erro ao excluir seção.");
      }
    }
  };

  const filteredSecoes = secoes.filter(
    (secao) =>
      secao.descricao.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="secoes-container">
      <WindowControls />
      <Navbar />

      <div className="content">
        <header className="top-row">
          <div className="title">
            <span className="box-icon"></span> 
            <img src={logo} alt="Logo" className="logo" />
            <h1>LISTAGEM DE SEÇÕES</h1>
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
            placeholder="   Pesquisar seção"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <p style={{ textAlign: "center", marginTop: "20px" }}>
            Carregando seções...
          </p>
        ) : filteredSecoes.length === 0 ? (
          <p style={{ textAlign: "center", marginTop: "20px" }}>
            Nenhuma seção encontrada.
          </p>
        ) : (
          <table className="secoes-table">
            <thead>
              <tr>
                <th>Descrição</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredSecoes.map((secao) => (
                <tr key={secao.id_secao}>
                  <td>{secao.descricao}</td>
                  <td>
                    <button
                      className="btn-excluir"
                      onClick={() => handleDelete(secao.id_secao)}
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
        <CadastrarSecao
          onClose={() => setShowCadastroModal(false)}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}

export default Secao;
