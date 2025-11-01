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
      // Determina o tipo de pessoa (1 = Jurídica, 2 = Física)
      const tipoPessoa = pessoa.cnpj ? 1 : 2;

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
    const tipo = parseInt(e.target.value);
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

    if (formData.id_tipo_pessoa === 1) {
      if (!formData.cnpj.trim()) {
        newErrors.cnpj = 'CNPJ é obrigatório';
      } else if (formData.cnpj.replace(/\D/g, '').length !== 14) {
        newErrors.cnpj = 'CNPJ inválido';
      }
    } else {
      if (!formData.cpf.trim()) {
        newErrors.cpf = 'CPF é obrigatório';
      } else if (formData.cpf.replace(/\D/g, '').length !== 11) {
        newErrors.cpf = 'CPF inválido';
      }
    }

    if (!formData.telefone.trim()) {
      newErrors.telefone = 'Telefone é obrigatório';
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.id_uf) {
      newErrors.id_uf = 'Estado é obrigatório';
    }

    if (!formData.id_cidade) {
      newErrors.id_cidade = 'Cidade é obrigatória';
    }

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

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Alterar Pessoa</h2>
          <button className="close-button" onClick={handleClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <h3>Tipo de Pessoa</h3>
            
            <div className="form-group">
              <label htmlFor="id_tipo_pessoa">Tipo *</label>
              <select
                id="id_tipo_pessoa"
                name="id_tipo_pessoa"
                value={formData.id_tipo_pessoa}
                onChange={handleTipoPessoaChange}
                required
              >
                <option value={1}>Pessoa Jurídica</option>
                <option value={2}>Pessoa Física</option>
              </select>
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
                    <label htmlFor="cnpj">CNPJ *</label>
                    <input
                      type="text"
                      id="cnpj"
                      name="cnpj"
                      value={formData.cnpj}
                      onChange={handleCNPJChange}
                      maxLength="18"
                      className={errors.cnpj ? 'error' : ''}
                      required
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
                    <label htmlFor="cpf">CPF *</label>
                    <input
                      type="text"
                      id="cpf"
                      name="cpf"
                      value={formData.cpf}
                      onChange={handleCPFChange}
                      maxLength="14"
                      className={errors.cpf ? 'error' : ''}
                      required
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

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="telefone">Telefone *</label>
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
                <label htmlFor="cep">CEP *</label>
                <input
                  type="text"
                  id="cep"
                  name="cep"
                  value={formData.cep}
                  onChange={handleCEPChange}
                  onBlur={handleCEPBlur}
                  maxLength="9"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="logradouro">Logradouro *</label>
                <input
                  type="text"
                  id="logradouro"
                  name="logradouro"
                  value={formData.logradouro}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="numero">Número *</label>
                <input
                  type="text"
                  id="numero"
                  name="numero"
                  value={formData.numero}
                  onChange={handleChange}
                  required
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
                <label htmlFor="bairro">Bairro *</label>
                <input
                  type="text"
                  id="bairro"
                  name="bairro"
                  value={formData.bairro}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="id_uf">Estado *</label>
                <select
                  id="id_uf"
                  name="id_uf"
                  value={formData.id_uf}
                  onChange={handleChange}
                  className={errors.id_uf ? 'error' : ''}
                  required
                >
                  <option value="">Selecione o Estado</option>
                  {ufs.map((uf) => (
                    <option key={uf.id_estado} value={uf.id_estado}>
                      {uf.estado}
                    </option>
                  ))}
                </select>
                {errors.id_uf && <span className="error-message">{errors.id_uf}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="id_cidade">Cidade *</label>
                <select
                  id="id_cidade"
                  name="id_cidade"
                  value={formData.id_cidade}
                  onChange={handleChange}
                  className={errors.id_cidade ? 'error' : ''}
                  required
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

          <div className="form-section">
            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  name="ativo"
                  checked={formData.ativo}
                  onChange={(e) =>
                    setFormData(prev => ({ ...prev, ativo: e.target.checked }))
                  }
                />
                Pessoa Ativa
              </label>
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