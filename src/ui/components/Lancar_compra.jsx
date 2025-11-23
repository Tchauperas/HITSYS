import React, { useState, useEffect } from "react";
import "./Lancar_compra.css";

function LancarCompra({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    id_empresa: 1,
    num_compra: "",
    data_compra: new Date().toISOString().split('T')[0],
    id_fornecedor: "",
    id_usuario_lancamento: 1,
    id_status_compra: 1,
    outros_custos: "0.00",
    margem_total_desconto: "0.00",
    observacoes_compra: "",
    observacoes_internas: "",
    cancelada: false
  });

  const [itens, setItens] = useState([]);
  const [fornecedores, setFornecedores] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [unidades, setUnidades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProdutos, setFilteredProdutos] = useState([]);
  const [showProdutosList, setShowProdutosList] = useState(false);
  const [currentItemIndex, setCurrentItemIndex] = useState(null);

  // Buscar dados iniciais
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("userData"))?.token;
        
        // Buscar fornecedores (pessoas do tipo fornecedor)
        const fornecedoresResponse = await fetch("http://127.0.0.1:3000/pessoas/visualizar", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const fornecedoresData = await fornecedoresResponse.json();
        if (fornecedoresData.success) {
          // Filtrar apenas fornecedores (ID 2 na tabela tipos_cadastros)
          const fornecedoresFiltrados = fornecedoresData.values.filter(pessoa => 
            pessoa.tipos_cadastros && pessoa.tipos_cadastros.includes(2)
          );
          setFornecedores(fornecedoresFiltrados);
        }

        // Buscar produtos
        const produtosResponse = await fetch("http://127.0.0.1:3000/produtos/visualizar", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const produtosData = await produtosResponse.json();
        if (produtosData.success) {
          setProdutos(produtosData.values);
        }

        // Buscar unidades de medida
        const unidadesResponse = await fetch("http://127.0.0.1:3000/unidades/visualizar", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const unidadesData = await unidadesResponse.json();
        if (unidadesData.success) {
          setUnidades(unidadesData.values);
        }

        // Buscar próximo número de compra
        await fetchProximoNumeroCompra();
      } catch (error) {
        setMessage(`Erro ao carregar dados: ${error.message}`);
      }
    };

    fetchData();
  }, []);

  const fetchProximoNumeroCompra = async (dataCompra = null) => {
    try {
      const token = JSON.parse(localStorage.getItem("userData"))?.token;
      const data = dataCompra || formData.data_compra;
      const url = `http://127.0.0.1:3000/compras/proximo-numero?data_compra=${data}`;
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const responseData = await response.json();
      if (responseData.success && responseData.proximoNumero) {
        setFormData(prev => ({ ...prev, num_compra: responseData.proximoNumero }));
      }
    } catch (error) {
      console.error("Erro ao buscar próximo número:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Atualizar número da compra quando a data mudar
    if (name === 'data_compra') {
      fetchProximoNumeroCompra(value);
    }
  };

  const adicionarItem = () => {
    const novoItem = {
      id: Date.now(),
      id_produto_referenciado: "",
      codigo: "",
      descricao: "",
      codigo_fornecedor: "",
      descricao_fornecedor: "",
      quantidade_compra: "0.000",
      und_compra: "",
      quantidade_convertida: "0.000",
      und_venda: "",
      custo_und_compra: "0.00",
      custo_compra: "0.00",
      custo_unitario: "0.00",
      margem_desconto: "0.00",
      valor_desconto: "0.00",
      margem_lucro: "0.00",
      preco_venda: "0.00"
    };
    setItens([...itens, novoItem]);
  };

  const removerItem = (id) => {
    setItens(itens.filter(item => item.id !== id));
  };

  const handleItemChange = (id, field, value) => {
    setItens(itens.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };

        // Recalcular valores automaticamente
        if (field === 'quantidade_compra' || field === 'custo_und_compra') {
          const qtd = parseFloat(updatedItem.quantidade_compra) || 0;
          const custo = parseFloat(updatedItem.custo_und_compra) || 0;
          updatedItem.custo_compra = (qtd * custo).toFixed(2);
          updatedItem.custo_unitario = custo.toFixed(2);
          updatedItem.quantidade_convertida = qtd.toFixed(3);
        }

        if (field === 'margem_desconto' || field === 'custo_compra') {
          const custoCompra = parseFloat(updatedItem.custo_compra) || 0;
          const margemDesc = parseFloat(updatedItem.margem_desconto) || 0;
          updatedItem.valor_desconto = (custoCompra * margemDesc / 100).toFixed(2);
        }

        if (field === 'margem_lucro' || field === 'custo_unitario') {
          const custoUnit = parseFloat(updatedItem.custo_unitario) || 0;
          const margemLucro = parseFloat(updatedItem.margem_lucro) || 0;
          updatedItem.preco_venda = (custoUnit + (custoUnit * margemLucro / 100)).toFixed(2);
        }

        return updatedItem;
      }
      return item;
    }));
  };

  const handleProdutoSearch = (id, value) => {
    // Atualiza o campo de descrição do item para permitir digitação livre
    handleItemChange(id, 'descricao', value);
    setSearchTerm(value);
    setCurrentItemIndex(id);
    
    if (value.length > 0) {
      const filtered = produtos.filter(p => 
        p.codigo.toLowerCase().includes(value.toLowerCase()) ||
        p.descricao.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredProdutos(filtered);
      setShowProdutosList(true);
    } else {
      setShowProdutosList(false);
    }
  };

  const selecionarProduto = (produto) => {
    const unidade = unidades.find(u => u.id_unidade_medida === produto.id_unidade_medida);
    
    setItens(itens.map(item => {
      if (item.id === currentItemIndex) {
        return {
          ...item,
          id_produto_referenciado: produto.id_produto,
          codigo: produto.codigo,
          descricao: produto.descricao,
          und_compra: unidade?.sigla || "",
          und_venda: unidade?.sigla || "",
          custo_unitario: parseFloat(produto.preco_custo).toFixed(2),
          custo_und_compra: parseFloat(produto.preco_custo).toFixed(2),
          margem_lucro: parseFloat(produto.margem_lucro).toFixed(2),
          preco_venda: parseFloat(produto.preco_venda).toFixed(2)
        };
      }
      return item;
    }));

    setShowProdutosList(false);
    setSearchTerm("");
    setCurrentItemIndex(null);
  };

  const calcularTotais = () => {
    const totalProdutos = itens.reduce((sum, item) => 
      sum + parseFloat(item.custo_compra || 0), 0
    );
    
    const totalDesconto = itens.reduce((sum, item) => 
      sum + parseFloat(item.valor_desconto || 0), 0
    );

    const outrosCustos = parseFloat(formData.outros_custos) || 0;
    const totalCompra = totalProdutos + outrosCustos - totalDesconto;

    return {
      totalProdutos: totalProdutos.toFixed(2),
      totalDesconto: totalDesconto.toFixed(2),
      totalCompra: totalCompra.toFixed(2)
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.id_fornecedor) {
      setMessage("Selecione um fornecedor!");
      return;
    }

    if (itens.length === 0) {
      setMessage("Adicione pelo menos um item!");
      return;
    }

    setLoading(true);
    setMessage("");

    const totais = calcularTotais();
    
    const dataToSend = {
      pedido: {
        id_empresa: parseInt(formData.id_empresa),
        num_compra: formData.num_compra,
        data_compra: formData.data_compra,
        id_fornecedor: parseInt(formData.id_fornecedor),
        id_usuario_lancamento: parseInt(formData.id_usuario_lancamento),
        id_status_compra: parseInt(formData.id_status_compra),
        total_produtos: parseFloat(totais.totalProdutos),
        outros_custos: parseFloat(formData.outros_custos),
        margem_total_desconto: parseFloat(formData.margem_total_desconto),
        total_desconto: parseFloat(totais.totalDesconto),
        total_compra: parseFloat(totais.totalCompra),
        observacoes_compra: formData.observacoes_compra,
        observacoes_internas: formData.observacoes_internas,
        cancelada: formData.cancelada
      },
      itens: itens.map(item => ({
        id_produto_referenciado: parseInt(item.id_produto_referenciado),
        codigo: item.codigo,
        descricao: item.descricao,
        codigo_fornecedor: item.codigo_fornecedor,
        descricao_fornecedor: item.descricao_fornecedor,
        quantidade_compra: parseFloat(item.quantidade_compra),
        und_compra: item.und_compra,
        quantidade_convertida: parseFloat(item.quantidade_convertida),
        und_venda: item.und_venda,
        custo_und_compra: parseFloat(item.custo_und_compra),
        custo_compra: parseFloat(item.custo_compra),
        custo_unitario: parseFloat(item.custo_unitario),
        margem_desconto: parseFloat(item.margem_desconto),
        valor_desconto: parseFloat(item.valor_desconto),
        margem_lucro: parseFloat(item.margem_lucro),
        preco_venda: parseFloat(item.preco_venda)
      }))
    };

    try {
      const token = JSON.parse(localStorage.getItem("userData"))?.token;
      
      if (!token) {
        setMessage("Token não encontrado. Faça login novamente.");
        setLoading(false);
        return;
      }

      const response = await fetch("http://127.0.0.1:3000/compras/lancar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSend),
      });

      const data = await response.json();

      if (data.success) {
        setMessage(`Compra #${data.num_compra} lançada com sucesso!`);
        setTimeout(() => {
          if (onSuccess) onSuccess();
          onClose();
        }, 2000);
      } else {
        setMessage(`Erro ao lançar compra: ${data.message}`);
      }
    } catch (error) {
      setMessage(`Erro ao conectar com o servidor: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const totais = calcularTotais();

  return (
    <div className="modal-overlay-lancar-compra" onClick={onClose}>
      <div className="modal-content-lancar-compra" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-lancar-compra">
          <h2>Lançar Nova Compra</h2>
          <button className="modal-close-lancar-compra" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', height: 'calc(100% - 80px)', overflow: 'hidden' }}>
          <div className="modal-body-lancar-compra" style={{ 
            flex: 1, 
            overflowY: 'auto', 
            overflowX: 'hidden',
            padding: '30px'
          }}>
            {/* Informações da Compra */}
            <div className="section-compra">
              <h3>Dados da Compra</h3>
              <div className="form-grid">
              <div className="form-group">
                <label>Número da Compra *</label>
                <input
                  type="text"
                  name="num_compra"
                  value={formData.num_compra}
                  onChange={handleChange}
                  required
                />
              </div>                <div className="form-group">
                  <label>Data da Compra *</label>
                  <input
                    type="date"
                    name="data_compra"
                    value={formData.data_compra}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group full-width">
                  <label>Fornecedor *</label>
                  <select
                    name="id_fornecedor"
                    value={formData.id_fornecedor}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Selecione um fornecedor</option>
                    {fornecedores.map(fornecedor => (
                      <option key={fornecedor.id_pessoa} value={fornecedor.id_pessoa}>
                        {fornecedor.nome_razao_social || fornecedor.apelido_nome_fantasia}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Outros Custos</label>
                  <input
                    type="number"
                    name="outros_custos"
                    value={formData.outros_custos}
                    onChange={handleChange}
                    step="0.01"
                  />
                </div>

                <div className="form-group">
                  <label>Margem Desconto Total (%)</label>
                  <input
                    type="number"
                    name="margem_total_desconto"
                    value={formData.margem_total_desconto}
                    onChange={handleChange}
                    step="0.01"
                  />
                </div>
              </div>
            </div>

            {/* Itens da Compra */}
            <div className="section-compra">
              <div className="section-header">
                <h3>Itens da Compra</h3>
                <button type="button" className="btn-add-item" onClick={adicionarItem}>
                  + Adicionar Item
                </button>
              </div>

              <div className="items-table-container">
                <table className="items-table-lancar">
                  <thead>
                    <tr>
                      <th>Produto</th>
                      <th>Cód. Forn.</th>
                      <th>Desc. Forn.</th>
                      <th>Qtd</th>
                      <th>Und</th>
                      <th>Custo Unit.</th>
                      <th>% Desc</th>
                      <th>Desc.</th>
                      <th>% Lucro</th>
                      <th>Total</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {itens.length === 0 ? (
                      <tr>
                        <td colSpan="11" className="text-center">Nenhum item adicionado</td>
                      </tr>
                    ) : (
                      itens.map(item => (
                        <tr key={item.id}>
                          <td>
                            <div className="produto-search">
                              <input
                                type="text"
                                value={item.descricao}
                                onChange={(e) => handleProdutoSearch(item.id, e.target.value)}
                                placeholder="Buscar produto..."
                                className="input-produto"
                              />
                              {showProdutosList && currentItemIndex === item.id && filteredProdutos.length > 0 && (
                                <div className="produtos-list">
                                  {filteredProdutos.map(prod => (
                                    <div
                                      key={prod.id_produto}
                                      className="produto-item"
                                      onMouseDown={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        selecionarProduto(prod);
                                      }}
                                    >
                                      {prod.codigo} - {prod.descricao}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </td>
                          <td>
                            <input
                              type="text"
                              value={item.codigo_fornecedor}
                              onChange={(e) => handleItemChange(item.id, 'codigo_fornecedor', e.target.value)}
                              className="input-small"
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              value={item.descricao_fornecedor}
                              onChange={(e) => handleItemChange(item.id, 'descricao_fornecedor', e.target.value)}
                              className="input-medium"
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              value={item.quantidade_compra}
                              onChange={(e) => handleItemChange(item.id, 'quantidade_compra', e.target.value)}
                              step="0.001"
                              className="input-small"
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              value={item.und_compra}
                              readOnly
                              className="input-tiny"
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              value={item.custo_und_compra}
                              onChange={(e) => handleItemChange(item.id, 'custo_und_compra', e.target.value)}
                              step="0.01"
                              className="input-small"
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              value={item.margem_desconto}
                              onChange={(e) => handleItemChange(item.id, 'margem_desconto', e.target.value)}
                              step="0.01"
                              className="input-tiny"
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              value={item.valor_desconto}
                              readOnly
                              className="input-small"
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              value={item.margem_lucro}
                              onChange={(e) => handleItemChange(item.id, 'margem_lucro', e.target.value)}
                              step="0.01"
                              className="input-tiny"
                            />
                          </td>
                          <td className="total-cell">
                            R$ {parseFloat(item.custo_compra).toFixed(2)}
                          </td>
                          <td>
                            <button
                              type="button"
                              className="btn-remove-item"
                              onClick={() => removerItem(item.id)}
                              title="Remover"
                            >
                              🗑️
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Totais */}
            <div className="section-compra totals-section">
              <div className="totals-display">
                <div className="total-item-display">
                  <span>Total Produtos:</span>
                  <strong>R$ {totais.totalProdutos}</strong>
                </div>
                <div className="total-item-display">
                  <span>Outros Custos:</span>
                  <strong>R$ {parseFloat(formData.outros_custos).toFixed(2)}</strong>
                </div>
                <div className="total-item-display desconto">
                  <span>Total Desconto:</span>
                  <strong>- R$ {totais.totalDesconto}</strong>
                </div>
                <div className="total-item-display highlight">
                  <span>TOTAL DA COMPRA:</span>
                  <strong>R$ {totais.totalCompra}</strong>
                </div>
              </div>
            </div>

            {/* Observações */}
            <div className="section-compra">
              <h3>Observações</h3>
              <div className="form-grid">
                <div className="form-group full-width">
                  <label>Observações da Compra</label>
                  <textarea
                    name="observacoes_compra"
                    value={formData.observacoes_compra}
                    onChange={handleChange}
                    rows="3"
                  />
                </div>
                <div className="form-group full-width">
                  <label>Observações Internas</label>
                  <textarea
                    name="observacoes_internas"
                    value={formData.observacoes_internas}
                    onChange={handleChange}
                    rows="3"
                  />
                </div>
              </div>
            </div>

            {message && (
              <div className={`message ${message.includes("sucesso") ? "success" : "error"}`}>
                {message}
              </div>
            )}
          </div>

          <div className="modal-footer-lancar-compra" style={{ 
            position: 'sticky', 
            bottom: 0, 
            backgroundColor: '#f7fafc',
            zIndex: 10,
            borderTop: '2px solid #007bff'
          }}>
            <button type="button" className="btn-cancelar" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-salvar" disabled={loading}>
              {loading ? "Salvando..." : "Lançar Compra"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LancarCompra;
