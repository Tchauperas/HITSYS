import React, { useState, useEffect } from "react";
import "./Cadastro_produto.css";

function CadastroProduto({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    codigo: "",
    cod_barras: "",
    descricao: "",
    preco_custo: "",
    margem_lucro: "",
    preco_venda: "",
    id_unidade_medida: "",
    saldo_estoque: "",
    id_grupo: "",
    id_secao: "",
    id_marca: "",
    ativo: true,
  });

  const [grupos, setGrupos] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [secoes, setSecoes] = useState([]);
  const [unidades, setUnidades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch Grupos, Marcas, Seções e Unidades on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Grupos
        const gruposResponse = await fetch("http://127.0.0.1:3000/grupos/visualizar");
        const gruposData = await gruposResponse.json();
        if (gruposData.success) {
          setGrupos(gruposData.values);
        }

        // Fetch Marcas
        const marcasResponse = await fetch("http://127.0.0.1:3000/marcas/visualizar");
        const marcasData = await marcasResponse.json();
        if (marcasData.success) {
          setMarcas(marcasData.values);
        }

        // Fetch Seções
        const secoesResponse = await fetch("http://127.0.0.1:3000/secoes/visualizar");
        const secoesData = await secoesResponse.json();
        if (secoesData.success) {
          setSecoes(secoesData.values);
        }

        // Fetch Unidades
        const unidadesResponse = await fetch("http://127.0.0.1:3000/unidades/visualizar");
        const unidadesData = await unidadesResponse.json();
        if (unidadesData.success) {
          setUnidades(unidadesData.values);
        }
      } catch (error) {
        setMessage(`Erro ao carregar dados: ${error.message}`);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Calcular preço de venda automaticamente quando custo ou margem mudar
  useEffect(() => {
    if (formData.preco_custo && formData.margem_lucro) {
      const custo = parseFloat(formData.preco_custo);
      const margem = parseFloat(formData.margem_lucro);
      if (!isNaN(custo) && !isNaN(margem)) {
        const precoVenda = custo + (custo * margem / 100);
        setFormData(prev => ({ ...prev, preco_venda: precoVenda.toFixed(2) }));
      }
    }
  }, [formData.preco_custo, formData.margem_lucro]);

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
      preco_custo: parseFloat(formData.preco_custo),
      margem_lucro: parseFloat(formData.margem_lucro),
      preco_venda: parseFloat(formData.preco_venda),
      saldo_estoque: parseFloat(formData.saldo_estoque) || 0,
      id_unidade_medida: parseInt(formData.id_unidade_medida),
      id_grupo: parseInt(formData.id_grupo),
      id_secao: parseInt(formData.id_secao),
      id_marca: parseInt(formData.id_marca),
      ultima_alteracao: new Date().toISOString().split('T')[0], 
    };

    try {
      const response = await fetch("http://127.0.0.1:3000/produtos/cadastrar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSend),
      });

      const data = await response.json();

      if (data.success) {
        setMessage("Produto cadastrado com sucesso!");
        setFormData({
          codigo: "",
          cod_barras: "",
          descricao: "",
          preco_custo: "",
          margem_lucro: "",
          preco_venda: "",
          id_unidade_medida: "",
          saldo_estoque: "",
          id_grupo: "",
          id_secao: "",
          id_marca: "",
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
        setMessage(`Erro ao cadastrar produto: ${data.message}`);
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
          <h1>Cadastro de Produto</h1>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            <input
              type="text"
              name="codigo"
              placeholder="Código"
              value={formData.codigo}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="cod_barras"
              placeholder="Código de Barras"
              value={formData.cod_barras}
              onChange={handleChange}
            />
          </div>

          <input
            type="text"
            name="descricao"
            placeholder="Descrição do Produto"
            value={formData.descricao}
            onChange={handleChange}
            required
          />

          <div className="form-row">
            <input
              type="number"
              step="0.01"
              name="preco_custo"
              placeholder="Preço de Custo"
              value={formData.preco_custo}
              onChange={handleChange}
              required
            />
            <input
              type="number"
              step="0.01"
              name="margem_lucro"
              placeholder="Margem de Lucro (%)"
              value={formData.margem_lucro}
              onChange={handleChange}
              required
            />
          </div>

          <input
            type="number"
            step="0.01"
            name="preco_venda"
            placeholder="Preço de Venda"
            value={formData.preco_venda}
            onChange={handleChange}
            required
            readOnly
          />

          <div className="form-row">
            <select
              name="id_unidade_medida"
              value={formData.id_unidade_medida}
              onChange={handleChange}
              required
            >
              <option value="">Selecione a Unidade</option>
              {unidades.map((unidade) => (
                <option key={unidade.id_unidade_medida} value={unidade.id_unidade_medida}>
                  {unidade.sigla} - {unidade.descricao}
                </option>
              ))}
            </select>

            <input
              type="number"
              step="0.01"
              name="saldo_estoque"
              placeholder="Saldo em Estoque"
              value={formData.saldo_estoque}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <select
              name="id_grupo"
              value={formData.id_grupo}
              onChange={handleChange}
              required
            >
              <option value="">Selecione o Grupo</option>
              {grupos.map((grupo) => (
                <option key={grupo.id_grupo} value={grupo.id_grupo}>
                  {grupo.descricao}
                </option>
              ))}
            </select>

            <select
              name="id_secao"
              value={formData.id_secao}
              onChange={handleChange}
              required
            >
              <option value="">Selecione a Seção</option>
              {secoes.map((secao) => (
                <option key={secao.id_secao} value={secao.id_secao}>
                  {secao.descricao}
                </option>
              ))}
            </select>
          </div>

          <select
            name="id_marca"
            value={formData.id_marca}
            onChange={handleChange}
            required
          >
            <option value="">Selecione a Marca</option>
            {marcas.map((marca) => (
              <option key={marca.id_marca} value={marca.id_marca}>
                {marca.descricao}
              </option>
            ))}
          </select>

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
            Produto Ativo
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

export default CadastroProduto;
