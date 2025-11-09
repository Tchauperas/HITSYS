import React, { useState, useEffect } from "react";
import "./Cadastro_pessoa.css";
import "./Alterar_pessoa.css";

function CadastroPessoa({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    nome_razao_social: "",
    apelido_nome_fantasia: "",
    id_tipo_pessoa: "", // 1 = Jurídica, 2 = Física; início vazio para exigir seleção
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
  const [tiposCadastros, setTiposCadastros] = useState([]);
  const [tiposPessoas, setTiposPessoas] = useState([]);
  const [selectedTipos, setSelectedTipos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'error' | 'success'

  // Fetch UFs on component mount
  useEffect(() => {
    const fetchUfs = async () => {
      try {
        const response = await fetch("http://localhost:3000/estados/estados");
        const data = await response.json();
        if (data.success) {
          setUfs(data.values);
        } else {
          setMessageType('error');
          setMessage("Erro ao carregar UFs.");
        }
      } catch (error) {
        setMessageType('error');
        setMessage(`Erro ao conectar com o servidor: ${error.message}`);
      }
    };

    fetchUfs();
  }, []);

  // Fetch tipos de cadastro
  useEffect(() => {
    const fetchTipos = async () => {
      try {
        const resp = await fetch('http://localhost:3000/tipos_cadastros/visualizar');
        const data = await resp.json();
        if (data.success) setTiposCadastros(data.values);
      } catch (err) {
        console.error('Erro ao carregar tipos de cadastro:', err);
      }
    };
    fetchTipos();
  }, []);

  // Fetch tipos de pessoa (para select de tipo de pessoa)
  useEffect(() => {
    const fetchTiposPessoas = async () => {
      try {
        const resp = await fetch('http://localhost:3000/tipos_pessoas/visualizar');
        const data = await resp.json();
        if (data.success) setTiposPessoas(data.values);
      } catch (err) {
        console.error('Erro ao carregar tipos de pessoa:', err);
      }
    };
    fetchTiposPessoas();
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
            setMessageType('error');
            setMessage("Erro ao carregar cidades.");
          }
        } catch (error) {
          setCidades([]);
          setMessageType('error');
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

  // Máscaras: CPF / CNPJ - impedem inserir caracteres especiais e formatam enquanto digita
  const formatCPF = (value) => {
    const onlyNumbers = String(value).replace(/\D/g, '');
    return onlyNumbers
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const formatCNPJ = (value) => {
    const onlyNumbers = String(value).replace(/\D/g, '');
    return onlyNumbers
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const handleCPFChange = (e) => {
    const formatted = formatCPF(e.target.value);
    setFormData({ ...formData, cpf: formatted });
  };

  const handleCNPJChange = (e) => {
    const formatted = formatCNPJ(e.target.value);
    setFormData({ ...formData, cnpj: formatted });
  };

  const handleTipoPessoaChange = (e) => {
    const val = e.target.value;
    // permite valor vazio (placeholder)
    const tipo = val === "" ? "" : parseInt(val);
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
      setMessageType('error');
      setMessage("Token não encontrado. Faça login novamente.");
      setLoading(false);
      return;
    }

    // validar Nome/Razão Social obrigatório
    if (!formData.nome_razao_social || !formData.nome_razao_social.trim()) {
      setMessageType('error');
      setMessage('Nome/Razão Social é obrigatório');
      setLoading(false);
      return;
    }

    // Preparar dados para envio
    const dataToSend = {
      ...formData,
      tipos_cadastros: selectedTipos,
      ativo: formData.ativo ? 1 : 0,
    };

    // valida seleção de tipo de pessoa
    if (!formData.id_tipo_pessoa) {
      setMessageType('error');
      setMessage('Selecione o tipo da pessoa');
      setLoading(false);
      return;
    }

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

    // Garantir que CNPJ/CPF enviados contenham apenas números
    if (dataToSend.cnpj) {
      dataToSend.cnpj = String(dataToSend.cnpj).replace(/\D/g, '');
      if (dataToSend.cnpj === '') dataToSend.cnpj = null;
    }
    if (dataToSend.cpf) {
      dataToSend.cpf = String(dataToSend.cpf).replace(/\D/g, '');
      if (dataToSend.cpf === '') dataToSend.cpf = null;
    }
    // Remover data_nascimento vazia (evita inserir string vazia no banco e erro de 'Incorrect date value')
    if (dataToSend.data_nascimento === "" || dataToSend.data_nascimento == null) {
      dataToSend.data_nascimento = null;
    }

    // Normalizar campos numéricos: se estiverem vazios, setá-los como null para inserir NULL no banco
    if (dataToSend.id_cidade === "" || dataToSend.id_cidade == null) {
      dataToSend.id_cidade = null;
    } else {
      dataToSend.id_cidade = Number(dataToSend.id_cidade);
    }

    if (dataToSend.id_uf === "" || dataToSend.id_uf == null) {
      dataToSend.id_uf = null;
    } else {
      dataToSend.id_uf = Number(dataToSend.id_uf);
    }

    if (dataToSend.id_tipo_pessoa === "" || dataToSend.id_tipo_pessoa == null) {
      dataToSend.id_tipo_pessoa = null;
    } else {
      dataToSend.id_tipo_pessoa = Number(dataToSend.id_tipo_pessoa);
    }

    // Garantir que tipos_cadastros sejam números (array de ints)
    if (Array.isArray(dataToSend.tipos_cadastros)) {
      dataToSend.tipos_cadastros = dataToSend.tipos_cadastros.map((v) => Number(v));
    }

    // Converter quaisquer strings vazias restantes para null para que o banco receba NULL
    Object.keys(dataToSend).forEach((k) => {
      if (dataToSend[k] === '') dataToSend[k] = null;
    });

    try {
      // valida seleção de tipos
      if (!selectedTipos || selectedTipos.length === 0) {
        setMessageType('error');
        setMessage('Selecione ao menos um Tipo de Cadastro.');
        setLoading(false);
        return;
      }
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
        setMessageType('success');
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
        setMessageType('error');
        setMessage(`Erro ao cadastrar pessoa: ${data.message}`);
      }
    } catch (error) {
      setMessageType('error');
      setMessage(`Erro ao conectar com o servidor: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const toggleTipo = (id) => {
    setSelectedTipos((prev) => {
      if (prev.includes(id)) return prev.filter((i) => i !== id);
      return [...prev, id];
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Cadastro de Pessoa</h2>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Pessoa Ativa e Tipos de Cadastro posicionados aqui para alinhar com demais campos */}
          <div className="form-section">
            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  name="ativo"
                  checked={formData.ativo}
                  onChange={(e) => setFormData({ ...formData, ativo: e.target.checked })}
                />
                Pessoa Ativa
              </label>
            </div>
          </div>

          {tiposCadastros.length > 0 && (
            <div className="form-section">
              <h3>Tipos de Cadastro *</h3>
              <div className="tipos-list">
                {tiposCadastros.map((tipo) => (
                  <label key={tipo.id_tipo_cadastro} className="tipo-item">
                    <input
                      type="checkbox"
                      checked={selectedTipos.includes(tipo.id_tipo_cadastro)}
                      onChange={() => toggleTipo(tipo.id_tipo_cadastro)}
                    />
                    {tipo.descricao}
                  </label>
                ))}
              </div>
            </div>
          )}
          <div className="form-section">
            <h3>Tipo de Pessoa *</h3>
            <div className="form-group">
              <select
                id="id_tipo_pessoa"
                name="id_tipo_pessoa"
                value={formData.id_tipo_pessoa}
                onChange={handleTipoPessoaChange}
                required
              >
                <option value="">Selecione o tipo da pessoa</option>
                {tiposPessoas && tiposPessoas.length > 0 ? (
                  tiposPessoas.map((tipo) => (
                    <option key={tipo.id_tipo_pessoa} value={tipo.id_tipo_pessoa}>
                      {tipo.descricao}
                    </option>
                  ))
                ) : (
                  <option value="">Nenhum tipo disponível</option>
                )}
              </select>
            </div>
          </div>

          <div className="form-section">
            <h3>Dados {formData.id_tipo_pessoa === 1 ? 'da Empresa' : 'Pessoais'}</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Nome/Razão Social *</label>
                <input
                  type="text"
                  name="nome_razao_social"
                  value={formData.nome_razao_social}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Apelido/Nome Fantasia</label>
                <input
                  type="text"
                  name="apelido_nome_fantasia"
                  value={formData.apelido_nome_fantasia}
                  onChange={handleChange}
                />
              </div>
            </div>

            {formData.id_tipo_pessoa === 1 ? (
              <div className="form-row">
                <div className="form-group">
                  <label>CNPJ</label>
                  <input
                    type="text"
                    name="cnpj"
                    value={formData.cnpj}
                    onChange={handleCNPJChange}
                    maxLength="18"
                  />
                </div>
                <div className="form-group">
                  <label>Inscrição Estadual</label>
                  <input
                    type="text"
                    name="inscricao_estadual"
                    value={formData.inscricao_estadual}
                    onChange={handleChange}
                  />
                </div>
              </div>
            ) : (
              <div className="form-row">
                <div className="form-group">
                  <label>CPF</label>
                  <input
                    type="text"
                    name="cpf"
                    value={formData.cpf}
                    onChange={handleCPFChange}
                    maxLength="14"
                  />
                </div>
                <div className="form-group">
                  <label>Data de Nascimento</label>
                  <input
                    type="date"
                    name="data_nascimento"
                    value={formData.data_nascimento}
                    onChange={handleChange}
                  />
                </div>
              </div>
            )}

            <div className="form-row">
              <div className="form-group">
                <label>Telefone</label>
                <input
                  type="text"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Endereço</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Logradouro</label>
                <input type="text" name="logradouro" value={formData.logradouro} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>N°</label>
                <input type="text" name="numero" value={formData.numero} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Complemento</label>
                <input type="text" name="complemento" value={formData.complemento} onChange={handleChange} />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Bairro</label>
                <input type="text" name="bairro" value={formData.bairro} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>CEP</label>
                <input type="text" name="cep" value={formData.cep} onChange={handleChange} />
              </div>
            </div>

            <div className="form-row form-row--state-city">
              <div className="form-group">
                <label>UF - Estado</label>
                <select name="id_uf" value={formData.id_uf} onChange={handleChange} >
                  <option value="">Selecione a UF - Estado</option>
                  {ufs.map((uf) => (
                        <option key={uf.id_estado} value={uf.id_estado}>{uf.uf + ' - ' + uf.estado}</option>
                      ))}
                </select>
              </div>
              <div className="form-group">
                <label>Cidade</label>
                <select name="id_cidade" value={formData.id_cidade} onChange={handleChange}>
                  <option value="">Selecione a Cidade</option>
                  {cidades.map((cidade) => (
                    <option key={cidade.id_cidade} value={cidade.id_cidade}>{cidade.cidade}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          
          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-submit" disabled={loading}>{loading ? 'Cadastrando...' : 'Cadastrar'}</button>
          </div>
        </form>

        {message && (
          <p className={`message ${messageType === 'error' ? 'error' : 'success'}`}>{message}</p>
        )}
      </div>
    </div>
  );
}

export default CadastroPessoa;