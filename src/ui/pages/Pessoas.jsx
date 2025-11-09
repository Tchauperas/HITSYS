import React, { useState, useEffect } from "react";
import "./Pessoas.css";
import Navbar from "../components/Navbar";
import logo from "../assets/pessoas_icon.png";
import CadastroPessoa from "../components/Cadastro_pessoa";
import AlterarPessoa from "../components/Alterar_pessoa";

function Pessoas() {
  const [pessoas, setPessoas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPessoa, setSelectedPessoa] = useState(null);

  useEffect(() => {
    fetchPessoas();
  }, []);

  const fetchPessoas = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3000/pessoas/visualizar");
      const data = await response.json();

      if (data.success) {
        setPessoas(data.values);
      } else {
        setError("Erro ao carregar pessoas");
      }
    } catch (err) {
      setError("Erro ao conectar com o servidor");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredPessoas = pessoas.filter((pessoa) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      pessoa.nome_razao_social?.toLowerCase().includes(searchLower) ||
      pessoa.cnpj?.includes(searchTerm) ||
      pessoa.cpf?.includes(searchTerm)
    );
  });

  const formatCNPJCPF = (cnpj, cpf) => {
    if (cnpj) {
      return cnpj.replace(
        /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
        "$1.$2.$3/$4-$5"
      );
    }
    if (cpf) {
      return cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");
    }
    return "N/A";
  };

  const handleEdit = (pessoa) => {
    setSelectedPessoa(pessoa);
    setShowEditModal(true);
  };

  const handleUpdate = async (updatedPessoa) => {
    try {
      const bodyData = {
        nome_razao_social: updatedPessoa.nome_razao_social,
        apelido_nome_fantasia: updatedPessoa.apelido_nome_fantasia,
        id_tipo_pessoa: updatedPessoa.id_tipo_pessoa,
        telefone: updatedPessoa.telefone ? updatedPessoa.telefone.replace(/\D/g, '') : '',
        email: updatedPessoa.email,
        cep: updatedPessoa.cep ? updatedPessoa.cep.replace(/\D/g, '') : '',
        logradouro: updatedPessoa.logradouro,
        numero: updatedPessoa.numero,
        complemento: updatedPessoa.complemento,
        bairro: updatedPessoa.bairro,
        id_cidade: updatedPessoa.id_cidade,
        id_uf: updatedPessoa.id_uf,
        ativo: updatedPessoa.ativo
      };

      // Adiciona CPF ou CNPJ baseado no tipo de pessoa
      if (updatedPessoa.id_tipo_pessoa === 2) {
        // Pessoa Física
        bodyData.cpf = updatedPessoa.cpf ? updatedPessoa.cpf.replace(/\D/g, '') : '';
        bodyData.data_nascimento = updatedPessoa.data_nascimento;
      } else {
        // Pessoa Jurídica
        bodyData.cnpj = updatedPessoa.cnpj ? updatedPessoa.cnpj.replace(/\D/g, '') : '';
        bodyData.inscricao_estadual = updatedPessoa.inscricao_estadual;
      }

      // Tipos de cadastro (array de ids), se informado
      if (updatedPessoa.tipos_cadastros) {
        bodyData.tipos_cadastros = updatedPessoa.tipos_cadastros;
      }

      const response = await fetch(
        `http://localhost:3000/pessoas/alterar/${updatedPessoa.id_pessoa}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bodyData),
        }
      );
      const data = await response.json();

      if (data.success) {
        alert("Pessoa atualizada com sucesso!");
        fetchPessoas(); // Recarregar lista
        setShowEditModal(false);
        setSelectedPessoa(null);
      } else {
        alert("Erro ao atualizar pessoa");
      }
    } catch (err) {
      alert("Erro ao conectar com o servidor");
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    console.log("Tentando deletar pessoa com ID:", id); // Log para debug
    if (window.confirm("Deseja realmente deletar esta pessoa?")) {
      try {
        const response = await fetch(
          `http://localhost:3000/pessoas/deletar/${id}`,
          {
            method: "DELETE",
          }
        );

        console.log("Resposta do servidor:", response); // Log para debug

        if (response.ok) {
          alert("Pessoa deletada com sucesso!");
          fetchPessoas();
        } else {
          const data = await response.json();
          alert(data.message || "Erro ao deletar pessoa");
        }
      } catch (err) {
        alert("Erro ao conectar com o servidor");
        console.error(err);
      }
    }
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedPessoa(null);
  };

  const handleSuccess = () => {
    fetchPessoas(); // Recarrega a lista após cadastro bem-sucedido
  };

  return (
    <div className="pessoas-container">
      <Navbar />

      <div className="content">
        <header className="top-row">
          <div className="title">
            <span className="people-icon"></span>
            <img src={logo} alt="Logo" className="logo" />
            <h1>Listagem de Pessoas</h1>
          </div>

          <div className="right-actions">
            <button className="btn-cadastrar" onClick={handleOpenModal}>
              Cadastrar
            </button>
          </div>
        </header>

        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="   Pesquisar pessoa"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading && <p>Carregando...</p>}
        {error && <p className="error-message">{error}</p>}

        {!loading && !error && (
          <table className="pessoas-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>CNPJ/CPF</th>
                <th style={{ textAlign: "center", width: 140 }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredPessoas.length > 0 ? (
                filteredPessoas.map((pessoa) => (
                  <tr key={pessoa.id_pessoa}>
                    <td>{pessoa.nome_razao_social}</td>
                    <td>{formatCNPJCPF(pessoa.cnpj, pessoa.cpf)}</td>
                    <td className="acoes">
                      <button
                        className="btn-editar"
                        onClick={() => handleEdit(pessoa)}
                        title="Editar"
                      >
                        ✏️
                      </button>
                      <button
                        className="btn-excluir"
                        onClick={() => handleDelete(pessoa.id_pessoa)}
                        title="Excluir"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" style={{ textAlign: "center" }}>
                    Nenhuma pessoa encontrada
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <CadastroPessoa onClose={handleCloseModal} onSuccess={handleSuccess} />
      )}

      {showEditModal && selectedPessoa && (
        <AlterarPessoa
          isOpen={showEditModal}
          onClose={handleCloseEditModal}
          pessoa={selectedPessoa}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
}

export default Pessoas;
