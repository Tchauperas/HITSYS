import React, { useState } from "react";
import "./Cadastro_empresa.css"; // reaproveita o estilo do modal existente

function CadastrarPerfil({ onClose, onSuccess }) {
  const [descricao, setDescricao] = useState("");
  const [ativo, setAtivo] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const payload = { descricao, ativo: ativo ? 1 : 0 };
      const res = await fetch("http://127.0.0.1:3000/perf_usuarios/cadastrar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data && data.success) {
        setMessage("Perfil cadastrado com sucesso!");
        setDescricao("");
        setAtivo(true);
        if (onSuccess) {
          setTimeout(() => {
            onSuccess();
            onClose();
          }, 800);
        }
      } else {
        setMessage(data.message || "Erro ao cadastrar perfil");
      }
    } catch (err) {
      console.error(err);
      setMessage("Erro ao conectar com o servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h1>Cadastro de Perfil</h1>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <input
            type="text"
            name="descricao"
            placeholder="Descrição"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            required
          />

          <label>
            <input
              type="checkbox"
              name="ativo"
              className="checkbox"
              checked={ativo}
              onChange={(e) => setAtivo(e.target.checked)}
            />
            Perfil Ativo
          </label>

          <button type="submit" disabled={loading}>{loading ? "Cadastrando..." : "Cadastrar"}</button>
        </form>

        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
}

export default CadastrarPerfil;
