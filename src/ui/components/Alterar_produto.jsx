import React, { useState, useEffect } from "react";
import "./Alterar_produto.css";

const Alterar_produto = ({ isOpen, onClose, produto, onUpdate }) => {
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
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

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
        console.error("Erro ao carregar dados:", error);
      }
    };

    fetchData();
  }, []);

  // Carregar dados do produto
  useEffect(() => {
    if (produto) {
      setFormData({
        codigo: produto.codigo || "",
        cod_barras: produto.cod_barras || "",
        descricao: produto.descricao || "",
        preco_custo: produto.preco_custo || "",
        margem_lucro: produto.margem_lucro || "",
        preco_venda: produto.preco_venda || "",
        id_unidade_medida: produto.id_unidade_medida || "",
        saldo_estoque: produto.saldo_estoque || "",
        id_grupo: produto.id_grupo || "",
        id_secao: produto.id_secao || "",
        id_marca: produto.id_marca || "",
        ativo: produto.ativo === 1 || produto.ativo === true,
      });
    }
  }, [produto]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Calcular preço de venda automaticamente quando custo ou margem mudar
  useEffect(() => {
    if (formData.preco_custo && formData.margem_lucro) {
      const custo = parseFloat(formData.preco_custo);
      const margem = parseFloat(formData.margem_lucro);
      if (!isNaN(custo) && !isNaN(margem)) {
        const precoVenda = custo + (custo * margem) / 100;
        setFormData((prev) => ({ ...prev, preco_venda: precoVenda.toFixed(2) }));
      }
    }
  }, [formData.preco_custo, formData.margem_lucro]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.codigo.trim()) {
      newErrors.codigo = "Código é obrigatório";
    }

    if (!formData.descricao.trim()) {
      newErrors.descricao = "Descrição é obrigatória";
    }

    if (!formData.preco_custo || parseFloat(formData.preco_custo) <= 0) {
      newErrors.preco_custo = "Preço de custo deve ser maior que zero";
    }

    if (!formData.margem_lucro || parseFloat(formData.margem_lucro) < 0) {
      newErrors.margem_lucro = "Margem de lucro deve ser maior ou igual a zero";
    }

    if (!formData.preco_venda || parseFloat(formData.preco_venda) <= 0) {
      newErrors.preco_venda = "Preço de venda deve ser maior que zero";
    }

    if (!formData.id_unidade_medida) {
      newErrors.id_unidade_medida = "Unidade de medida é obrigatória";
    }

    if (!formData.id_grupo) {
      newErrors.id_grupo = "Grupo é obrigatório";
    }

    if (!formData.id_secao) {
      newErrors.id_secao = "Seção é obrigatória";
    }

    if (!formData.id_marca) {
      newErrors.id_marca = "Marca é obrigatória";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const dataToSend = {
        id_produto: produto.id_produto,
        codigo: formData.codigo,
        cod_barras: formData.cod_barras,
        descricao: formData.descricao,
        preco_custo: parseFloat(formData.preco_custo),
        margem_lucro: parseFloat(formData.margem_lucro),
        preco_venda: parseFloat(formData.preco_venda),
        id_unidade_medida: parseInt(formData.id_unidade_medida),
        saldo_estoque: parseFloat(formData.saldo_estoque) || 0,
        id_grupo: parseInt(formData.id_grupo),
        id_secao: parseInt(formData.id_secao),
        id_marca: parseInt(formData.id_marca),
        ativo: formData.ativo ? 1 : 0,
        ultima_alteracao: new Date().toISOString().split("T")[0],
      };

      await onUpdate(dataToSend);
    } catch (error) {
      console.error("Erro ao atualizar produto:", error);
      alert("Erro ao atualizar produto. Tente novamente.");
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
          <h2>Alterar Produto</h2>
          <button className="close-button" onClick={handleClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <h3>Identificação</h3>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="codigo">Código *</label>
                <input
                  type="text"
                  id="codigo"
                  name="codigo"
                  value={formData.codigo}
                  onChange={handleChange}
                  className={errors.codigo ? "error" : ""}
                  required
                />
                {errors.codigo && (
                  <span className="error-message">{errors.codigo}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="cod_barras">Código de Barras</label>
                <input
                  type="text"
                  id="cod_barras"
                  name="cod_barras"
                  value={formData.cod_barras}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="descricao">Descrição *</label>
              <input
                type="text"
                id="descricao"
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                className={errors.descricao ? "error" : ""}
                required
              />
              {errors.descricao && (
                <span className="error-message">{errors.descricao}</span>
              )}
            </div>
          </div>

          <div className="form-section">
            <h3>Preços e Estoque</h3>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="preco_custo">Preço de Custo *</label>
                <input
                  type="number"
                  step="0.01"
                  id="preco_custo"
                  name="preco_custo"
                  value={formData.preco_custo}
                  onChange={handleChange}
                  className={errors.preco_custo ? "error" : ""}
                  required
                />
                {errors.preco_custo && (
                  <span className="error-message">{errors.preco_custo}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="margem_lucro">Margem de Lucro (%) *</label>
                <input
                  type="number"
                  step="0.01"
                  id="margem_lucro"
                  name="margem_lucro"
                  value={formData.margem_lucro}
                  onChange={handleChange}
                  className={errors.margem_lucro ? "error" : ""}
                  required
                />
                {errors.margem_lucro && (
                  <span className="error-message">{errors.margem_lucro}</span>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="preco_venda">Preço de Venda *</label>
                <input
                  type="number"
                  step="0.01"
                  id="preco_venda"
                  name="preco_venda"
                  value={formData.preco_venda}
                  onChange={handleChange}
                  className={errors.preco_venda ? "error" : ""}
                  required
                  readOnly
                />
                {errors.preco_venda && (
                  <span className="error-message">{errors.preco_venda}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="saldo_estoque">Saldo em Estoque</label>
                <input
                  type="number"
                  step="0.01"
                  id="saldo_estoque"
                  name="saldo_estoque"
                  value={formData.saldo_estoque}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Classificação</h3>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="id_unidade_medida">Unidade de Medida *</label>
                <select
                  id="id_unidade_medida"
                  name="id_unidade_medida"
                  value={formData.id_unidade_medida}
                  onChange={handleChange}
                  className={errors.id_unidade_medida ? "error" : ""}
                  required
                >
                  <option value="">Selecione a Unidade</option>
                  {unidades.map((unidade) => (
                    <option
                      key={unidade.id_unidade_medida}
                      value={unidade.id_unidade_medida}
                    >
                      {unidade.sigla} - {unidade.descricao}
                    </option>
                  ))}
                </select>
                {errors.id_unidade_medida && (
                  <span className="error-message">
                    {errors.id_unidade_medida}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="id_grupo">Grupo *</label>
                <select
                  id="id_grupo"
                  name="id_grupo"
                  value={formData.id_grupo}
                  onChange={handleChange}
                  className={errors.id_grupo ? "error" : ""}
                  required
                >
                  <option value="">Selecione o Grupo</option>
                  {grupos.map((grupo) => (
                    <option key={grupo.id_grupo} value={grupo.id_grupo}>
                      {grupo.descricao}
                    </option>
                  ))}
                </select>
                {errors.id_grupo && (
                  <span className="error-message">{errors.id_grupo}</span>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="id_secao">Seção *</label>
                <select
                  id="id_secao"
                  name="id_secao"
                  value={formData.id_secao}
                  onChange={handleChange}
                  className={errors.id_secao ? "error" : ""}
                  required
                >
                  <option value="">Selecione a Seção</option>
                  {secoes.map((secao) => (
                    <option key={secao.id_secao} value={secao.id_secao}>
                      {secao.descricao}
                    </option>
                  ))}
                </select>
                {errors.id_secao && (
                  <span className="error-message">{errors.id_secao}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="id_marca">Marca *</label>
                <select
                  id="id_marca"
                  name="id_marca"
                  value={formData.id_marca}
                  onChange={handleChange}
                  className={errors.id_marca ? "error" : ""}
                  required
                >
                  <option value="">Selecione a Marca</option>
                  {marcas.map((marca) => (
                    <option key={marca.id_marca} value={marca.id_marca}>
                      {marca.descricao}
                    </option>
                  ))}
                </select>
                {errors.id_marca && (
                  <span className="error-message">{errors.id_marca}</span>
                )}
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
                    setFormData((prev) => ({ ...prev, ativo: e.target.checked }))
                  }
                />
                Produto Ativo
              </label>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={handleClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? "Salvando..." : "Salvar Alterações"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Alterar_produto;
