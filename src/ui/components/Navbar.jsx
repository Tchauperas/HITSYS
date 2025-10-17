import "./Navbar.css";
import logo from "../assets/logo_mista.jpg";
import homeIcon from "../assets/home_icon.png";
import empresasIcon from "../assets/empresas_icon.png";
import pessoasIcon from "../assets/pessoas_icon.png";
import produtosIcon from "../assets/produtos_icon.png";
import usuariosIcon from "../assets/usuarios_icon.png";
import perfisIcon from "../assets/perfis_icon.png";
import vendedoresIcon from "../assets/vendedores_icon.png";
import comprasIcon from "../assets/compras_icon.png";
import vendasIcon from "../assets/vendas_icon.png";
import contasIcon from "../assets/contas_icon.png";

import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <div className="sidebar">
      <img className="logo" src={logo} alt="Logo Hitsys" />

      <div className="topButtons">
        <button onClick={() => navigate("/home")}>
          <img className="sideIcon" src={homeIcon} alt="home" />
          Home
        </button>

        <button onClick={() => navigate("/empresas")}>
          <img className="sideIcon" src={empresasIcon} alt="empresas" />
          Empresas
        </button>

        <button onClick={() => navigate("/pessoas")}>
          <img className="sideIcon" src={pessoasIcon} alt="pessoas" />
          Pessoas
        </button>

        <button onClick={() => navigate("/produtos")}>
          <img className="sideIcon" src={produtosIcon} alt="produtos" />
          Produtos
        </button>

        <button onClick={() => navigate("/usuarios")}>
          <img className="sideIcon" src={usuariosIcon} alt="usuarios" />
          Usuários
        </button>

        <button onClick={() => navigate("/perf_usuarios")}>
          <img className="sideIcon" src={perfisIcon} alt="perfis" />
          Perfis de Usuários
        </button>

        <button onClick={() => navigate("/vendedores")}>
          <img className="sideIcon" src={vendedoresIcon} alt="vendedores" />
          Vendedores
        </button>
      </div>

      <div className="bottomButtons">
        <button onClick={() => navigate("/compras")}>
          <img className="sideIcon" src={comprasIcon} alt="compras" />
          Compras
        </button>

        <button onClick={() => navigate("/vendas")}>
          <img className="sideIcon" src={vendasIcon} alt="vendas" />
          Vendas
        </button>

        <button onClick={() => navigate("/contas")}>
          <img className="sideIcon" src={contasIcon} alt="contas" />
          Contas
        </button>
      </div>
    </div>
  );
};

export default Navbar;