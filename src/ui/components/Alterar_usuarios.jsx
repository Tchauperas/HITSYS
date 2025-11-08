import React, { useState, useEffect } from "react";
import "./Cadastro_empresa.css"; // Reutilizando o estilo do modal já existente

function AlterarUsuarios({ userId, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    nome: "",
    login: "",
    senha_hash: "",
    id_perfil_usuario: 1,
    ativo: true,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Carregar os dados do usuário ao abrir o modal
    const fetchUserData = async () => {
      const token = JSON.parse(localStorage.getItem("userData"))?.token;

      if (!token) {
        setMessage("Token não encontrado. Faça login novamente.");
        return;
      }

      try {
        const response = await fetch(`http://127.0.0.1:3000/usuarios/visualizar/${userId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (data.success) {
          setFormData({
            nome: data.values[0].nome, // Corrigido para acessar o primeiro objeto do array
            login: data.values[0].login,
            senha: "", // Senha não é retornada por segurança
            id_perfil_usuario: data.values[0].id_perfil_usuario,
            ativo: data.values[0].ativo === 1,
          });
        } else {
          setMessage(`Erro ao carregar dados do usuário: ${data.message}`);
        }
      } catch (error) {
        setMessage(`Erro ao conectar com o servidor: ${error.message}`);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const token = JSON.parse(localStorage.getItem("userData"))?.token;

    if (!token) {
      setMessage("Token não encontrado. Faça login novamente.");
      setLoading(false);
      return;
    }

    const payload = {
      ...formData,
      ativo: formData.ativo ? 1 : 0, // Convertendo boolean para número
    };

    console.log("Payload a ser enviado:", payload);

    try {
      const response = await fetch(
        `http://127.0.0.1:3000/usuarios/atualizar/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (data.success) {
        setMessage("Usuário atualizado com sucesso!");

        // Notifica o componente pai e fecha o modal após 2 segundos
        if (onSuccess) {
          setTimeout(() => {
            onSuccess();
            onClose();
          }, 2000);
        }
      } else {
        setMessage(`Erro ao atualizar usuário: ${data.message}`);
      }
    } catch (error) {
      setMessage(`Erro ao conectar com o servidor: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h1>Alterar Usuário</h1>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <input
            type="text"
            name="nome"
            placeholder="Nome"
            value={formData.nome}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="login"
            placeholder="Login"
            value={formData.login}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="senha"
            placeholder="Senha (deixe em branco para não alterar)"
            value={formData.senha}
            onChange={handleChange}
          />
          <select
            name="id_perfil_usuario"
            value={formData.id_perfil_usuario}
            onChange={handleChange}
            required
          >
            <option value={1}>Administrador</option>
            <option value={2}>Vendedor</option>
            <option value={3}>Usuário</option>
          </select>
          <label>
            <input
              type="checkbox"
              name="ativo"
              className="checkbox"
              checked={formData.ativo}
              onChange={(e) =>
                setFormData({ ...formData, ativo: e.target.checked })
              }
            />
            Usuário Ativo
          </label>
          <button type="submit" disabled={loading}>
            {loading ? "Atualizando..." : "Atualizar"}
          </button>
        </form>
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
}

export default AlterarUsuarios;