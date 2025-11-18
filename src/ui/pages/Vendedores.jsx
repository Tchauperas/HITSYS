import React, { useState, useEffect } from "react";
import "./Vendedores.css";
import Navbar from "../components/Navbar";
import CadastrarVendedor from "../components/Cadastrar_vendedor";
import AlterarVendedor from "../components/Alterar_vendedores";
import logo from "../assets/vendedores_icon.png"
import WindowControls from "../components/WindowControls";

function Vendedores() {
  const [vendedores, setVendedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModalCadastrar, setShowModalCadastrar] = useState(false);
  const [showModalAlterar, setShowModalAlterar] = useState(false);
  const [vendedorSelecionado, setVendedorSelecionado] = useState(null);

  useEffect(() => {
    fetchVendedores();
  }, []);

  const fetchVendedores = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('http://127.0.0.1:3000/vendedores/vendedores');
      
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }
      
      // Verificar se a resposta é JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error('Resposta não é JSON:', text);
        throw new Error('Resposta do servidor não é JSON válido');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setVendedores(data.values);
      } else {
        throw new Error(data.message || 'Resposta inválida do servidor');
      }
    } catch (err) {
      setError(err.message);
      console.error('Erro ao buscar vendedores:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (vendedor) => {
    setVendedorSelecionado(vendedor);
    setShowModalAlterar(true);
  };

  const handleDelete = async (id_vendedor) => {
    if (window.confirm('Tem certeza que deseja excluir este vendedor?')) {
      try {
        const token = JSON.parse(localStorage.getItem("userData"))?.token;

        const response = await fetch(`http://127.0.0.1:3000/vendedores/vendedores/${id_vendedor}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error(`Erro HTTP: ${response.status}`);
        }

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          const text = await response.text();
          console.error('Resposta não é JSON:', text);
          throw new Error('Resposta do servidor não é JSON válido');
        }

        const data = await response.json();

        if (data.success) {
          alert('Vendedor excluído com sucesso!');
          fetchVendedores();
        } else {
          throw new Error(data.message || 'Erro ao excluir vendedor');
        }
      } catch (err) {
        alert(`Erro: ${err.message}`);
        console.error('Erro ao excluir vendedor:', err);
      }
    }
  };

  const handleCadastroSuccess = () => {
    fetchVendedores();
  };

  const handleAlteracaoSuccess = () => {
    fetchVendedores();
  };

  return (
    <div className="vendedores-container">
      <WindowControls />
      <Navbar />

      <div className="content">
        <header className="top-row">
          <div className="title">
            <span className="box-icon"></span>
            <img src={logo} alt="Logo" className="logo" />
            <h1>LISTAGEM DE VENDEDORES</h1>
          </div>

          <div className="right-actions">
            <button className="btn-cadastrar" onClick={() => setShowModalCadastrar(true)}>
              Cadastrar
            </button>
          </div>
        </header>

        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="     Buscar vendedor"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading && <p>Carregando vendedores...</p>}
        {error && <p className="error">Erro: {error}</p>}

        <table className="vendedores-table">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Pessoa</th>
              <th>%Comissão</th>
              <th>%Desconto Máximo</th>
              <th style={{ textAlign: "center", width: 140 }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {vendedores.filter((v) => {
              const term = searchTerm.toLowerCase();
              if (!term) return true;
              return (
                v.nome_usuario?.toLowerCase().includes(term) ||
                v.nome_pessoa?.toLowerCase().includes(term) ||
                String(v.taxa_comissao ?? "").toLowerCase().includes(term) ||
                String(v.desconto_max ?? "").toLowerCase().includes(term)
              );
            }).length === 0 && !loading && (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center' }}>
                  Nenhum vendedor encontrado
                </td>
              </tr>
            )}
            {vendedores
              .filter((v) => {
                const term = searchTerm.toLowerCase();
                if (!term) return true;
                return (
                  v.nome_usuario?.toLowerCase().includes(term) ||
                  v.nome_pessoa?.toLowerCase().includes(term) ||
                  String(v.taxa_comissao ?? "").toLowerCase().includes(term) ||
                  String(v.desconto_max ?? "").toLowerCase().includes(term)
                );
              })
              .map((vendedor) => (
              <tr key={vendedor.id_vendedor}>
                <td>{vendedor.nome_usuario}</td>
                <td>{vendedor.nome_pessoa}</td>
                <td>{parseFloat(vendedor.taxa_comissao).toFixed(2)}%</td>
                <td>{parseFloat(vendedor.desconto_max).toFixed(2)}%</td>
                <td className="acoes">
                    <button 
                      className="btn-editar"
                    onClick={() => handleEdit(vendedor)}
                    title="Editar vendedor"
                  >
                    ✏️
                  </button>
                  <button 
                    className="btn-excluir"
                    onClick={() => handleDelete(vendedor.id_vendedor)}
                    title="Excluir vendedor"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModalCadastrar && (
        <CadastrarVendedor
          onClose={() => setShowModalCadastrar(false)}
          onSuccess={handleCadastroSuccess}
        />
      )}

      {showModalAlterar && vendedorSelecionado && (
        <AlterarVendedor
          vendedor={vendedorSelecionado}
          onClose={() => {
            setShowModalAlterar(false);
            setVendedorSelecionado(null);
          }}
          onSuccess={handleAlteracaoSuccess}
        />
      )}
    </div>
  );
}

export default Vendedores;
