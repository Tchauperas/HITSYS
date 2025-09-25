import React from "react";
import "./Vendedores.css";
import Navbar from "../components/Navbar";

function Vendedores() {
  return (
    <div className="vendedores-container">
      <Navbar />

      <div className="content">
        <header className="top-row">
          <div className="title">
            <span className="box-icon">🧑‍💼</span>
            <h1>Listagem de Vendedores</h1>
          </div>

          <div className="buttons">
            <button className="btn-cadastrar">Cadastrar</button>
          </div>
        </header>

        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input type="text" placeholder="   Buscar vendedor" />
        </div>

        <table className="vendedores-table">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Pessoa</th>
              <th>%Comissão</th>
              <th>Desconto Maximo</th>
            </tr>
          </thead>
          <tbody>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Vendedores;
