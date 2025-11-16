import React, { useState, useEffect } from "react";
import "./Perf_usuarios.css";
import Navbar from "../components/Navbar";
import logo from "../assets/perfis_icon.png";
import CadastrarPerfil from "../components/Cadastrar_perfil";
import AlterarPerfil from "../components/Alterar_perfil";
import PermissoesModal from "../components/PermissoesModal";
import WindowControls from "../components/WindowControls"
function Perf_usuarios() {
  const [perfis, setPerfis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchPerfis();
  }, []);

  const fetchPerfis = async () => {
    const token = JSON.parse(localStorage.getItem("userData"))?.token;

    if (!token) {
      console.error("Token não encontrado no localStorage.");
      setError("Token de autenticação não encontrado.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("http://127.0.0.1:3000/perf_usuarios/visualizar", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      // espera-se que a API retorne { success: true, values: [...] } ou um array
      if (data && data.success && Array.isArray(data.values)) {
        setPerfis(data.values);
      } else if (Array.isArray(data)) {
        setPerfis(data);
      } else {
        // fallback se formato inesperado
        setPerfis([
          { id_perfil_usuario: 1, descricao: "Administrador" },
          { id_perfil_usuario: 2, descricao: "Vendedor" },
          { id_perfil_usuario: 3, descricao: "Caixa" },
        ]);
      }
    } catch (err) {
      console.error("Erro ao buscar perfis:", err);
      setError("Erro ao conectar com o servidor. Lista de perfis de exemplo carregada.");
      setPerfis([
        { id_perfil_usuario: 1, descricao: "Administrador" },
        { id_perfil_usuario: 2, descricao: "Vendedor" },
        { id_perfil_usuario: 3, descricao: "Caixa" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const deletePerfil = async (id) => {
    const token = JSON.parse(localStorage.getItem("userData"))?.token;

    if (!token) {
      console.error("Token não encontrado no localStorage.");
      alert("Token de autenticação não encontrado.");
      return;
    }

    const ok = window.confirm("Deseja excluir este perfil?");
    if (!ok) return;

    try {
      const res = await fetch(`http://127.0.0.1:3000/perf_usuarios/excluir/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data && data.success) {
        alert("Perfil excluído");
        fetchPerfis();
      } else {
        // fallback local
        setPerfis((prev) => prev.filter((p) => (p.id_perfil_usuario || p.id) !== id));
      }
    } catch (err) {
      console.error(err);
      // simulamos remoção localmente
      setPerfis((prev) => prev.filter((p) => (p.id_perfil_usuario || p.id) !== id));
    }
  };

  const cadastrarPerfil = async () => {
    // abre modal de cadastro (componente CadastrarPerfil cuidará do POST)
    setShowCadastrarModal(true);
  };

  // modal de alterar
  const [showAlterarModal, setShowAlterarModal] = useState(false);
  const [selectedPerfil, setSelectedPerfil] = useState(null);

  const openAlterarModal = (perfil) => {
    setSelectedPerfil(perfil);
    setShowAlterarModal(true);
  };

  const filtered = perfis.filter((p) => (p.descricao || "").toLowerCase().includes(searchTerm.toLowerCase()));

  const [showCadastrarModal, setShowCadastrarModal] = useState(false);
  const [showPermissoesModal, setShowPermissoesModal] = useState(false);
  const [selectedPerfilPerms, setSelectedPerfilPerms] = useState(null);
  
  // abrir modal/rota de permissões (placeholder)
  const openPermissoes = (perfil) => {
    setSelectedPerfilPerms(perfil);
    setShowPermissoesModal(true);
  };

  return (
    <div className="perf-container">
      <WindowControls />
      <Navbar />

      <div className="content">
        <header className="top-row">
          <div className="title">
            <span className="box-icon"></span>
            <img src={logo} alt="Logo" className="logo" />
            <h1>Listagem de Perfis de Usuários</h1>
          </div>

          <div className="right-actions">
            <button className="btn-cadastrar" onClick={cadastrarPerfil}>Cadastrar</button>
          </div>
        </header>

        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input type="text" placeholder="   Buscar perfil" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>

        {loading && <p style={{ textAlign: "center", padding: 20 }}>Carregando...</p>}
        {error && <p style={{ textAlign: "center", padding: 20, color: "#c00" }}>{error}</p>}

        <table className="perf-table">
          <thead>
            <tr>
              <th>Descrição</th>
              <th style={{ textAlign: "center", width: 180 }}>Permissões</th>
              <th style={{ textAlign: "center", width: 140 }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan="2" style={{ textAlign: "center", padding: 20 }}>Nenhum perfil encontrado</td>
              </tr>
            )}

            {!loading && filtered.map((perfil) => (
              <tr key={perfil.id_perfil_usuario || perfil.id}>
                <td>{perfil.descricao}</td>
                <td style={{ textAlign: "center" }}>
                  <button className="btn-perms" onClick={() => openPermissoes(perfil)} title="Gerenciar permissões">⚙️</button>
                </td>
                <td className="acoes">
                  <button className="btn-editar" onClick={() => openAlterarModal(perfil)}>✏️</button>
                  <button className="btn-excluir" onClick={() => deletePerfil(perfil.id_perfil_usuario || perfil.id)}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showCadastrarModal && (
        <CadastrarPerfil
          onClose={() => setShowCadastrarModal(false)}
          onSuccess={() => {
            fetchPerfis();
            setShowCadastrarModal(false);
          }}
        />
      )}
      {showAlterarModal && selectedPerfil && (
        <AlterarPerfil
          perfil={selectedPerfil}
          onClose={() => setShowAlterarModal(false)}
          onSuccess={() => {
            fetchPerfis();
            setShowAlterarModal(false);
          }}
        />
      )}
      {showPermissoesModal && selectedPerfilPerms && (
        <PermissoesModal
          perfil={selectedPerfilPerms}
          onClose={() => setShowPermissoesModal(false)}
          onSuccess={() => {
            fetchPerfis();
            setShowPermissoesModal(false);
          }}
        />
      )}
    </div>
  );
}

export default Perf_usuarios;
