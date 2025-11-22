import React, { useState, useEffect } from "react";
import "./Cadastrar_cidade.css";

function CadastrarCidade({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    cidade: "",
    id_uf: "",
    ibge: "",
  });

  const [ufs, setUfs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  useEffect(() => {
    fetchUfs();
  }, []);

  const fetchUfs = async () => {
    try {
      const response = await fetch("http://127.0.0.1:3000/estados/estados");
      const data = await response.json();
      if (data.success) {
        setUfs(data.values);
      } else {
        setMessageType("error");
        setMessage("Erro ao carregar UFs.");
      }
    } catch (error) {
      setMessageType("error");
      setMessage(`Erro ao conectar com o servidor: ${error.message}`);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Validações
    if (!formData.cidade || !formData.id_uf || !formData.ibge) {
      setMessageType("error");
      setMessage("Preencha todos os campos obrigatórios.");
      setLoading(false);
      return;
    }

    const token = JSON.parse(localStorage.getItem("userData"))?.token;

    if (!token) {
      setMessageType("error");
      setMessage("Token de autenticação não encontrado.");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        cidade,
        id_uf,
        ibge,
      };
      console.log(payload);
      const response = await fetch("http://127.0.0.1:3000/cidades/cidades", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          cidade: formData.cidade,
          id_uf: Number(formData.id_uf),
          ibge: formData.ibge,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessageType("success");
        setMessage("Cidade cadastrada com sucesso!");
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1500);
      } else {
        setMessageType("error");
        setMessage(data.message || "Erro ao cadastrar cidade.");
      }
    } catch (error) {
      setMessageType("error");
      setMessage(`Erro ao conectar com o servidor: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h1>Cadastrar Cidade</h1>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="cidade">Cidade *</label>
            <input
              type="text"
              id="cidade"
              name="cidade"
              value={formData.cidade}
              onChange={handleChange}
              placeholder="Digite o nome da cidade"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="id_uf">UF *</label>
            <select
              id="id_uf"
              name="id_uf"
              value={formData.id_uf}
              onChange={handleChange}
              required
            >
              <option value="">Selecione o estado</option>
              {ufs.map((uf) => (
                <option key={uf.id_uf} value={uf.id_estado}>
                  {uf.uf} - {uf.estado}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="ibge">Código IBGE *</label>
            <input
              type="text"
              id="ibge"
              name="ibge"
              value={formData.ibge}
              onChange={handleChange}
              placeholder="Digite o código IBGE"
              maxLength="7"
              required
            />
          </div>

          {message && <div className={`message ${messageType}`}>{message}</div>}

          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? "Cadastrando..." : "Cadastrar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CadastrarCidade;
