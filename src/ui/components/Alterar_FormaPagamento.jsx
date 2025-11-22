import React, { useState, useEffect } from "react";
import "./Modal.css";

function AlterarFormaPagamento({ isOpen, onClose, forma, onSuccess }) {
  const [formData, setFormData] = useState({
    descricao: "",
    a_prazo: 2,
    num_parcelas: "",
    dia_vencimento: "",
    periodo_dias: "",
    ativa: 1,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  useEffect(() => {
    if (forma) {
      setFormData({
        descricao: forma.descricao || "",
        a_prazo: forma.a_prazo || 2,
        num_parcelas: forma.num_parcelas || "",
        dia_vencimento: forma.dia_vencimento || "",
        periodo_dias: forma.periodo_dias || "",
        ativa: forma.ativa || 1,
      });
    }
  }, [forma, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const token = JSON.parse(localStorage.getItem("userData"))?.token;

    if (!token) {
      setMessageType("error");
      setMessage("Token de autenticação não encontrado.");
      setLoading(false);
      return;
    }

    if (!formData.descricao.trim()) {
      setMessageType("error");
      setMessage("Descrição é obrigatória.");
      setLoading(false);
      return;
    }

    // Se for A Prazo (1), validar campos adicionais
    if (formData.a_prazo === 1 || formData.a_prazo === "1") {
      if (!formData.num_parcelas || formData.num_parcelas === "") {
        setMessageType("error");
        setMessage("Número de parcelas é obrigatório para A Prazo.");
        setLoading(false);
        return;
      }
      if (!formData.dia_vencimento || formData.dia_vencimento === "") {
        setMessageType("error");
        setMessage("Dia de vencimento é obrigatório para A Prazo.");
        setLoading(false);
        return;
      }
      if (!formData.periodo_dias || formData.periodo_dias === "") {
        setMessageType("error");
        setMessage("Período em dias é obrigatório para A Prazo.");
        setLoading(false);
        return;
      }
    }

    // Preparar dados para enviar
    const dataToSend = { ...formData };
    
    // Se for À Vista (2), enviar campos opcionais como null
    if (formData.a_prazo === 2 || formData.a_prazo === "2") {
      dataToSend.num_parcelas = null;
      dataToSend.dia_vencimento = null;
      dataToSend.periodo_dias = null;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/formas-pagamento/alterar/${forma.id_forma_pagamento}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(dataToSend),
        }
      );

      const data = await response.json();

      if (data.success) {
        setMessageType("success");
        setMessage("Forma de pagamento atualizada com sucesso!");
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1500);
      } else {
        setMessageType("error");
        setMessage(data.message || "Erro ao atualizar forma de pagamento");
      }
    } catch (err) {
      setMessageType("error");
      setMessage(`Erro ao conectar com o servidor: ${err.message}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Editar Forma de Pagamento</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Descrição *</label>
            <input
              type="text"
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
              placeholder="Ex: Dinheiro, Cartão de Crédito, Cheque..."
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Tipo *</label>
              <select
                name="a_prazo"
                value={formData.a_prazo}
                onChange={handleChange}
              >
                <option value={2}>À Vista</option>
                <option value={1}>A Prazo</option>
              </select>
            </div>

            <div className="form-group">
              <label>
                Número de Parcelas
                {(formData.a_prazo === 1 || formData.a_prazo === "1") && <span className="required"> *</span>}
              </label>
              <input
                type="number"
                name="num_parcelas"
                value={formData.num_parcelas}
                onChange={handleChange}
                placeholder="Ex: 3, 6, 12"
                min="1"
                disabled={formData.a_prazo === 2 || formData.a_prazo === "2"}
                required={formData.a_prazo === 1 || formData.a_prazo === "1"}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>
                Dia de Vencimento
                {(formData.a_prazo === 1 || formData.a_prazo === "1") && <span className="required"> *</span>}
              </label>
              <input
                type="number"
                name="dia_vencimento"
                value={formData.dia_vencimento}
                onChange={handleChange}
                placeholder="Ex: 5, 15, 30"
                min="1"
                max="31"
                disabled={formData.a_prazo === 2 || formData.a_prazo === "2"}
                required={formData.a_prazo === 1 || formData.a_prazo === "1"}
              />
            </div>

            <div className="form-group">
              <label>
                Período em Dias
                {(formData.a_prazo === 1 || formData.a_prazo === "1") && <span className="required"> *</span>}
              </label>
              <input
                type="number"
                name="periodo_dias"
                value={formData.periodo_dias}
                onChange={handleChange}
                placeholder="Ex: 30, 60, 90"
                min="1"
                disabled={formData.a_prazo === 2 || formData.a_prazo === "2"}
                required={formData.a_prazo === 1 || formData.a_prazo === "1"}
              />
            </div>
          </div>

          <div className="form-group checkbox">
            <label>
              <input
                type="checkbox"
                name="ativa"
                checked={formData.ativa === 1}
                onChange={handleChange}
              />
              Ativa
            </label>
          </div>

          {message && (
            <div className={`message ${messageType}`}>
              {message}
            </div>
          )}

          <div className="modal-footer">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AlterarFormaPagamento;
