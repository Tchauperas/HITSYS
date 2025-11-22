import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Pdv.css";
import logo from "../assets/logo_mista.jpg";
import CadastroPessoa from "../components/Cadastro_pessoa"; // Adicione esta importação
import WindowControls from "../components/WindowControls"
function Pdv() {
  const [codigo, setCodigo] = useState("");
  const [quantidade, setQuantidade] = useState(1);
  const [valorUnitario, setValorUnitario] = useState(0);
  const [descricao, setDescricao] = useState("");
  const [itens, setItens] = useState([]);
  const [empresa, setEmpresa] = useState(1);
  const [cliente, setCliente] = useState(1);
  const [vendedor, setVendedor] = useState(1);

  const navigate = useNavigate();

  const [showEmpresaDropdown, setShowEmpresaDropdown] = useState(false);
  const [empresasList, setEmpresasList] = useState([]);
  const [empresaSearch, setEmpresaSearch] = useState("");
  const [empresaNome, setEmpresaNome] = useState("");

  const [showClienteDropdown, setShowClienteDropdown] = useState(false);
  const [clientesList, setClientesList] = useState([]);
  const [clienteSearch, setClienteSearch] = useState("");
  const [clienteNome, setClienteNome] = useState("");

  const [showVendedorDropdown, setShowVendedorDropdown] = useState(false);
  const [vendedoresList, setVendedoresList] = useState([]);
  const [vendedorSearch, setVendedorSearch] = useState("");
  const [vendedorNome, setVendedorNome] = useState("");
  const [comissao, setComissao] = useState(0);

  const [showProdutoDropdown, setShowProdutoDropdown] = useState(false);
  const [produtosList, setProdutosList] = useState([]);
  const [produtoSearch, setProdutoSearch] = useState("");
  const [produtoNome, setProdutoNome] = useState("");

  const [busca, setBusca] = useState("");
  const [resultadosBusca, setResultadosBusca] = useState([]);

  const [produtoSelecionadoId, setProdutoSelecionadoId] = useState(null);

  // Adicione este estado para controlar o modal
  const [showCadastroClienteModal, setShowCadastroClienteModal] = useState(false);

  const adicionarItem = () => {
    if (!codigo || !descricao || quantidade <= 0 || valorUnitario <= 0) {
      alert("Preencha todos os campos corretamente antes de adicionar.");
      return;
    }
    const precoTotal = quantidade * valorUnitario;
    const novoItem = {
      id_produto: produtoSelecionadoId || Math.floor(Math.random() * 1000), // Usar id real do produto
      codigo,
      descricao,
      quantidade,
      preco_unitario: valorUnitario,
      preco_total: precoTotal,
      unidade_medida: "UN",
      margem_desconto: 0,
      valor_desconto: 0,
    };
    setItens([...itens, novoItem]);
    setCodigo("");
    setDescricao("");
    setQuantidade(1);
    setValorUnitario(0);
    setProdutoNome("");
    setProdutoSelecionadoId(null);
  };

  const calcularTotalVenda = () => {
    return itens.reduce((acc, item) => acc + item.preco_total, 0);
  };

  const enviarVenda = async () => {
    if (!empresa) {
      alert("Selecione uma empresa antes de fechar a venda.");
      return;
    }
    if (!cliente) {
      alert("Selecione um cliente antes de fechar a venda.");
      return;
    }
    if (!vendedor) {
      alert("Selecione um vendedor antes de fechar a venda.");
      return;
    }
    if (itens.length === 0) {
      alert("Adicione pelo menos um produto antes de fechar a venda.");
      return;
    }

    const totalProdutos = calcularTotalVenda();

    const margemComissao = comissao || 0;
    const totalComissao = (totalProdutos * margemComissao) / 100;
    
    // Formatar data no fuso GMT-3 (horário de Brasília)
    const now = new Date();
    const offset = -3 * 60; // GMT-3 em minutos
    const localTime = new Date(now.getTime() + offset * 60 * 1000);
    const dataAtual = localTime.toISOString().slice(0, 19).replace('T', ' ');
    
    const numVenda = `VEN-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
    
    // Buscar o ID do usuário logado no caminho correto
    const userData = JSON.parse(localStorage.getItem("userData"));
    const idUsuario = userData?.data?.id_usuario;
    
    console.log("UserData completo:", userData);
    console.log("ID do usuário:", idUsuario);
    console.log("Comissão aplicada:", margemComissao, "% - Total:", totalComissao);
    
    if (!idUsuario) {
      alert("Usuário não identificado. Faça login novamente.");
      navigate("/");
      return;
    }

    const payload = {
      pedido: {
        id_empresa: empresa,
        num_venda: numVenda,
        data_venda: dataAtual,
        id_usuario_lancamento: idUsuario,
        id_cliente: cliente,
        id_vendedor: vendedor,
        total_produtos: totalProdutos,
        total_venda: totalProdutos,
        id_status_venda: 1,
        margem_total_desconto: 0,
        total_desconto: 0,
        margem_comissao: margemComissao,
        total_comissao: totalComissao,
        observacoes_venda: "Venda realizada com sucesso.",
        observacoes_internas: "PDV básico",
      },
      itens: itens.map(item => ({
        id_produto: item.id_produto,
        codigo: item.codigo,
        descricao: item.descricao,
        quantidade: item.quantidade,
        preco_unitario: item.preco_unitario,
        preco_total: item.preco_total,
        unidade_medida: item.unidade_medida || "UN",
        margem_desconto: item.margem_desconto || 0,
        valor_desconto: item.valor_desconto || 0
      }))
    };

    console.log("Payload que será enviado:", JSON.stringify(payload, null, 2));

    try {
      const token = userData?.token;
      if (!token) {
        alert("Sessão expirada. Faça login novamente.");
        navigate("/");
        return;
      }

      const response = await fetch("http://127.0.0.1:3000/vendas/lancar", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Erro na resposta:", errorData);
        alert(`Erro ao enviar venda: ${errorData.message || 'Erro desconhecido'}`);
        return;
      }

      const data = await response.json();
      console.log("Resposta do envio da venda:", data);
      
      if (data.success) {
        alert("Venda finalizada com sucesso!");
        setItens([]);
        setEmpresa(1);
        setCliente(1);
        setVendedor(1);
        setEmpresaNome("");
        setClienteNome("");
        setVendedorNome("");
        setComissao(0);
        setCodigo("");
        setDescricao("");
        setQuantidade(1);
        setValorUnitario(0);
        setProdutoNome("");
      } else {
        alert(`Erro ao finalizar venda: ${data.message || 'Erro desconhecido'}`);
      }
    } catch (error) {
      console.error("Erro ao enviar venda:", error);
      alert("Erro ao conectar com o servidor. Tente novamente.");
    }
  };

  const enviarOrcamento = async () => {
    if (!empresa) {
      alert("Selecione uma empresa antes de criar o orçamento.");
      return;
    }
    if (!cliente) {
      alert("Selecione um cliente antes de criar o orçamento.");
      return;
    }
    if (!vendedor) {
      alert("Selecione um vendedor antes de criar o orçamento.");
      return;
    }
    if (itens.length === 0) {
      alert("Adicione pelo menos um produto antes de criar o orçamento.");
      return;
    }

    const totalProdutos = calcularTotalVenda();

    const margemComissao = comissao || 0;
    const totalComissao = (totalProdutos * margemComissao) / 100;
    
    // Formatar data no fuso GMT-3 (horário de Brasília)
    const now = new Date();
    const offset = -3 * 60; // GMT-3 em minutos
    const localTime = new Date(now.getTime() + offset * 60 * 1000);
    const dataAtual = localTime.toISOString().slice(0, 19).replace('T', ' ');
    
    const numOrcamento = `ORC-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
    
    // Buscar o ID do usuário logado no caminho correto
    const userData = JSON.parse(localStorage.getItem("userData"));
    const idUsuario = userData?.data?.id_usuario;
    
    console.log("UserData completo:", userData);
    console.log("ID do usuário:", idUsuario);
    console.log("Comissão aplicada:", margemComissao, "% - Total:", totalComissao);
    
    if (!idUsuario) {
      alert("Usuário não identificado. Faça login novamente.");
      navigate("/");
      return;
    }

    const payload = {
      pedido: {
        id_empresa: empresa,
        num_orcamento: numOrcamento,
        data_orcamento: dataAtual,
        id_usuario_lancamento: idUsuario,
        id_cliente: cliente,
        id_vendedor: vendedor,
        total_produtos: totalProdutos,
        total_orcamento: totalProdutos,
        id_status_orcamento: 2,
        margem_total_desconto: 0,
        total_desconto: 0,
        observacoes_orcamento: "Orçamento criado no PDV.",
        observacoes_internas: "PDV básico",
      },
      itens: itens.map(item => ({
        id_produto: item.id_produto,
        codigo: item.codigo,
        descricao: item.descricao,
        quantidade: item.quantidade,
        preco_unitario: item.preco_unitario,
        preco_total: item.preco_total,
        unidade_medida: item.unidade_medida || "UN",
        margem_desconto: item.margem_desconto || 0,
        valor_desconto: item.valor_desconto || 0
      }))
    };

    console.log("Payload de orçamento que será enviado:", JSON.stringify(payload, null, 2));

    try {
      const token = userData?.token;
      if (!token) {
        alert("Sessão expirada. Faça login novamente.");
        navigate("/");
        return;
      }

      const response = await fetch("http://127.0.0.1:3000/orcamentos/lancar", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Erro na resposta:", errorData);
        alert(`Erro ao enviar orçamento: ${errorData.message || 'Erro desconhecido'}`);
        return;
      }

      const data = await response.json();
      console.log("Resposta do envio do orçamento:", data);
      
      if (data.success) {
        alert("Orçamento criado com sucesso!");
        setItens([]);
        setEmpresa(1);
        setCliente(1);
        setVendedor(1);
        setEmpresaNome("");
        setClienteNome("");
        setVendedorNome("");
        setComissao(0);
        setCodigo("");
        setDescricao("");
        setQuantidade(1);
        setValorUnitario(0);
        setProdutoNome("");
      } else {
        alert(`Erro ao criar orçamento: ${data.message || 'Erro desconhecido'}`);
      }
    } catch (error) {
      console.error("Erro ao enviar orçamento:", error);
      alert("Erro ao conectar com o servidor. Tente novamente.");
    }
  };

  const buscarProdutos = async (term = "") => {
    try {
      const userData = JSON.parse(localStorage.getItem("userData"));
      const token = userData?.token;
      if (!token) return;
      const res = await fetch(`http://127.0.0.1:3000/produtos/visualizar?search=${encodeURIComponent(term)}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      if (!res.ok) throw new Error("Sem resposta do serviço");
      const data = await res.json();
      console.log("Produtos retornados:", data);
      setProdutosList(Array.isArray(data.values) ? data.values : []);
    } catch (err) {
      console.error("Erro ao buscar produtos:", err);
      setProdutosList([]);
    }
  };

  const selecionarProduto = (prod) => {
    setProdutoSelecionadoId(prod.id_produto || prod.id);
    setCodigo(prod.codigo || prod.codigo_produto || "");
    setDescricao(prod.descricao || prod.descricao_produto || "");
    setValorUnitario(prod.preco_unitario || prod.preco_venda || 0);
    setProdutoNome(prod.descricao || prod.descricao_produto || "");
    setQuantidade(1);
    setProdutoSearch("");
    setShowProdutoDropdown(false);
  };

  // seletores de registros (placeholders -- substituir por modal/busca real)
  const selecionarEmpresa = async () => {
    const id = window.prompt("Selecionar Empresa (digite id) - simulação:", String(empresa));
    if (id) setEmpresa(Number(id));
  };

  const selecionarCliente = async () => {
    const id = window.prompt("Selecionar Cliente (digite id) - simulação:", String(cliente));
    if (id) setCliente(Number(id));
  };

  const selecionarVendedor = async () => {
    const id = window.prompt("Selecionar Vendedor (digite id) - simulação:", String(vendedor));
    if (id) setVendedor(Number(id));
  };

  const adicionarCliente = async () => {
    // Substitua o conteúdo desta função
    setShowCadastroClienteModal(true);
  };

  // Adicione esta função para lidar com o sucesso do cadastro
  const handleClienteCadastrado = (novoCliente) => {
    // Atualizar o cliente selecionado com os dados do novo cliente
    if (novoCliente && novoCliente.id_pessoa) {
      setCliente(novoCliente.id_pessoa);
      setClienteNome(novoCliente.nome_razao_social || novoCliente.nome);
      // Recarregar a lista de clientes
      fetchClientes("");
    }
    setShowCadastroClienteModal(false);
  };

  // --- funções para buscar listas (tentam API, caem em simulação) ---
  const fetchEmpresas = async (term = "") => {
    try {
      const userData = JSON.parse(localStorage.getItem("userData"));
      const token = userData?.token;
      if (!token) return;
      const res = await fetch(`http://127.0.0.1:3000/empresas/visualizar?search=${encodeURIComponent(term)}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      if (!res.ok) throw new Error("no response");
      const data = await res.json();
      console.log("Empresas retornadas:", data);
      setEmpresasList(Array.isArray(data.values) ? data.values : []);
    } catch (err) {
      console.error("Erro ao buscar empresas:", err);
      setEmpresasList([]);
    }
  };

  const fetchClientes = async (term = "") => {
    try {
      const userData = JSON.parse(localStorage.getItem("userData"));
      const token = userData?.token;
      if (!token) return;
      const res = await fetch(`http://127.0.0.1:3000/pessoas/visualizar?search=${encodeURIComponent(term)}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      if (!res.ok) throw new Error("no response");
      const data = await res.json();
      console.log("Clientes retornados:", data);
      setClientesList(Array.isArray(data.values) ? data.values : []);
    } catch (err) {
      console.error("Erro ao buscar clientes:", err);
      setClientesList([]);
    }
  };

  const fetchVendedores = async (term = "") => {
    try {
      const userData = JSON.parse(localStorage.getItem("userData"));
      const token = userData?.token;
      if (!token) return;
      const res = await fetch(`http://127.0.0.1:3000/vendedores/vendedores?search=${encodeURIComponent(term)}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      if (!res.ok) throw new Error("no response");
      const data = await res.json();
      console.log("Vendedores retornados:", data);
      setVendedoresList(Array.isArray(data.values) ? data.values : []);
    } catch (err) {
      console.error("Erro ao buscar vendedores:", err);
      setVendedoresList([]);
    }
  };

  const openEmpresaDropdown = async () => {
    setShowEmpresaDropdown(true);
    setShowClienteDropdown(false);
    setShowVendedorDropdown(false);
    await fetchEmpresas("");
  };

  const openClienteDropdown = async () => {
    setShowClienteDropdown(true);
    setShowEmpresaDropdown(false);
    setShowVendedorDropdown(false);
    await fetchClientes("");
  };

  const openVendedorDropdown = async () => {
    setShowVendedorDropdown(true);
    setShowEmpresaDropdown(false);
    setShowClienteDropdown(false);
    await fetchVendedores("");
  };

  const openProdutoDropdown = async () => {
    setShowProdutoDropdown(true);
    await buscarProdutos("");
  };

  // REMOVA os useEffect existentes e substitua por estes:
  useEffect(() => {
    const timer = setTimeout(() => {
      if (showEmpresaDropdown && empresaSearch) {
        fetchEmpresas(empresaSearch);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [empresaSearch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (showClienteDropdown && clienteSearch) {
        fetchClientes(clienteSearch);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [clienteSearch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (showVendedorDropdown && vendedorSearch) {
        fetchVendedores(vendedorSearch);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [vendedorSearch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (showProdutoDropdown && produtoSearch) {
        buscarProdutos(produtoSearch);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [produtoSearch]);

  // Buscar comissão do vendedor quando o vendedor mudar
  useEffect(() => {
    const buscarComissaoVendedor = async () => {
      if (!vendedor || vendedor === 0) {
        setComissao(0);
        return;
      }

      try {
        const userData = JSON.parse(localStorage.getItem("userData"));
        const token = userData?.token;
        if (!token) return;

        const response = await fetch(`http://127.0.0.1:3000/vendedores/vendedores/${vendedor}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const vendedorData = await response.json();
          console.log('Dados do vendedor (useEffect):', vendedorData);
          
          const taxaComissao = vendedorData.values?.[0]?.taxa_comissao || 
                               vendedorData.taxa_comissao || 
                               vendedorData.values?.[0]?.comissao || 
                               vendedorData.comissao;
          
          if (taxaComissao !== undefined && taxaComissao !== null) {
            setComissao(parseFloat(taxaComissao));
            console.log('Comissão definida (useEffect):', parseFloat(taxaComissao));
          } else {
            setComissao(0);
          }
        }
      } catch (error) {
        console.error('Erro ao buscar comissão do vendedor:', error);
        setComissao(0);
      }
    };

    buscarComissaoVendedor();
  }, [vendedor]);

  const selectEmpresa = (item) => {
    setEmpresa(item.id_empresa || item.id || 0);
    setEmpresaNome(item.nome_fantasia || item.razao_social || item.nome || String(item.id_empresa || item.id));
    setEmpresaSearch("");
    setShowEmpresaDropdown(false);
  };

  const selectCliente = (item) => {
    setCliente(item.id_pessoa || item.id || 0);
    setClienteNome(item.nome_razao_social || item.nome || String(item.id_pessoa || item.id));
    setClienteSearch("");
    setShowClienteDropdown(false);
  };

  const selectVendedor = async (item) => {
    const vendedorId = item.id_vendedor || item.id || 0;
    setVendedor(vendedorId);
    setVendedorNome(item.nome_pessoa || item.nome || String(item.id_vendedor || item.id));
    setVendedorSearch("");
    setShowVendedorDropdown(false);
    
    // Buscar comissão do vendedor dinamicamente
    if (vendedorId) {
      try {
        const userData = JSON.parse(localStorage.getItem("userData"));
        const token = userData?.token;
        if (!token) return;
        
        const response = await fetch(`http://127.0.0.1:3000/vendedores/vendedores/${vendedorId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const vendedorData = await response.json();
          console.log('Dados do vendedor:', vendedorData);
          
          // Verificar tanto 'taxa_comissao' quanto 'comissao' para compatibilidade
          const taxaComissao = vendedorData.values?.[0]?.taxa_comissao || 
                               vendedorData.taxa_comissao || 
                               vendedorData.values?.[0]?.comissao || 
                               vendedorData.comissao;
          
          if (taxaComissao !== undefined && taxaComissao !== null) {
            setComissao(parseFloat(taxaComissao));
            console.log('Comissão definida:', parseFloat(taxaComissao));
          }
        }
      } catch (error) {
        console.error('Erro ao buscar comissão do vendedor:', error);
      }
    }
  };

  return (
    <div className="container-fluid container-my">
      <WindowControls />

      <div>
        <h2 className="titulo">PDV</h2>
        <div>
          <div className="top-row">
            <div className="top-botoes">
              <div className="selector-item botao_vendedor">
                <button className="btn btn-outline-dark" onClick={openVendedorDropdown}>
                  {vendedorNome ? `Vendedor:${vendedorNome}` : `Vendedor${vendedor}`}
                </button>

                {showVendedorDropdown && (
                  <div className="pdv-dropdown-panel">
                    <input 
                      className="form-control mb-2" 
                      placeholder="Buscar vendedor..." 
                      value={vendedorSearch} 
                      onChange={(e) => setVendedorSearch(e.target.value)}
                    />
                    <div className="list-group">
                      {vendedoresList.map((it) => (
                        <button key={it.id_vendedor || it.id} type="button" className="list-group-item list-group-item-action" onClick={() => selectVendedor(it)}>
                          {it.id_vendedor || it.id} - {it.nome_pessoa || it.nome}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="selector-item">
                <button className="btn btn-outline-dark" onClick={openEmpresaDropdown}>
                  {empresaNome ? `Empresa:${empresaNome}` : `Empresa${empresa}`}
                </button>

                {showEmpresaDropdown && (
                  <div className="pdv-dropdown-panel">
                    <input 
                      className="form-control mb-2" 
                      placeholder="Buscar empresa..." 
                      value={empresaSearch} 
                      onChange={(e) => setEmpresaSearch(e.target.value)}
                    />
                    <div className="list-group">
                      {empresasList.map((it) => (
                        <button key={it.id_empresa || it.id} type="button" className="list-group-item list-group-item-action" onClick={() => selectEmpresa(it)}>
                          {it.id_empresa || it.id} - {it.nome_fantasia || it.razao_social || it.nome}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="selector-item d-flex align-items-center">
                <div style={{ position: 'relative' }}>
                  <button className="btn btn-outline-primary" onClick={openClienteDropdown}>
                    {clienteNome ? `Cliente:${clienteNome}` : `Cliente${cliente}`}
                  </button>
                  {showClienteDropdown && (
                    <div className="pdv-dropdown-panel">
                      <input 
                        className="form-control mb-2" 
                        placeholder="Buscar cliente..." 
                        value={clienteSearch} 
                        onChange={(e) => setClienteSearch(e.target.value)}
                      />
                      <div className="list-group">
                        {clientesList.map((it) => (
                          <button key={it.id_pessoa || it.id} type="button" className="list-group-item list-group-item-action" onClick={() => selectCliente(it)}>
                            {it.id_pessoa || it.id} - {it.nome_razao_social || it.nome}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <button className="btn btn-add-client adicionar_cliente" onClick={adicionarCliente} title="Adicionar cliente">
                  +
                </button>
              </div>
            </div>
            <div className="logo_container">
              <img src={logo} alt="Logo" style={{ height: "50px" }} />
            </div>
          </div>
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-12">
          <div style={{ position: 'relative' }}>
            <button className="btn btn-outline-success w-100" onClick={openProdutoDropdown}>
              {produtoNome ? `Produto: ${produtoNome}` : "SELECIONE UM PRODUTO"}
            </button>

            {showProdutoDropdown && (
              <div className="pdv-dropdown-panel" style={{ width: '100%' }}>
                <input 
                  className="form-control mb-2" 
                  placeholder="Buscar produto..." 
                  value={produtoSearch} 
                  onChange={(e) => setProdutoSearch(e.target.value)}
                  autoFocus
                />
                <div className="list-group" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {produtosList.map((p) => (
                    <button 
                      key={p.id_produto || p.codigo} 
                      type="button" 
                      className="list-group-item list-group-item-action text-start" 
                      onClick={() => selecionarProduto(p)}
                    >
                      <strong>{p.codigo || p.codigo_produto}</strong> - {p.descricao || p.descricao_produto}
                      <br />
                      <small className="text-muted">R$ {Number(p.preco_unitario || p.preco_venda || 0).toFixed(2)}</small>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="row mb-3">
        <div className="col">
          <input
            type="text"
            className="form-control"
            placeholder="Código"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            readOnly
          />
        </div>
        <div className="col">
          <input
            type="text"
            className="form-control"
            placeholder="Descrição"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            readOnly
          />
        </div>
        <div className="col">
          <input
            type="number"
            className="form-control"
            placeholder="Qtd"
            value={quantidade}
            onChange={(e) => setQuantidade(Number(e.target.value))}
          />
        </div>
        <div className="col">
          <input
            type="number"
            className="form-control"
            placeholder="Valor Unit."
            value={valorUnitario}
            onChange={(e) => setValorUnitario(Number(e.target.value))}
          />
        </div>
        <div className="col">
          <button className="btn btn-primary w-100" onClick={adicionarItem}>
            Inserir
          </button>
        </div>
      </div>
      <div className="table-space">
        <table className="table-produtos">
          <thead>
            <tr>
              <th>#</th>
              <th>Produto</th>
              <th>Qtd.</th>
              <th>Valor Unit.</th>
              <th>Total</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {itens.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{item.descricao}</td>
                <td>{item.quantidade}</td>
                <td>R$ {Number(item.preco_unitario || 0).toFixed(2)}</td>
                <td>R$ {Number(item.preco_total || 0).toFixed(2)}</td>
                <td>
                  <button 
                    className="btn btn-sm btn-danger" 
                    onClick={() => setItens(itens.filter((_, i) => i !== index))}
                  >
                    Remover
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="text-end mb-3 texto-total">
        <h4>Total da Venda: R$ {calcularTotalVenda().toFixed(2)}</h4>
      </div>

      <div className="d-flex justify-content-between botoes">
        <button onClick={enviarVenda}>
          Fechar
        </button>
        <button onClick={enviarOrcamento}>Orçamento</button>
        <button>Receber</button>
        <button>Consultar Vendas</button>
        <button>Desistir</button>
        <button  onClick={() => navigate("/home")}>
          Sair
        </button>
      </div>

      {/* Adicione o modal no final do return, antes do fechamento da div container */}
      {showCadastroClienteModal && (
        <CadastroPessoa
          show={showCadastroClienteModal}
          onHide={() => setShowCadastroClienteModal(false)}
          onSuccess={handleClienteCadastrado}
        />
      )}
    </div>
  );
}

export default Pdv;