import React, { useEffect, useState } from "react";
import "./Cadastro_empresa.css";

function PermissoesModal({ perfil, onClose, onSuccess }) {
  const [acoes, setAcoes] = useState([]);
  const [checked, setChecked] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const toggleAll = () => {
    setChecked((prev) => {
      const allChecked = acoes.length > 0 && acoes.every(acao => 
        prev.has(String(acao.id_acao ?? acao.id ?? acao.idAcao))
      );
      
      if (allChecked) {
        // Se todos estão selecionados, desmarca todos
        return new Set();
      } else {
        // Se algum ou nenhum está selecionado, marca todos
        return new Set(acoes.map(acao => 
          String(acao.id_acao ?? acao.id ?? acao.idAcao)
        ));
      }
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = JSON.parse(localStorage.getItem("userData"))?.token;
      try {
        const [resAcoes, resPerms] = await Promise.all([
          fetch("http://127.0.0.1:3000/permissoes/acoes", {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }),
          fetch(`http://127.0.0.1:3000/permissoes/${perfil.id_perfil_usuario || perfil.id || perfil.id_perfil}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }),
        ]);

        const acoesText = await resAcoes.text();
        const permsText = await resPerms.text();

        let acoesJson = [];
        let permsJson = [];
        try { acoesJson = JSON.parse(acoesText).values ?? JSON.parse(acoesText); } catch { acoesJson = []; }
        try { permsJson = JSON.parse(permsText).values ?? JSON.parse(permsText); } catch { permsJson = []; }

        setAcoes(acoesJson);
        setChecked(new Set(permsJson.map((id) => String(id))));
      } catch (e) {
        setMessage("Erro ao carregar ações/permissões");
      }
    };

    fetchData();
  }, [perfil]);

  const toggle = (id) => {
    setChecked((prev) => {
      const s = new Set(prev);
      const key = String(id);
      if (s.has(key)) s.delete(key); else s.add(key);
      return s;
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    const token = JSON.parse(localStorage.getItem("userData"))?.token;
    const ids = Array.from(checked).map((v) => Number(v));
    try {
      const res = await fetch(`http://127.0.0.1:3000/permissoes/${perfil.id_perfil_usuario || perfil.id || perfil.id_perfil}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ acoes: ids }),
      });

      const data = await res.json();
      if (data.success) {
        setMessage("Permissões atualizadas com sucesso");
        if (onSuccess) setTimeout(() => onSuccess(), 800);
        setTimeout(() => onClose(), 1000);
      } else {
        setMessage("Erro ao salvar permissões");
      }
    } catch (err) {
      setMessage(`Erro ao conectar com o servidor: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h1>Permissões - {perfil.descricao || perfil.nome || perfil.label || perfil.id_perfil_usuario || perfil.id}</h1>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>
        <form className="modal-form" onSubmit={handleSave}>
          <div style={{ maxHeight: 300, overflow: "auto", marginBottom: 12 }}>
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 30px",
              gap: "8px",
              alignItems: "center"
            }}>
            {acoes.map((acao) => {
              const aid = acao.id_acao ?? acao.id ?? acao.idAcao;
              const label = acao.descricao ?? acao.nome ?? `Ação ${aid}`;
              return (
                <React.Fragment key={aid}>
                  <label style={{ 
                    cursor: "pointer",
                    padding: "4px 0",
                    userSelect: "none"
                  }}>
                    {label}
                  </label>
                  <div style={{ 
                    display: "flex", 
                    justifyContent: "center"
                  }}>
                    <input 
                      type="checkbox" 
                      checked={checked.has(String(aid))} 
                      onChange={() => toggle(aid)}
                      style={{ margin: 0, cursor: "pointer" }}
                    />
                  </div>
                </React.Fragment>
              );
            })}
            </div>
          </div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginTop: '20px'
          }}>
            <label style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              cursor: 'pointer',
              userSelect: 'none'
            }}>
              <input 
                type="checkbox" 
                checked={acoes.length > 0 && acoes.every(acao => 
                  checked.has(String(acao.id_acao ?? acao.id ?? acao.idAcao))
                )} 
                onChange={toggleAll}
                style={{ margin: 0, cursor: 'pointer' }}
              />
              Selecionar Todos
            </label>
            <button type="submit" className="btn-cadastrar" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
          {message && <p className={`message ${message.includes("sucesso") ? "success" : ""}`}>{message}</p>}
        </form>
      </div>
    </div>
  );
}

export default PermissoesModal;
