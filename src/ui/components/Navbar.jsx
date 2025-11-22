import "./Navbar.css";
import logo from "../assets/logo_mista.jpg";

import homeIcon from "../assets/home_icon.png";
import empresasIcon from "../assets/empresas_icon.png";
import pessoasIcon from "../assets/pessoas_icon.png";
import produtosIcon from "../assets/produtos_icon.png";
import usuariosIcon from "../assets/usuarios_icon.png";
import perfisIcon from "../assets/perfis_icon.png";
import vendedoresIcon from "../assets/vendedores_icon.png";
import voltarIcon from "../assets/voltar_icon.png";

import comprasIcon from "../assets/compras_icon.png";
import vendasIcon from "../assets/vendas_icon.png";
import pdvIcon from "../assets/pdv_icon.png";

import formaPagamentoIcon from "../assets/forma_pagamento_icon.png";
import orcamentosIcon from "../assets/orcamentos_icon.png";
import cadastrosIcon from "../assets/cadastros_icon.png";
import gruposIcon from "../assets/grupos_icon.png";
import cidadesIcon from "../assets/cidades_icon.png";
import relatoriosIcon from "../assets/relatorios_icon.png";
import marcasIcon from "../assets/marcas_icon.png";
import secoesIcon from "../assets/secoes_icon.png"; 
import contasIcon from "../assets/contas_icon.png";

import { useNavigate } from "react-router-dom";
import { useState } from "react";

const ReceberIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24">
    <line x1="12" y1="4" x2="12" y2="14" stroke="white" strokeWidth="2.4" strokeLinecap="round" />
    <polyline points="7 10 12 15 17 10" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

const PagarIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24">
    <line x1="12" y1="20" x2="12" y2="10" stroke="white" strokeWidth="2.4" strokeLinecap="round" />
    <polyline points="7 14 12 9 17 14" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

const AuditoriaIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="7" stroke="white" strokeWidth="2" fill="none" />
    <line x1="16" y1="16" x2="21" y2="21" stroke="white" strokeWidth="2" strokeLinecap="round" />
    <line x1="11" y1="8" x2="11" y2="12" stroke="white" strokeWidth="2" strokeLinecap="round" />
    <circle cx="11" cy="14.5" r="1" fill="white" />
  </svg>
);

