import React, { useState, useEffect } from "react";
import "./Cadastro_empresa.css";

function AlterarPerfil({ perfil, onClose, onSuccess }) {
  const [descricao, setDescricao] = useState(perfil?.descricao || "");
  const [ativo, setAtivo] = useState(perfil?.ativo === 0 ? false : true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setDescricao(perfil?.descricao || "");
    setAtivo(perfil?.ativo === 0 ? false : true);
  }, [perfil]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    const id = perfil.id_perfil_usuario || perfil.id;
    try {
      const res = await fetch(`http://127.0.0.1:3000/perf_usuarios/alterar/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ descricao, ativo: ativo ? 1 : 0 }),
      });
      const data = await res.json();
      if (data && data.success) {
        setMessage("Perfil atualizado com sucesso!");
        if (onSuccess) {
          setTimeout(() => {
            onSuccess();
            onClose();
          }, 700);
        }
      } else {
        setMessage(data.message || "Erro ao atualizar perfil");
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
          <h1>Alterar Perfil</h1>
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

          <button type="submit" disabled={loading}>{loading ? "Salvando..." : "Salvar"}</button>
        </form>

        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
}

export default AlterarPerfil;
