import React from "react"
import "./Compras.css"
import Navbar from "../components/Navbar"
import logo from "../assets/compras_icon.png"
import WindowControls from "../components/WindowControls"
function Compras() {
    return (
        <div className="empresas-container">
            <WindowControls />
            <Navbar />

            <div className="content">
                <header className="top-row">
                    <div className="title">
                        <span className="building-icon"></span>
                        <img src={logo} alt="Logo" className="logo" />
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
                <table className="compras-table">
                    <thead>
                        <tr>
                            <th>N° Compra</th>
                            <th>Data e Hora</th>
                            <th>Fornecedor</th>
                            <th>Valor Total</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>
        </div>
    )
}

export default Compras
