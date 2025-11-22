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

import { useNavigate } from "react-router-dom";
import { useState } from "react";


// Ícone Cadastros (mantido)
const CadastrosIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="6" rx="1.5" fill="white" />
    <rect x="3" y="12" width="18" height="8" rx="1.5" fill="white" />
  </svg>
);

// Ícone Contas (mantido)
const ContasIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24">
    <rect x="3" y="6" width="18" height="12" rx="2" fill="white" />
    <path d="M3 10h18" stroke="#0f6ac5" strokeWidth="1" fill="none" />
    <circle cx="8" cy="12" r="1.2" fill="#0f6ac5" />
  </svg>
);

// Ícone Relatórios (mantido)
const RelatoriosIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24">
    <rect x="3" y="4" width="14" height="16" rx="1.5" fill="white" />
    <path
      d="M9 8h6M9 12h6M9 16h4"
      stroke="#0f6ac5"
      strokeWidth="1.4"
      strokeLinecap="round"
    />
    <rect x="19" y="7" width="2" height="10" rx="1" fill="white" />
  </svg>
);

// Ícone MOV (mantido estilo carro/carrinho)
const MovIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24">
    <path
      d="M3 7h14l4 6H7"
      fill="none"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="8" cy="19" r="1.5" fill="white" />
    <circle cx="18" cy="19" r="1.5" fill="white" />
  </svg>
);

// Ícone RECEBER (substituído por seta para baixo)
const ReceberIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24">
    <line x1="12" y1="4" x2="12" y2="14" stroke="white" strokeWidth="2.4" strokeLinecap="round" />
    <polyline points="7 10 12 15 17 10" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

// Ícone PAGAR (substituído por seta para cima)
const PagarIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24">
    <line x1="12" y1="20" x2="12" y2="10" stroke="white" strokeWidth="2.4" strokeLinecap="round" />
    <polyline points="7 14 12 9 17 14" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

// Ícone Auditoria (mantido)
const AuditoriaIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="7" stroke="white" strokeWidth="2" fill="none" />
    <line x1="16" y1="16" x2="21" y2="21" stroke="white" strokeWidth="2" strokeLinecap="round" />
    <line x1="11" y1="8" x2="11" y2="12" stroke="white" strokeWidth="2" strokeLinecap="round" />
    <circle cx="11" cy="14.5" r="1" fill="white" />
  </svg>
);

/* ---------- ícones embutidos para assets que estavam faltando ---------- */

// Orçamentos icon (substitui orcamentosIcon)
const OrcamentosIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24">
    <rect x="3.5" y="4.5" width="13" height="15" rx="1.2" fill="white" />
    <path d="M9 8h5M9 12h6" stroke="#0f6ac5" strokeWidth="1.2" strokeLinecap="round" />
    <rect x="18.5" y="7.5" width="2" height="10" rx="1" fill="white" />
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

// Seções icon
const SecoesIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24">
    <rect x="4" y="4" width="6" height="6" rx="1" fill="white" />
    <rect x="14" y="4" width="6" height="6" rx="1" fill="white" />
    <rect x="4" y="14" width="6" height="6" rx="1" fill="white" />
    <rect x="14" y="14" width="6" height="6" rx="1" fill="white" />
  </svg>
);

// Grupos icon
const GruposIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24">
    <circle cx="8" cy="8" r="2.2" fill="white" />
    <circle cx="16" cy="8" r="2.2" fill="white" />
    <circle cx="12" cy="15" r="2.5" fill="white" />
  </svg>
);

// Marcas icon
const MarcasIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24">
    <rect x="4" y="7" width="16" height="10" rx="2" fill="white" />
    <path d="M8 11h8" stroke="#0f6ac5" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

// Cidades icon
const CidadesIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24">
    <rect x="3" y="8" width="5" height="8" fill="white" />
    <rect x="10" y="6" width="4" height="10" fill="white" />
    <rect x="16" y="9" width="4" height="7" fill="white" />
  </svg>
);

/* --------------------------------------------------------
   COMPONENTE NAVBAR
--------------------------------------------------------- */

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

  const navegar = (rota) => {
    navigate(rota);
  };

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
          <OrcamentosIcon className="sideIcon" />
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
        <button
          className="submenu-toggle"
          onClick={(e) => {
            e.stopPropagation();
            toggleMenu("contas");
          }}
        >
          <ContasIcon className="sideIcon" />
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

        {/* RELATÓRIOS */}
        <button
          className="submenu-toggle"
          onClick={(e) => {
            e.stopPropagation();
            toggleMenu("relatorios");
          }}
        >
          <RelatoriosIcon className="sideIcon" />
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

        {/* CADASTROS */}
        <button
          className="submenu-toggle"
          onClick={(e) => {
            e.stopPropagation();
            toggleMenu("cadastros");
          }}
        >
          <CadastrosIcon className="sideIcon" />
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
              <SecoesIcon className="sideIcon" /> Seções
            </button>

            <button onClick={() => navegar("/grupos")}>
              <GruposIcon className="sideIcon" /> Grupos
            </button>

            <button onClick={() => navegar("/marcas")}>
              <MarcasIcon className="sideIcon" /> Marcas
            </button>

            <button onClick={() => navegar("/cidades")}>
              <CidadesIcon className="sideIcon" /> Cidades
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