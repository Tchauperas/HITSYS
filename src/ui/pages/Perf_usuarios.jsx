import React from "react";
import "./Perf_usuarios.css";
import Navbar from "../components/Navbar";
import logo from "../assets/perfis_icon.png"


function Perf_usuarios() {
  return (
    <div className="perf-container">
      <Navbar />

      <div className="content">
        <header className="top-row">
          <div className="title">
            <span className="box-icon"></span>
            <img src={logo} alt="Logo" className="logo" />
            <h1>Perfis de Usuários</h1>
          </div>

          <div className="buttons">
            <button className="btn-cadastrar">Cadastrar</button>
          </div>
        </header>

        <div className="search-bar">
            <span className="search-icon">🔍</span>
          <input type="text" placeholder="   Buscar perfil" />
        </div>

        <table className="perf-table">
          <thead>
            <tr>
              <th>Descrição</th>
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

export default Perf_usuarios;
