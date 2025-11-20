import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login.jsx";
import Home from "./pages/Home.jsx";
import Empresas from "./pages/Empresas.jsx";
import Pessoas from "./pages/Pessoas.jsx";
import Produtos from "./pages/Produtos.jsx";
import Usuarios from "./pages/Usuarios.jsx";
import Perf_usuarios from "./pages/Perf_usuarios.jsx";
import Vendedores from "./pages/Vendedores.jsx";
import Compras from "./pages/Compras.jsx";
import Vendas from "./pages/Vendas.jsx";
import Contas from "./pages/Contas.jsx";
import Pdv from "./pages/Pdv.jsx";
import Auditoria from "./pages/Auditoria.jsx";
import Secao from "./pages/Secao.jsx";
import Marcas from "./pages/Marcas.jsx";
import Grupo from "./pages/Grupo.jsx";
import UnidadesMedida from "./pages/UnidadesMedida.jsx";
import Cidades from "./pages/Cidades.jsx";
import Orcamentos from "./pages/Orcamentos.jsx"
import ContasPagar from "./components/ContasPagar.jsx";
import ContasReceber from "./components/ContasReceber.jsx";
import VendasPorPeriodo from "./pages/VendasPorPeriodo.jsx";
import ComissaoVendedor from "./pages/ComissaoVendedor.jsx";

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
          <Route path="/auditoria" element={<Auditoria />} />
          <Route path="/secoes" element={<Secao />} />
          <Route path="/grupos" element={<Grupo />} />
          <Route path="/marcas" element={<Marcas />} />
          <Route path="/unidade-medida" element={<UnidadesMedida />} />
          <Route path="/cidades" element={<Cidades />} />
          <Route path="/orcamentos" element={<Orcamentos />} />
          <Route path="/contas-receber" element={<ContasReceber/>}/>
          <Route path="/contas-pagar" element={<ContasPagar/>}/>
          <Route path="/relatorios/vendasperiodo" element={<VendasPorPeriodo/>}/>
          <Route path="/relatorios/comissaovendedores" element={<ComissaoVendedor/>}/> 
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
