import React from "react";
import "./Empresas.css";
import Navbar from "../components/Navbar";

function Empresas() {
  return (
    <div className="empresas-container">
      <Navbar />

      <div className="content">
        <header className="top-row">
          <div className="title">
            <span className="building-icon"></span>
            <h1>Listagem de Compras</h1>
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
              <th>N° Venda</th>
              <th>Data e Hora</th>
              <th>Cliente</th>
              <th>Valor Total</th>
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
