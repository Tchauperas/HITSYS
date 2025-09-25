import React from "react";
import "./Produtos.css";
import Navbar from "../components/Navbar";

function Produtos() {
  return (
    <div className="produtos-container">
      <Navbar />

      <div className="content">
        <header className="top-row">
          <div className="title">
            <span className="box-icon">📦</span>
            <h1>Listagem de Produtos</h1>
          </div>

          <div className="right-actions">
            <button
              className="btn-cadastrar"
              onClick={() => alert("Abrir tela de cadastro")}
            >
              Cadastrar
            </button>
            <button className="btn-back"> </button>
          </div>
        </header>

        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input type="text" placeholder="Pesquisar produto..." />
        </div>

        <table className="produtos-table">
          <thead>
            <tr>
              <th>CÓDIGO</th>
              <th>DESCRIÇÃO</th>
              <th>PREÇO</th>
              <th>ESTOQUE</th>
              <th>AÇÕES</th>
            </tr>
          </thead>
          <tbody>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Produtos;
