import React, { useEffect, useState } from "react";
import "./Marcas.css";
import Navbar from "../components/Navbar";
import CadastrarMarca from "../components/Cadastrar_marca";
import WindowControls from "../components/WindowControls";
import logo from "../assets/marcas_icon.png"

function Marcas() {
  const [marcas, setMarcas] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showCadastroModal, setShowCadastroModal] = useState(false);

  const fetchMarcas = async () => {
    const token = JSON.parse(localStorage.getItem("userData"))?.token;

    if (!token) {
      console.error("Token não encontrado no localStorage.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        "http://127.0.0.1:3000/marcas/visualizar",
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
        setMarcas(data.values);
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
    fetchMarcas();
  }, []);

  const handleSuccess = () => {
    setTimeout(() => {
      setShowCadastroModal(false);
      fetchMarcas();
    }, 1000);
  };

  const handleDelete = async (idMarca) => {
    const token = JSON.parse(localStorage.getItem("userData"))?.token;

    if (!token) {
      console.error("Token não encontrado no localStorage.");
      return;
    }

    if (
      window.confirm("Tem certeza que deseja excluir esta marca?")
    ) {
      try {
        const response = await fetch(
          `http://127.0.0.1:3000/marcas/deletar/${idMarca}`,
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
            alert("Marca excluída com sucesso!");
            fetchMarcas();
          } else {
            console.error("Erro ao excluir marca:", data.message);
            alert("Erro ao excluir marca.");
          }
        } else {
          const text = await response.text();
          console.error("Resposta inesperada da API:", text);
          alert("Erro inesperado ao excluir marca.");
        }
      } catch (error) {
        console.error("Erro no fetch:", error);
        alert("Erro ao excluir marca.");
      }
    }
  };

  const filteredMarcas = marcas.filter(
    (marca) =>
      marca.descricao.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="marcas-container">
      <WindowControls />
      <Navbar />

      <div className="content">
        <header className="top-row">
          <div className="title">
              <span className="box-icon"></span>
              <img src={logo} alt="Logo" className="logo" />
              <h1>LISTAGEM DE MARCAS</h1>
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
            placeholder="   Pesquisar marca"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <p style={{ textAlign: "center", marginTop: "20px" }}>
            Carregando marcas...
          </p>
        ) : filteredMarcas.length === 0 ? (
          <p style={{ textAlign: "center", marginTop: "20px" }}>
            Nenhuma marca encontrada.
          </p>
        ) : (
          <table className="marcas-table">
            <thead>
              <tr>
                <th>Descrição</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredMarcas.map((marca) => (
                <tr key={marca.id_marca}>
                  <td>{marca.descricao}</td>
                  <td>
                    <button
                      className="btn-excluir"
                      onClick={() => handleDelete(marca.id_marca)}
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
        <CadastrarMarca
          onClose={() => setShowCadastroModal(false)}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}

export default Marcas;
