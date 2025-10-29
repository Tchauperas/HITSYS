import React, { useState, useEffect } from "react";
import "./Cadastro_empresa.css";

function CadastroEmpresa({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    razao_social: "",
    nome_fantasia: "",
    cnpj: "",
    inscricao_estadual: "",
    logradouro: "",
    numero: "",
    complemento: "",
    bairro: "",
    cep: "",
    id_cidade: "",
    id_uf: "",
    telefone: "",
    email: "",
    ativa: true,
  });

  const [ufs, setUfs] = useState([]);
  const [cidades, setCidades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch UFs on component mount
  useEffect(() => {
    const fetchUfs = async () => {
      try {
        const response = await fetch("http://127.0.0.1:3000/estados/estados");
        const data = await response.json();
        if (data.success) {
          // Ajuste para armazenar os estados diretamente
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
            `http://127.0.0.1:3000/cidades/cidades?uf=${formData.id_uf}`
          );
          const data = await response.json();
          if (data.success) {
            // Ajuste para armazenar as cidades diretamente
            setCidades(data.values); 
          } else {
            setCidades([]); // Garante que cidades seja um array vazio em caso de erro
            setMessage("Erro ao carregar cidades.");
          }
        } catch (error) {
          setCidades([]); // Garante que cidades seja um array vazio em caso de erro
          setMessage(`Erro ao conectar com o servidor: ${error.message}`);
        }
      };

      fetchCidades();
    } else {
      setCidades([]); // Reseta cidades se nenhuma UF estiver selecionada
    }
  }, [formData.id_uf]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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

    try {
      const response = await fetch("http://127.0.0.1:3000/empresas/cadastrar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setMessage("Empresa cadastrada com sucesso!");
        setFormData({
          razao_social: "",
          nome_fantasia: "",
          cnpj: "",
          inscricao_estadual: "",
          logradouro: "",
          numero: "",
          complemento: "",
          bairro: "",
          cep: "",
          id_cidade: "",
          id_uf: "",
          telefone: "",
          email: "",
          ativa: true,
        });

        // Notifica o componente pai e fecha o modal após 2 segundos
        if (onSuccess) {
          onSuccess();
        }
      } else {
        setMessage(`Erro ao cadastrar empresa: ${data.message}`);
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
          <h1>Cadastro de Empresa</h1>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <input
            type="text"
            name="razao_social"
            placeholder="Razão Social"
            value={formData.razao_social}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="nome_fantasia"
            placeholder="Nome Fantasia"
            value={formData.nome_fantasia}
            onChange={handleChange}
            required
          />
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
              name="ativa"
              className="checkbox"
              checked={formData.ativa}
              onChange={(e) =>
                setFormData({ ...formData, ativa: e.target.checked })
              }
            />
            Empresa Ativa
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

export default CadastroEmpresa;
