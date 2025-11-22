import React, { useEffect, useState } from "react";
import "./Produtos.css";
import Navbar from "../components/Navbar";
import CadastroProduto from "../components/Cadastro_produto";
import AlterarProduto from "../components/Alterar_produto";
import logo from "../assets/produtos_icon.png";
import WindowControls from "../components/WindowControls";

function Produtos() {
  const [produtos, setProdutos] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showCadastroModal, setShowCadastroModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduto, setSelectedProduto] = useState(null);

  const fetchProdutos = async () => {
    const token = JSON.parse(localStorage.getItem("userData"))?.token;

    if (!token) {
      console.error("Token não encontrado no localStorage.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        "http://127.0.0.1:3000/produtos/visualizar",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (data.success && Array.isArray(data.values)) {
        setProdutos(data.values);
      } else {
        console.error("Formato inesperado:", data);
      }
    } catch (error) {
      console.error("Erro no fetch:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProdutos();
  }, []);

  const handleDelete = async (idProduto) => {
    const token = JSON.parse(localStorage.getItem("userData"))?.token;

    if (!token) {
      console.error("Token não encontrado no localStorage.");
      return;
    }

    if (window.confirm("Tem certeza que deseja excluir este produto?")) {
      try {
        const response = await fetch(
          `http://127.0.0.1:3000/produtos/deletar/${idProduto}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          alert("Produto excluído com sucesso!");
          fetchProdutos();
        } else {
          const data = await response.json();
          console.error("Erro ao excluir produto:", data.message);
          alert("Erro ao excluir produto.");
        }
      } catch (error) {
        console.error("Erro no fetch:", error);
        alert("Erro ao excluir produto.");
      }
    }
  };

  const handleEdit = (produto) => {
    setSelectedProduto(produto);
    setShowEditModal(true);
  };

  const handleUpdate = async (updatedProduto) => {
    try {
      const token = JSON.parse(localStorage.getItem("userData"))?.token;

      if (!token) {
        alert("Token não encontrado. Faça login novamente.");
        return;
      }

      const response = await fetch(
        `http://127.0.0.1:3000/produtos/alterar/${updatedProduto.id_produto}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedProduto),
        }
      );

      const data = await response.json();

      if (data.success) {
        alert("Produto atualizado com sucesso!");
        fetchProdutos();
        setShowEditModal(false);
        setSelectedProduto(null);
      } else {
        alert(`Erro ao atualizar produto: ${data.message}`);
      }
    } catch (error) {
      alert("Erro ao conectar com o servidor");
      console.error(error);
    }
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedProduto(null);
  };

  const filteredProdutos = produtos.filter(
    (produto) =>
      produto.descricao?.toLowerCase().includes(search.toLowerCase()) ||
      produto.codigo?.toString().includes(search) ||
      produto.cod_barras?.includes(search)
  );

  return (
    <div className="produtos-container">
      <WindowControls />
      <Navbar />

      <div className="content">
        <header className="top-row">
          <div className="title">
            <span className="box-icon"></span>
            <img src={logo} alt="Logo" className="logo" />
            <h1>LISTAGEM DE PRODUTOS</h1>
          </div>

          <div className="right-actions">
            <button
              className="btn-cadastrar"
              onClick={() => setShowCadastroModal(true)}
            >
              Cadastrar
            </button>
          </div>
        </header>

        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="   Pesquisar produto"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <p style={{ textAlign: "center", marginTop: "20px" }}>
            Carregando produtos...
          </p>
        ) : filteredProdutos.length === 0 ? (
          <p style={{ textAlign: "center", marginTop: "20px" }}>
            Nenhum produto encontrado.
          </p>
        ) : (
          <table className="produtos-table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Descrição</th>
                <th>Preço</th>
                <th>Estoque</th>
                <th className="acoes-header">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredProdutos.map((produto) => (
                <tr key={produto.id_produto}>
                  <td>{produto.codigo}</td>
                  <td>{produto.descricao}</td>
                  <td>
                    {produto.preco_venda
                      ? parseFloat(produto.preco_venda).toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })
                      : "R$ 0,00"}
                  </td>
                  <td>{produto.saldo_estoque || "0,000"}</td>

                  <td className="acoes-cell">
                    <div className="acoes-wrapper">
                      <button
                        className="btn-alterar"
                        onClick={() => handleEdit(produto)}
                      >
                        ✏️
                      </button>
                      <button
                        className="btn-excluir"
                        onClick={() => handleDelete(produto.id_produto)}
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showCadastroModal && (
        <CadastroProduto
          onClose={() => setShowCadastroModal(false)}
          onSuccess={fetchProdutos}
        />
      )}

      {showEditModal && selectedProduto && (
        <AlterarProduto
          isOpen={showEditModal}
          onClose={handleCloseEditModal}
          produto={selectedProduto}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
}

export default Produtos;
