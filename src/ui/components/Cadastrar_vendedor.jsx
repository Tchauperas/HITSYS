import React, { useState, useEffect } from "react";
import "./Cadastrar_vendedor.css";

function CadastrarVendedor({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    id_usuario: "",
    id_pessoa: "",
    taxa_comissao: "",
    desconto_max: "",
    ativo: true,
  });

  const [usuarios, setUsuarios] = useState([]);
  const [pessoas, setPessoas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch Usuários on component mount
  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await fetch("http://127.0.0.1:3000/usuarios/visualizar");
        const data = await response.json();
        if (data.success) {
          setUsuarios(data.values);
        } else {
          setMessage("Erro ao carregar usuários.");
        }
      } catch (error) {
        setMessage(`Erro ao conectar com o servidor: ${error.message}`);
      }
    };

    fetchUsuarios();
  }, []);

  // Fetch Pessoas on component mount
  useEffect(() => {
    const fetchPessoas = async () => {
      try {
        const response = await fetch("http://127.0.0.1:3000/pessoas/visualizar");
        const data = await response.json();
        if (data.success) {
          setPessoas(data.values);
        } else {
          setMessage("Erro ao carregar pessoas.");
        }
      } catch (error) {
        setMessage(`Erro ao conectar com o servidor: ${error.message}`);
      }
    };

    fetchPessoas();
  }, []);

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

    // Preparar dados para envio
    const dataToSend = {
      id_usuario: parseInt(formData.id_usuario),
      id_pessoa: parseInt(formData.id_pessoa),
      taxa_comissao: parseFloat(formData.taxa_comissao),
      desconto_max: parseFloat(formData.desconto_max),
      ativo: formData.ativo ? 1 : 0,
    };

    try {
      const response = await fetch("http://127.0.0.1:3000/vendedores/vendedores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSend),
      });

      const data = await response.json();

      if (data.success) {
        setMessage("Vendedor cadastrado com sucesso!");
        setFormData({
          id_usuario: "",
          id_pessoa: "",
          taxa_comissao: "",
          desconto_max: "",
          ativo: true,
        });

        // Notifica o componente pai e fecha o modal após 2 segundos
        if (onSuccess) {
          setTimeout(() => {
            onSuccess();
            onClose();
          }, 2000);
        }
      } else {
        setMessage(`Erro ao cadastrar vendedor: ${data.message}`);
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
          <h1>Cadastro de Vendedor</h1>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <select
            name="id_usuario"
            value={formData.id_usuario}
            onChange={handleChange}
            required
          >
            <option value="">Selecione o Usuário</option>
            {usuarios.map((usuario) => (
              <option key={usuario.id_usuario} value={usuario.id_usuario}>
                {usuario.nome}
              </option>
            ))}
          </select>

          <select
            name="id_pessoa"
            value={formData.id_pessoa}
            onChange={handleChange}
            required
          >
            <option value="">Selecione a Pessoa</option>
            {pessoas.map((pessoa) => (
              <option key={pessoa.id_pessoa} value={pessoa.id_pessoa}>
                {pessoa.nome_razao_social}
              </option>
            ))}
          </select>

          <input
            type="number"
            name="taxa_comissao"
            placeholder="Taxa de Comissão (%)"
            value={formData.taxa_comissao}
            onChange={handleChange}
            step="0.01"
            min="0"
            max="100"
            required
          />

          <input
            type="number"
            name="desconto_max"
            placeholder="Desconto Máximo (%)"
            value={formData.desconto_max}
            onChange={handleChange}
            step="0.01"
            min="0"
            max="100"
            required
          />

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
            Vendedor Ativo
          </label>

          <button type="submit" disabled={loading}>
            {loading ? "Cadastrando..." : "Cadastrar"}
          </button>
        </form>
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
}

export default CadastrarVendedor;