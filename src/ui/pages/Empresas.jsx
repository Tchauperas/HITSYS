import React from "react";
import "./Empresas.css";
import Navbar from "../components/Navbar";
import logo from "..//assets/empresas_icon.png"

function Empresas() {
  return (
    <div className="empresas-container">
      <Navbar />

      <div className="content">
        <header className="top-row">
          <div className="title">
            <span className="building-icon"></span>
            <img src={logo} alt="Logo" className="logo" />
            <h1>Listagem de Empresas</h1>
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
          <input type="text" placeholder="   Pesquisar empresa" />
        </div>
        <table className="empresas-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>CNPJ</th>
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

export default Empresas;
