import "bootstrap/dist/css/bootstrap.min.css" // Importa o CSS do Bootstrap
import "bootstrap/dist/js/bootstrap.bundle.min.js" // Importa o JS do Bootstrap (opcional)
import { useState } from "react"
import "./App.css"
import { BrowserRouter, Routes, Route } from "react-router-dom"

import Login from "./pages/Login.jsx"
import Home from "./pages/Home.jsx"
import Empresas from "./pages/Empresas.jsx"
import Pessoas from "./pages/Pessoas.jsx"
import Produtos from "./pages/Produtos.jsx"
import Usuarios from "./pages/Usuarios.jsx"
import Perf_usuarios from "./pages/Perf_usuarios.jsx"
import Vendedores from "./pages/Vendedores.jsx"
import Compras from "./pages/Compras.jsx"
import Vendas from "./pages/Vendas.jsx"
import Contas from "./pages/Contas.jsx"
import Pdv from "./pages/Pdv.jsx"
import Auditoria from "./pages/Auditoria.jsx"

function App() {
    return (
        <div>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/empresas" element={<Empresas />} />
                    <Route path="/pessoas" element={<Pessoas />} />
                    <Route path="/produtos" element={<Produtos />} />
                    <Route path="/usuarios" element={<Usuarios />} />
                    <Route path="/perf_usuarios" element={<Perf_usuarios />} />
                    <Route path="/vendedores" element={<Vendedores />} />
                    <Route path="/compras" element={<Compras />} />
                    <Route path="/vendas" element={<Vendas />} />
                    <Route path="/contas" element={<Contas />} />
                    <Route path="/pdv" element={<Pdv />} />
                    <Route path="/auditoria" element={<Auditoria/>}/>
                </Routes>
            </BrowserRouter>
        </div>
    )
}

export default App
