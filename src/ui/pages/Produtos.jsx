import React from "react";
import "./Produtos.css";
import Navbar from "../components/Navbar";
import logo from "../assets/produtos_icon.png";

function Produtos() {
  return (
    <div className="produtos-container">
      <Navbar />

      <div className="content">
        <header className="top-row">
          <div className="title">
            <img src={logo} alt="Logo" className="logo" />
            <h1>Listagem de Produtos</h1>
          </div>

          <div className="right-actions">
            <button
              className="btn-cadastrar"
              onClick={() => alert("Abrir tela de cadastro")}
            >
              Cadastrar
            </button>
          </div>
        </header>

        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input type="text" placeholder="   Pesquisar produto" />
        </div>

        <table className="produtos-table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Descrição</th>
              <th>Preço</th>
              <th>Estoque</th>
              <th>Ações</th>
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
