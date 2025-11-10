import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Pdv.css";
import logo from "../assets/logo_mista.jpg";

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

  const [busca, setBusca] = useState("");
  const [resultadosBusca, setResultadosBusca] = useState([]);

  const adicionarItem = () => {
    const precoTotal = quantidade * valorUnitario;
    const novoItem = {
      id_produto: Math.floor(Math.random() * 1000), // Simulação
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
  };

  const calcularTotalVenda = () => {
    return itens.reduce((acc, item) => acc + item.preco_total, 0);
  };

  const enviarVenda = async () => {
    const totalProdutos = calcularTotalVenda();
    const payload = {
      pedido: {
        id_empresa: empresa,
        num_venda: `VEN-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-001`,
        data_venda: new Date().toISOString(),
        id_usuario_lancamento: 3,
        id_cliente: cliente,
        id_vendedor: vendedor,
        total_produtos: totalProdutos,
        total_venda: totalProdutos,
        id_status_venda: 1,
        margem_total_desconto: 0,
        total_desconto: 0,
        margem_comissao: 0,
        total_comissao: 0,
        observacoes_venda: "Venda realizada com sucesso.",
        observacoes_internas: "PDV básico",
      },
      itens,
    };

    try {
      const response = await fetch("http://127.0.0.1:3000/pedidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log("Venda enviada:", data);
      alert("Venda finalizada com sucesso!");
      setItens([]);
    } catch (error) {
      console.error("Erro ao enviar venda:", error);
    }
  };

  const buscarProdutos = async () => {
    const termo = (busca || "").trim();
    if (!termo) return;
    try {
      // futura chamada real ao backend
      const res = await fetch(`http://127.0.0.1:3000/produtos?search=${encodeURIComponent(termo)}`);
      if (!res.ok) throw new Error("Sem resposta do serviço");
      const data = await res.json();
      setResultadosBusca(Array.isArray(data) ? data : []);
    } catch (err) {
      console.warn("Busca de produtos falhou, usando simulação:", err);
      // resultado simulado para desenvolvimento local
      setResultadosBusca([
        { id_produto: 1, codigo: "EX001", descricao: "Produto Exemplo", preco_unitario: 12.5 },
      ]);
    }
  };

  const selecionarProduto = (prod) => {
    setCodigo(prod.codigo || "");
    setDescricao(prod.descricao || "");
    setValorUnitario(prod.preco_unitario || 0);
    setQuantidade(1);
    setResultadosBusca([]);
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
    const nome = window.prompt("Novo cliente - digite nome (simulação):");
    if (nome) {
      // simula criação e retorna novo id aleatório
      const novoId = Math.floor(Math.random() * 9000) + 1000;
      // futuramente chamar API para criar cliente
      setCliente(novoId);
      alert(`Cliente '${nome}' criado (id ${novoId}) - isto é apenas uma simulação.`);
    }
  };

  // --- funções para buscar listas (tentam API, caem em simulação) ---
  const fetchEmpresas = async (term = "") => {
    try {
      const res = await fetch(`http://127.0.0.1:3000/empresas?search=${encodeURIComponent(term)}`);
      if (!res.ok) throw new Error("no response");
      const data = await res.json();
      setEmpresasList(Array.isArray(data) ? data : []);
    } catch (err) {
      // fallback simulado
      setEmpresasList([
        { id: 1, nome: "Empresa A" },
        { id: 2, nome: "Empresa B" },
        { id: 3, nome: "Empresa C" },
      ]);
    }
  };

  const fetchClientes = async (term = "") => {
    try {
      const res = await fetch(`http://127.0.0.1:3000/clientes?search=${encodeURIComponent(term)}`);
      if (!res.ok) throw new Error("no response");
      const data = await res.json();
      setClientesList(Array.isArray(data) ? data : []);
    } catch (err) {
      setClientesList([
        { id: 11, nome: "Fulano de Tal" },
        { id: 12, nome: "Beltrano" },
        { id: 13, nome: "Ciclano" },
      ]);
    }
  };

  const fetchVendedores = async (term = "") => {
    try {
      const res = await fetch(`http://127.0.0.1:3000/vendedores?search=${encodeURIComponent(term)}`);
      if (!res.ok) throw new Error("no response");
      const data = await res.json();
      setVendedoresList(Array.isArray(data) ? data : []);
    } catch (err) {
      setVendedoresList([
        { id: 21, nome: "Vendedor 1" },
        { id: 22, nome: "Vendedor 2" },
      ]);
    }
  };

  const openEmpresaDropdown = async () => {
    await fetchEmpresas("");
    setShowEmpresaDropdown(true);
    setShowClienteDropdown(false);
    setShowVendedorDropdown(false);
  };

  const openClienteDropdown = async () => {
    await fetchClientes("");
    setShowClienteDropdown(true);
    setShowEmpresaDropdown(false);
    setShowVendedorDropdown(false);
  };

  const openVendedorDropdown = async () => {
    await fetchVendedores("");
    setShowVendedorDropdown(true);
    setShowEmpresaDropdown(false);
    setShowClienteDropdown(false);
  };

  const selectEmpresa = (item) => {
    setEmpresa(item.id || item.id_empresa || item.idEmpresa || 0);
    setEmpresaNome(item.nome || item.razao_social || item.nome_fantasia || String(item.id));
    setShowEmpresaDropdown(false);
  };

  const selectCliente = (item) => {
    setCliente(item.id || item.id_pessoa || 0);
    setClienteNome(item.nome || item.razao_social || String(item.id));
    setShowClienteDropdown(false);
  };

  const selectVendedor = (item) => {
    setVendedor(item.id || 0);
    setVendedorNome(item.nome || String(item.id));
    setShowVendedorDropdown(false);
  };

  return (
    <div className="container mt-4">
      <div className="text-center mb-4">
        <img src={logo} alt="Logo" style={{ height: "50px" }} />
        <h2>PDV</h2>
      </div>

      <div className="row mb-2">
        <div className="col-12">
          <div className="pdv-selectors d-flex align-items-center position-relative">
            <div className="selector-item">
              <button className="btn btn-outline-dark" onClick={openEmpresaDropdown}>
                {empresaNome ? `Empresa:${empresaNome}` : `Empresa${empresa}`}
              </button>

              {showEmpresaDropdown && (
                <div className="pdv-dropdown-panel">
                  <input className="form-control mb-2" placeholder="Buscar empresa..." value={empresaSearch} onChange={(e) => setEmpresaSearch(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') fetchEmpresas(empresaSearch); }} />
                  <div className="list-group">
                    {empresasList.map((it) => (
                      <button key={it.id} type="button" className="list-group-item list-group-item-action" onClick={() => selectEmpresa(it)}>
                        {it.id} - {it.nome}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="selector-item ms-2 d-flex align-items-center">
              <div style={{ position: 'relative' }}>
                <button className="btn btn-outline-primary" onClick={openClienteDropdown}>
                  {clienteNome ? `Cliente:${clienteNome}` : `Cliente${cliente}`}
                </button>
                {showClienteDropdown && (
                  <div className="pdv-dropdown-panel">
                    <input className="form-control mb-2" placeholder="Buscar cliente..." value={clienteSearch} onChange={(e) => setClienteSearch(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') fetchClientes(clienteSearch); }} />
                    <div className="list-group">
                      {clientesList.map((it) => (
                        <button key={it.id} type="button" className="list-group-item list-group-item-action" onClick={() => selectCliente(it)}>
                          {it.id} - {it.nome}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button className="btn btn-add-client  ms-2" onClick={adicionarCliente} title="Adicionar cliente">
                +
              </button>
            </div>

            <div className="selector-item ms-2">
              <button className="btn btn-outline-dark" onClick={openVendedorDropdown}>
                {vendedorNome ? `Vendedor:${vendedorNome}` : `Vendedor${vendedor}`}
              </button>

              {showVendedorDropdown && (
                <div className="pdv-dropdown-panel">
                  <input className="form-control mb-2" placeholder="Buscar vendedor..." value={vendedorSearch} onChange={(e) => setVendedorSearch(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') fetchVendedores(vendedorSearch); }} />
                  <div className="list-group">
                    {vendedoresList.map((it) => (
                      <button key={it.id} type="button" className="list-group-item list-group-item-action" onClick={() => selectVendedor(it)}>
                        {it.id} - {it.nome}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-9">
          <input
            type="text"
            className="form-control"
            placeholder="BUSQUE POR PRODUTOS"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") buscarProdutos(); }}
          />
        </div>
        <div className="col-3">
          <button className="btn btn-outline-primary w-100" onClick={buscarProdutos}>
            Buscar
          </button>
        </div>
      </div>

      {resultadosBusca.length > 0 && (
        <div className="row mb-2">
          <div className="col">
            <ul className="list-group">
              {resultadosBusca.map((p) => (
                <li
                  key={p.id_produto ?? p.codigo}
                  className="list-group-item list-group-item-action"
                  style={{ cursor: "pointer" }}
                  onClick={() => selecionarProduto(p)}
                >
                  {p.codigo} - {p.descricao} - R$ {Number(p.preco_unitario || 0).toFixed(2)}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="row mb-3">
        <div className="col">
          <input
            type="text"
            className="form-control"
            placeholder="Código"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
          />
        </div>
        <div className="col">
          <input
            type="text"
            className="form-control"
            placeholder="Descrição"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
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

      <table className="table table-bordered">
        <thead className="table-light">
          <tr>
            <th>#</th>
            <th>Produto</th>
            <th>Und.</th>
            <th>Qtd.</th>
            <th>Valor Unit.</th>
            <th>Desconto</th>
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
              <td>R$ {item.preco_unitario.toFixed(2)}</td>
              <td>R$ {item.preco_total.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="text-end mb-3">
        <h4>Total da Venda: R$ {calcularTotalVenda().toFixed(2)}</h4>
      </div>

      <div className="d-flex justify-content-between">
        <button className="btn btn-success" onClick={enviarVenda}>
          Fechar
        </button>
        <button className="btn btn-secondary">Orçamento</button>
        <button className="btn btn-info">Receber</button>
        <button className="btn btn-warning">Consultar Vendas</button>
        <button className="btn btn-dark">Alt. Vendedor</button>
        <button className="btn btn-danger">Desistir</button>
        <button className="btn btn-outline-dark" onClick={() => navigate("/home")}>
          Sair
        </button>
      </div>
    </div>
  );
}

export default Pdv;