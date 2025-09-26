import React from "react";
import "./Usuarios.css";
import Navbar from "../components/Navbar";
import logo from "../assets/usuarios_icon.png"


function Usuarios() {
  return (
    <div className="usuarios-container">
      <Navbar />

      <div className="content">
        <header className="top-row">
          <div className="title">
            <span className="box-icon"></span>
            <img src={logo} alt="Logo" className="logo" />
            <h1>Listagem de Usuários</h1>
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
          <input type="text" placeholder="   Buscar usuário" />
        </div>

        <table className="usuarios-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Perfil</th>
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

export default Usuarios;
