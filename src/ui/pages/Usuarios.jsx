import React, { useState, useEffect } from "react";
import "./Usuarios.css";
import Navbar from "../components/Navbar";
import logo from "../assets/usuarios_icon.png";
import CadastrarUsuarios from "../components/Cadastrar_usuarios";
import AlterarUsuarios from "../components/Alterar_usuarios";
import WindowControls from "../components/WindowControls";

function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [perfis, setPerfis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCadastrarModal, setShowCadastrarModal] = useState(false);
  const [showAlterarModal, setShowAlterarModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    const fetchPerfis = async () => {
      const token = JSON.parse(localStorage.getItem("userData"))?.token;
      
      if (!token) {
        setError("Token não encontrado. Faça login novamente.");
        return;
      }

      try {
        const response = await fetch("http://127.0.0.1:3000/perf_usuarios/visualizar", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (data.success) {
          setPerfis(data.values);
        } else {
          setError("Erro ao carregar perfis de usuários");
        }
      } catch (error) {
        setError("Erro ao carregar perfis de usuários");
        console.error(error);
      }
    };

    fetchPerfis();
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      const token = JSON.parse(localStorage.getItem("userData"))?.token;
      
      if (!token) {
        setError("Token não encontrado. Faça login novamente.");
        return;
      }

      const response = await fetch("http://127.0.0.1:3000/usuarios/visualizar", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setUsuarios(data.values);
      } else {
        setError("Erro ao carregar usuários");
      }
    } catch (err) {
      setError("Erro ao conectar com o servidor");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteUsuario = async (idUsuario) => {
    const confirmDelete = window.confirm("Tem certeza que deseja excluir este usuário?");
    if (!confirmDelete) return;

    const token = JSON.parse(localStorage.getItem("userData"))?.token;

    if (!token) {
      alert("Token não encontrado. Faça login novamente.");
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:3000/usuarios/excluir/${idUsuario}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        alert("Usuário excluído com sucesso!");
        fetchUsuarios(); // Atualiza a lista após exclusão
      } else {
        alert(`Erro ao excluir usuário: ${data.message}`);
      }
    } catch (error) {
      alert(`Erro ao conectar com o servidor: ${error.message}`);
    }
  };

  const getPerfilNome = (idPerfil) => {
    if (!perfis || perfis.length === 0) return "Não definido";
    // Alguns endpoints retornam o id como 'id_perfil_usuario' no banco
    const perfil = perfis.find((p) => {
      const pid = p.id_perfil_usuario ?? p.id ?? p.id_perfil;
      return String(pid) === String(idPerfil);
    });
    return perfil ? perfil.descricao || perfil.nome || perfil.label || "Não definido" : "Não definido";
  };

  const filteredUsuarios = usuarios.filter(
    (usuario) =>
      usuario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.login.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="usuarios-container">
      <WindowControls />
      <Navbar />

      <div className="content">
        <header className="top-row">
          <div className="title">
            <span className="box-icon"></span>
            <img src={logo} alt="Logo" className="logo" />
            <h1>LISTAGEM DE USUÁRIOS</h1>
          </div>

          <div className="right-actions">
            <button
              className="btn-cadastrar"
              onClick={() => setShowCadastrarModal(true)}
            >
              Cadastrar
            </button>
            {showCadastrarModal && (
              <CadastrarUsuarios
                onClose={() => setShowCadastrarModal(false)}
                onSuccess={() => fetchUsuarios()}
              />
            )}
          </div>
        </header>

        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="   Buscar usuário"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading && (
          <p style={{ textAlign: "center", padding: "20px" }}>Carregando...</p>
        )}
        {error && (
          <p
            style={{
              textAlign: "center",
              padding: "20px",
              color: "red",
            }}
          >
            {error}
          </p>
        )}

        <table className="usuarios-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Perfil</th>
              <th style={{ textAlign: "center", width: 140 }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {!loading &&
              !error &&
              filteredUsuarios.map((usuario) => (
                <tr key={usuario.id_usuario}>
                  <td>{usuario.nome}</td>
                  <td>{getPerfilNome(usuario.id_perfil_usuario)}</td>
                  <td className="acoes">
                    <button
                      className="btn-editar"
                      onClick={() => {
                        setSelectedUserId(usuario.id_usuario);
                        setShowAlterarModal(true);
                      }}
                      title="Editar"
                    >
                      ✏️
                    </button>
                    <button
                      className="btn-excluir"
                      onClick={() => deleteUsuario(usuario.id_usuario)}
                      title="Excluir"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            {!loading && !error && filteredUsuarios.length === 0 && (
              <tr>
                <td colSpan="3" style={{ textAlign: "center", padding: "20px" }}>
                  Nenhum usuário encontrado
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showAlterarModal && (
        <AlterarUsuarios
          userId={selectedUserId}
          onClose={() => setShowAlterarModal(false)}
          onSuccess={() => {
            fetchUsuarios();
            setShowAlterarModal(false);
          }}
        />
      )}
    </div>
  );
}

export default Usuarios;
