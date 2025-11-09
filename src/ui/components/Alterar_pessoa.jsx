import React, { useState, useEffect } from 'react';
import './Alterar_pessoa.css';

const Alterar_pessoa = ({ isOpen, onClose, pessoa, onUpdate }) => {
  const [formData, setFormData] = useState({
    nome_razao_social: '',
    apelido_nome_fantasia: '',
    id_tipo_pessoa: 1,
    cpf: '',
    cnpj: '',
    inscricao_estadual: '',
    data_nascimento: '',
    telefone: '',
    email: '',
    cep: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    id_cidade: '',
    id_uf: '',
    ativo: true
  });

  const [ufs, setUfs] = useState([]);
  const [cidades, setCidades] = useState([]);
  const [tiposCadastros, setTiposCadastros] = useState([]);
  const [tiposPessoas, setTiposPessoas] = useState([]);
  const [selectedTipos, setSelectedTipos] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Funções de formatação
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

  const formatTelefone = (value) => {
    const onlyNumbers = String(value).replace(/\D/g, '');
    return onlyNumbers
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
  };

  const formatCEP = (value) => {
    const onlyNumbers = String(value).replace(/\D/g, '');
    return onlyNumbers
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{3})\d+?$/, '$1');
  };

  // Fetch UFs
  useEffect(() => {
    const fetchUfs = async () => {
      try {
        const response = await fetch("http://localhost:3000/estados/estados");
        const data = await response.json();
        if (data.success) {
          setUfs(data.values);
        }
      } catch (error) {
        console.error('Erro ao carregar UFs:', error);
      }
    };

    fetchUfs();
  }, []);

  // fetch tipos de cadastro
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

  // fetch tipos de pessoa (para select)
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

  // Fetch Cidades quando UF é selecionado
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
          }
        } catch (error) {
          console.error('Erro ao carregar cidades:', error);
          setCidades([]);
        }
      };

      fetchCidades();
    } else {
      setCidades([]);
    }
  }, [formData.id_uf]);

  // Carregar dados da pessoa
  useEffect(() => {
    if (pessoa) {
      // Preferir valor vindo do banco (id_tipo_pessoa) quando disponível
      const tipoPessoa = pessoa.id_tipo_pessoa ?? (pessoa.cnpj ? 1 : 2);

      setFormData({
        nome_razao_social: pessoa.nome_razao_social || '',
        apelido_nome_fantasia: pessoa.apelido_nome_fantasia || '',
        id_tipo_pessoa: tipoPessoa,
        cpf: pessoa.cpf ? formatCPF(pessoa.cpf) : '',
        cnpj: pessoa.cnpj ? formatCNPJ(pessoa.cnpj) : '',
        inscricao_estadual: pessoa.inscricao_estadual || '',
        data_nascimento: pessoa.data_nascimento || '',
        telefone: pessoa.telefone ? formatTelefone(pessoa.telefone) : '',
        email: pessoa.email || '',
        cep: pessoa.cep ? formatCEP(pessoa.cep) : '',
        logradouro: pessoa.logradouro || '',
        numero: pessoa.numero || '',
        complemento: pessoa.complemento || '',
        bairro: pessoa.bairro || '',
        id_cidade: pessoa.id_cidade || '',
        id_uf: pessoa.id_uf || '',
        ativo: pessoa.ativo === 1 || pessoa.ativo === true
      });

      // se não tivermos os tipos no objeto pessoa, buscar detalhes
      const fetchPessoaDetalhes = async () => {
        try {
          const resp = await fetch(`http://localhost:3000/pessoas/visualizar/${pessoa.id_pessoa}`);
          const data = await resp.json();
          if (data.success && data.values) {
            const tipos = data.values.tipos_cadastros || [];
            setSelectedTipos(tipos.map(t => t.id_tipo_cadastro));
          }
        } catch (err) {
          console.error('Erro ao buscar detalhes da pessoa:', err);
        }
      };

      fetchPessoaDetalhes();
    }
  }, [pessoa]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleTipoPessoaChange = (e) => {
    const val = e.target.value;
    const tipo = val === '' ? '' : parseInt(val);
    setFormData(prev => ({
      ...prev,
      id_tipo_pessoa: tipo,
      cnpj: tipo === 1 ? prev.cnpj : '',
      cpf: tipo === 2 ? prev.cpf : '',
      inscricao_estadual: tipo === 1 ? prev.inscricao_estadual : '',
      data_nascimento: tipo === 2 ? prev.data_nascimento : ''
    }));
  };

  const handleCPFChange = (e) => {
    const formatted = formatCPF(e.target.value);
    setFormData(prev => ({ ...prev, cpf: formatted }));
    if (errors.cpf) {
      setErrors(prev => ({ ...prev, cpf: '' }));
    }
  };

  const handleCNPJChange = (e) => {
    const formatted = formatCNPJ(e.target.value);
    setFormData(prev => ({ ...prev, cnpj: formatted }));
    if (errors.cnpj) {
      setErrors(prev => ({ ...prev, cnpj: '' }));
    }
  };

  const handleTelefoneChange = (e) => {
    const formatted = formatTelefone(e.target.value);
    setFormData(prev => ({ ...prev, telefone: formatted }));
    if (errors.telefone) {
      setErrors(prev => ({ ...prev, telefone: '' }));
    }
  };

  const handleCEPChange = (e) => {
    const formatted = formatCEP(e.target.value);
    setFormData(prev => ({ ...prev, cep: formatted }));
    if (errors.cep) {
      setErrors(prev => ({ ...prev, cep: '' }));
    }
  };

  const buscarCEP = async (cep) => {
    const cepLimpo = cep.replace(/\D/g, '');
    if (cepLimpo.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
        const data = await response.json();
        
        if (!data.erro) {
          setFormData(prev => ({
            ...prev,
            logradouro: data.logradouro,
            bairro: data.bairro
          }));
        }
      } catch (error) {
        console.error('Erro ao buscar CEP:', error);
      }
    }
  };

  const handleCEPBlur = () => {
    buscarCEP(formData.cep);
  };

  const validateForm = () => {
    const newErrors = {};

    console.log('Validando form:', formData);

    if (!formData.nome_razao_social.trim()) {
      newErrors.nome_razao_social = formData.id_tipo_pessoa === 1 ? 'Razão Social é obrigatória' : 'Nome é obrigatório';
    }

    // Tipo de pessoa obrigatório
    if (!formData.id_tipo_pessoa) {
      newErrors.id_tipo_pessoa = 'Tipo de pessoa é obrigatório';
    }

    // Observação: exigimos apenas Nome/Razão Social e Tipo de Pessoa aqui.
    // A validação de seleção de Tipos de Cadastro (pelo menos 1) é feita em handleSubmit.

    console.log('Erros encontrados:', newErrors);

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('Submit iniciado');
    console.log('Form data:', formData);

    if (!validateForm()) {
      console.log('Validação falhou:', errors);
      return;
    }

    setLoading(true);

    try {
      // valida seleção de tipos
      if (!selectedTipos || selectedTipos.length === 0) {
        setErrors(prev => ({ ...prev, tipos: 'Selecione ao menos um Tipo de Cadastro' }));
        setLoading(false);
        return;
      }
      const dataToSend = {
        id_pessoa: pessoa.id_pessoa,
        nome_razao_social: formData.nome_razao_social,
        apelido_nome_fantasia: formData.apelido_nome_fantasia,
        id_tipo_pessoa: formData.id_tipo_pessoa,
        telefone: formData.telefone.replace(/\D/g, ''), // Remove formatação
        email: formData.email,
        cep: formData.cep.replace(/\D/g, ''), // Remove formatação
        logradouro: formData.logradouro,
        numero: formData.numero,
        complemento: formData.complemento,
        bairro: formData.bairro,
        id_cidade: formData.id_cidade,
        id_uf: formData.id_uf,
        ativo: formData.ativo ? 1 : 0
      };

      // incluir tipos selecionados
      dataToSend.tipos_cadastros = selectedTipos;

      // Adiciona campos específicos baseado no tipo de pessoa
      if (formData.id_tipo_pessoa === 1) {
        dataToSend.cnpj = formData.cnpj.replace(/\D/g, ''); // Remove formatação
        dataToSend.inscricao_estadual = formData.inscricao_estadual;
      } else {
        dataToSend.cpf = formData.cpf.replace(/\D/g, ''); // Remove formatação
        // Formata a data para YYYY-MM-DD
        if (formData.data_nascimento) {
          const date = new Date(formData.data_nascimento);
          dataToSend.data_nascimento = date.toISOString().split('T')[0];
        }
      }

      // Normalizar campos numéricos e setar vazios como null para evitar erros no banco
      if (dataToSend.data_nascimento === "" || dataToSend.data_nascimento == null) {
        dataToSend.data_nascimento = null;
      }

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

      if (Array.isArray(dataToSend.tipos_cadastros)) {
        dataToSend.tipos_cadastros = dataToSend.tipos_cadastros.map((v) => Number(v));
      }

      // Converter quaisquer strings vazias restantes para null
      Object.keys(dataToSend).forEach((k) => {
        if (dataToSend[k] === '') dataToSend[k] = null;
      });

      console.log('Enviando dados:', dataToSend);
      
      await onUpdate(dataToSend);
      
      console.log('Atualização concluída');
    } catch (error) {
      console.error('Erro ao atualizar pessoa:', error);
      alert('Erro ao atualizar pessoa. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  const toggleTipo = (id) => {
    setSelectedTipos(prev => {
      if (prev.includes(id)) return prev.filter(i => i !== id);
      return [...prev, id];
    });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Alterar Pessoa</h2>
          <button className="close-button" onClick={handleClose}>×</button>
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
                  onChange={(e) => setFormData(prev => ({ ...prev, ativo: e.target.checked }))}
                />
                Pessoa Ativa
              </label>
            </div>
          </div>

          {tiposCadastros.length > 0 && (
            <div className="form-section">
              <h3>Tipos de Cadastro *</h3>
              <div className="tipos-list">
                {tiposCadastros.map(tipo => (
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
              {errors.tipos && <span className="error-message">{errors.tipos}</span>}
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
                    tiposPessoas.map(tipo => (
                      <option key={tipo.id_tipo_pessoa} value={tipo.id_tipo_pessoa}>{tipo.descricao}</option>
                    ))
                  ) : (
                    <option value="">Nenhum tipo disponível</option>
                  )}
                </select>
                {errors.id_tipo_pessoa && <span className="error-message">{errors.id_tipo_pessoa}</span>}
            </div>

          </div>

          <div className="form-section">
            <h3>Dados {formData.id_tipo_pessoa === 1 ? 'da Empresa' : 'Pessoais'}</h3>
            
            <div className="form-group">
              <label htmlFor="nome_razao_social">
                {formData.id_tipo_pessoa === 1 ? 'Razão Social' : 'Nome Completo'} *
              </label>
              <input
                type="text"
                id="nome_razao_social"
                name="nome_razao_social"
                value={formData.nome_razao_social}
                onChange={handleChange}
                className={errors.nome_razao_social ? 'error' : ''}
                required
              />
              {errors.nome_razao_social && <span className="error-message">{errors.nome_razao_social}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="apelido_nome_fantasia">
                {formData.id_tipo_pessoa === 1 ? 'Nome Fantasia' : 'Apelido'}
              </label>
              <input
                type="text"
                id="apelido_nome_fantasia"
                name="apelido_nome_fantasia"
                value={formData.apelido_nome_fantasia}
                onChange={handleChange}
              />
            </div>

            {formData.id_tipo_pessoa === 1 ? (
              <>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="cnpj">CNPJ</label>
                    <input
                      type="text"
                      id="cnpj"
                      name="cnpj"
                      value={formData.cnpj}
                      onChange={handleCNPJChange}
                      maxLength="18"
                      className={errors.cnpj ? 'error' : ''}
                    />
                    {errors.cnpj && <span className="error-message">{errors.cnpj}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="inscricao_estadual">Inscrição Estadual</label>
                    <input
                      type="text"
                      id="inscricao_estadual"
                      name="inscricao_estadual"
                      value={formData.inscricao_estadual}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="cpf">CPF</label>
                    <input
                      type="text"
                      id="cpf"
                      name="cpf"
                      value={formData.cpf}
                      onChange={handleCPFChange}
                      maxLength="14"
                      className={errors.cpf ? 'error' : ''}
                    />
                    {errors.cpf && <span className="error-message">{errors.cpf}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="data_nascimento">Data de Nascimento</label>
                    <input
                      type="date"
                      id="data_nascimento"
                      name="data_nascimento"
                      value={formData.data_nascimento}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </>
            )}

            <div className="form-row form-row--state-city">
              <div className="form-group">
                <label htmlFor="telefone">Telefone</label>
                <input
                  type="text"
                  id="telefone"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleTelefoneChange}
                  maxLength="15"
                  className={errors.telefone ? 'error' : ''}
                  required
                />
                {errors.telefone && <span className="error-message">{errors.telefone}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? 'error' : ''}
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Endereço</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="cep">CEP</label>
                <input
                  type="text"
                  id="cep"
                  name="cep"
                  value={formData.cep}
                  onChange={handleCEPChange}
                  onBlur={handleCEPBlur}
                  maxLength="9"
                />
              </div>

              <div className="form-group">
                <label htmlFor="logradouro">Logradouro</label>
                <input
                  type="text"
                  id="logradouro"
                  name="logradouro"
                  value={formData.logradouro}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="numero">N°</label>
                <input
                  type="text"
                  id="numero"
                  name="numero"
                  value={formData.numero}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="complemento">Complemento</label>
                <input
                  type="text"
                  id="complemento"
                  name="complemento"
                  value={formData.complemento}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="bairro">Bairro</label>
                <input
                  type="text"
                  id="bairro"
                  name="bairro"
                  value={formData.bairro}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="id_uf">UF - Estado</label>
                <select
                  id="id_uf"
                  name="id_uf"
                  value={formData.id_uf}
                  onChange={handleChange}
                  className={errors.id_uf ? 'error' : ''}
                >
                  <option value="">Selecione a UF - Estado</option>
                  {ufs.map((uf) => (
                    <option key={uf.id_estado} value={uf.id_estado}>
                      {uf.uf + ' - ' + uf.estado}
                    </option>
                  ))}
                </select>
                {errors.id_uf && <span className="error-message">{errors.id_uf}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="id_cidade">Cidade</label>
                <select
                  id="id_cidade"
                  name="id_cidade"
                  value={formData.id_cidade}
                  onChange={handleChange}
                  className={errors.id_cidade ? 'error' : ''}
                >
                  <option value="">Selecione a Cidade</option>
                  {cidades.map((cidade) => (
                    <option key={cidade.id_cidade} value={cidade.id_cidade}>
                      {cidade.cidade}
                    </option>
                  ))}
                </select>
                {errors.id_cidade && <span className="error-message">{errors.id_cidade}</span>}
              </div>
            </div>
          </div>

          

          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={handleClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Alterar_pessoa;