// Unidade de Medida icon
const UnidadeIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24">
    <rect x="4" y="6" width="16" height="12" rx="2" fill="none" stroke="white" strokeWidth="1.6" />
    <circle cx="8.5" cy="12" r="1.2" fill="white" />
    <path d="M11 9h6" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const Navbar = () => {
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(() => {
    try {
      return localStorage.getItem("openMenu") || null;
    } catch {
      return null;
    }
  });

  const toggleMenu = (menu) => {
    const novo = openMenu === menu ? null : menu;
    setOpenMenu(novo);
    try {
      localStorage.setItem("openMenu", novo);
    } catch {}
  };

  const navegar = (rota) => navigate(rota);

  return (
    <div className="sidebar">
      <img className="logo" src={logo} alt="Logo Hitsys" />
      <div className="topButtons">

        {/* HOME */}
        <button onClick={() => navegar("/home")}>
          <img className="sideIcon" src={homeIcon} alt="home" />
          Home
        </button>

        {/* PESSOAS */}
        <button onClick={() => navegar("/pessoas")}>
          <img className="sideIcon" src={pessoasIcon} alt="pessoas" />
          Pessoas
        </button>

        {/* PRODUTOS */}
        <button onClick={() => navegar("/produtos")}>
          <img className="sideIcon" src={produtosIcon} alt="produtos" />
          Produtos
        </button>

        {/* ORÇAMENTOS */}
        <button onClick={() => navegar("/orcamentos")}>
          <img className="sideIcon" src={orcamentosIcon} alt="Orçamentos" />
          Orçamentos
        </button>

        {/* VENDAS */}
        <button onClick={() => navegar("/vendas")}>
          <img className="sideIcon" src={vendasIcon} alt="vendas" />
          Vendas
        </button>

        {/* COMPRAS */}
        <button onClick={() => navegar("/compras")}>
          <img className="sideIcon" src={comprasIcon} alt="compras" />
          Compras
        </button>

        {/* CONTAS */}
        <button className="submenu-toggle" onClick={(e) => { e.stopPropagation(); toggleMenu("contas"); }}>
          <img className="sideIcon" src={contasIcon} alt="Contas" />
          Contas ▸
        </button>

        {openMenu === "contas" && (
          <div className="submenu" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => navegar("/contas-receber")}>
              <ReceberIcon className="sideIcon" /> Receber
            </button>
            <button onClick={() => navegar("/contas-pagar")}>
              <PagarIcon className="sideIcon" /> Pagar
            </button>
          </div>
        )}

        {/* PDV */}
        <button onClick={() => navegar("/pdv")}>
          <img className="sideIcon" src={pdvIcon} alt="pdv" />
          PDV
        </button>

        {/* CADASTROS */}
        <button className="submenu-toggle" onClick={(e) => { e.stopPropagation(); toggleMenu("cadastros"); }}>
          <img className="sideIcon" src={cadastrosIcon} alt="Cadastros" />
          Cadastros ▸
        </button>

        {openMenu === "cadastros" && (
          <div className="submenu" onClick={(e) => e.stopPropagation()}>

            <button onClick={() => navegar("/empresas")}>
              <img className="sideIcon" src={empresasIcon} /> Empresas
            </button>
            
            <button onClick={() => navegar("/usuarios")}>
              <img className="sideIcon" src={usuariosIcon} /> Usuários
            </button>
            
            <button onClick={() => navegar("/perf_usuarios")}>
              <img className="sideIcon" src={perfisIcon} /> Perfis de Usuários
            </button>
            
            <button onClick={() => navegar("/vendedores")}>
              <img className="sideIcon" src={vendedoresIcon} /> Vendedores
            </button>
            
            <button onClick={() => navegar("/formas-pagamento")}>
              <img className="sideIcon" src={formaPagamentoIcon} /> Formas de Pagamento
            </button>
            
            <button onClick={() => navegar("/unidade-medida")}>
              <UnidadeIcon className="sideIcon" /> Unidade de Medida
            </button>
            
            <button onClick={() => navegar("/secoes")}>
              <img className="sideIcon" src={secoesIcon} /> Seções
            </button>
            
            <button onClick={() => navegar("/grupos")}>
              <img className="sideIcon" src={gruposIcon} /> Grupos
            </button>
            
            <button onClick={() => navegar("/marcas")}>
              <img className="sideIcon" src={marcasIcon} /> Marcas
            </button>
            
            <button onClick={() => navegar("/cidades")}>
              <img className="sideIcon" src={cidadesIcon} /> Cidades
            </button>
          </div>
        )}

         {/* RELATÓRIOS */}
        <button
          className="submenu-toggle"
          onClick={(e) => {
            e.stopPropagation();
            toggleMenu("relatorios");
          }}
        >
          <img className="sideIcon" src={relatoriosIcon} alt="Relatórios"/>
          Relatórios ▸
        </button>

        {openMenu === "relatorios" && (
          <div className="submenu" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => navegar("/relatorios/vendasperiodo")}>
              ▸ Vendas por Período
            </button>
            <button onClick={() => navegar("/relatorios/comissaovendedores")}>
              ▸ Comissão de vendedores
            </button>
          </div>
        )}

        {/* AUDITORIA */}
        <button onClick={() => navegar("/auditoria")}>
          <AuditoriaIcon className="sideIcon" /> Auditoria
        </button>

        {/* SAIR */}
        <button onClick={() => navegar("/")}>
          <img src={voltarIcon} className="sideIcon" /> Sair
        </button>
      </div>
    </div>
  );
};

export default Navbar;
