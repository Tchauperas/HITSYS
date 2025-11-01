import React, { useState, useEffect } from "react";
import "./Cadastro_pessoa.css";

function CadastroPessoa({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    nome_razao_social: "",
    apelido_nome_fantasia: "",
    id_tipo_pessoa: 1, // 1 = Jurídica, 2 = Física
    cnpj: "",
    cpf: "",
    inscricao_estadual: "",
    data_nascimento: "",
    logradouro: "",
    numero: "",
    complemento: "",
    bairro: "",
    cep: "",
    id_cidade: "",
    id_uf: "",
    telefone: "",
    email: "",
    ativo: true,
  });

  const [ufs, setUfs] = useState([]);
  const [cidades, setCidades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch UFs on component mount
  useEffect(() => {
    const fetchUfs = async () => {
      try {
        const response = await fetch("http://localhost:3000/estados/estados");
        const data = await response.json();
        if (data.success) {
          setUfs(data.values);
        } else {
          setMessage("Erro ao carregar UFs.");
        }
      } catch (error) {
        setMessage(`Erro ao conectar com o servidor: ${error.message}`);
      }
    };

    fetchUfs();
  }, []);

  // Fetch Cidades when a UF is selected
  useEffect(() => {
    if (formData.id_uf) {
      const fetchCidades = async () => {
        try {
          const response = await fetch(
            `http://localhost:3000/cidades/cidades?uf=${formData.id_uf}`
          );
          const data = await response.json();
          if (data.success) {
            setCidades(data.values);
          } else {
            setCidades([]);
            setMessage("Erro ao carregar cidades.");
          }
        } catch (error) {
          setCidades([]);
          setMessage(`Erro ao conectar com o servidor: ${error.message}`);
        }
      };

      fetchCidades();
    } else {
      setCidades([]);
    }
  }, [formData.id_uf]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTipoPessoaChange = (e) => {
    const tipo = parseInt(e.target.value);
    setFormData({
      ...formData,
      id_tipo_pessoa: tipo,
      cnpj: tipo === 1 ? formData.cnpj : "",
      cpf: tipo === 2 ? formData.cpf : "",
      inscricao_estadual: tipo === 1 ? formData.inscricao_estadual : "",
      data_nascimento: tipo === 2 ? formData.data_nascimento : "",
    });
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
      ...formData,
      ativo: formData.ativo ? 1 : 0,
    };

    // Remover campos não utilizados baseado no tipo de pessoa
    if (formData.id_tipo_pessoa === 1) {
      // Pessoa Jurídica
      delete dataToSend.cpf;
      delete dataToSend.data_nascimento;
    } else {
      // Pessoa Física
      delete dataToSend.cnpj;
      delete dataToSend.inscricao_estadual;
    }

    try {
      const response = await fetch("http://localhost:3000/pessoas/cadastrar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSend),
      });

      const data = await response.json();

      if (data.success) {
        setMessage("Pessoa cadastrada com sucesso!");
        setFormData({
          nome_razao_social: "",
          apelido_nome_fantasia: "",
          id_tipo_pessoa: 1,
          cnpj: "",
          cpf: "",
          inscricao_estadual: "",
          data_nascimento: "",
          logradouro: "",
          numero: "",
          complemento: "",
          bairro: "",
          cep: "",
          id_cidade: "",
          id_uf: "",
          telefone: "",
          email: "",
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
        setMessage(`Erro ao cadastrar pessoa: ${data.message}`);
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
          <h1>Cadastro de Pessoa</h1>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <select
            name="id_tipo_pessoa"
            value={formData.id_tipo_pessoa}
            onChange={handleTipoPessoaChange}
            required
          >
            <option value={1}>Pessoa Jurídica</option>
            <option value={2}>Pessoa Física</option>
          </select>

          <input
            type="text"
            name="nome_razao_social"
            placeholder={
              formData.id_tipo_pessoa === 1 ? "Razão Social" : "Nome Completo"
            }
            value={formData.nome_razao_social}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="apelido_nome_fantasia"
            placeholder={
              formData.id_tipo_pessoa === 1 ? "Nome Fantasia" : "Apelido"
            }
            value={formData.apelido_nome_fantasia}
            onChange={handleChange}
          />

          {formData.id_tipo_pessoa === 1 ? (
            <>
              <input
                type="text"
                name="cnpj"
                placeholder="CNPJ"
                value={formData.cnpj}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="inscricao_estadual"
                placeholder="Inscrição Estadual"
                value={formData.inscricao_estadual}
                onChange={handleChange}
              />
            </>
          ) : (
            <>
              <input
                type="text"
                name="cpf"
                placeholder="CPF"
                value={formData.cpf}
                onChange={handleChange}
                required
              />
              <input
                type="date"
                name="data_nascimento"
                placeholder="Data de Nascimento"
                value={formData.data_nascimento}
                onChange={handleChange}
              />
            </>
          )}

          <input
            type="text"
            name="logradouro"
            placeholder="Logradouro"
            value={formData.logradouro}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="numero"
            placeholder="Número"
            value={formData.numero}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="complemento"
            placeholder="Complemento"
            value={formData.complemento}
            onChange={handleChange}
          />

          <input
            type="text"
            name="bairro"
            placeholder="Bairro"
            value={formData.bairro}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="cep"
            placeholder="CEP"
            value={formData.cep}
            onChange={handleChange}
            required
          />

          <select
            name="id_uf"
            value={formData.id_uf}
            onChange={handleChange}
            required
          >
            <option value="">Selecione o Estado</option>
            {ufs.map((uf) => (
              <option key={uf.id_estado} value={uf.id_estado}>
                {uf.estado}
              </option>
            ))}
          </select>

          <select
            name="id_cidade"
            value={formData.id_cidade}
            onChange={handleChange}
            required
          >
            <option value="">Selecione a Cidade</option>
            {cidades.map((cidade) => (
              <option key={cidade.id_cidade} value={cidade.id_cidade}>
                {cidade.cidade}
              </option>
            ))}
          </select>

          <input
            type="text"
            name="telefone"
            placeholder="Telefone"
            value={formData.telefone}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
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
            Pessoa Ativa
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

export default CadastroPessoa;