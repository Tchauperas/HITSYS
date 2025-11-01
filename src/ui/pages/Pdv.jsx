import { useState, useEffect } from "react";
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

  return (
    <div className="container mt-4">
      <div className="text-center mb-4">
        <img src={logo} alt="Logo" style={{ height: "50px" }} />
        <h2>HITSYS - PDV</h2>
      </div>

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
            <th>Qtd</th>
            <th>Unitário</th>
            <th>Total</th>
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
          F10 Fechar
        </button>
        <button className="btn btn-secondary">F9 Orçamento</button>
        <button className="btn btn-info">Ctrl+V Receber</button>
        <button className="btn btn-warning">F2 Consultar Venda</button>
        <button className="btn btn-dark">Alt. Vendedor</button>
        <button className="btn btn-danger">Esc Desistir</button>
        <button className="btn btn-outline-dark">Sair</button>
      </div>
    </div>
  );
}

export default Pdv;