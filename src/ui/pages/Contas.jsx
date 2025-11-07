import React from "react"
import "./Contas.css"
import Navbar from "../components/Navbar"
import logo from "../assets/contas_icon.png"
function Contas() {
    return (
        <div className="contas-container">
            <Navbar />

            <div className="content">
                <header className="top-row">
                    <div className="title">
                        <span className="box-icon"></span>
                        <img src={logo} alt="Logo" className="logo" />
                        <h1>Listagem de Contas</h1>
                    </div>

                    <div className="buttons">
                        <button className="btn-cadastrar">Cadastrar</button>
                    </div>
                </header>

                <div className="search-bar">
                    <span className="search-icon">🔍</span>
                    <input type="text" placeholder="   Buscar conta" />
                </div>
                <table className="contas-table">
                    <thead>
                        <tr>
                            <th>Número</th>
                            <th>Cliente</th>
                            <th>Status</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>
        </div>
    )
}

export default Contas
