import React from "react";
import "./Pessoas.css";
import Navbar from "../components/Navbar";
import logo from "../assets/pessoas_icon.png"

function Pessoas() {
  return (
    <div className="pessoas-container">
      <Navbar />

      <div className="content">
        <header className="top-row">
          <div className="title">
            <span className="people-icon"></span>
            <img src={logo} alt="Logo" className="logo" />
            <h1>Listagem de Pessoas</h1>
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
          <input type="text" placeholder="   Pesquisar pessoa" />
        </div>

        <table className="pessoas-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>CNPJ/CPF</th>
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

export default Pessoas;
