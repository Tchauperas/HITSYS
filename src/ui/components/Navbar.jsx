import "./Navbar.css";
import logo from "../assets/logo_mista.jpg";

import logoHitsys from "../assets/logo_hitsys_sem_fundo.png"
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
import auditoriaIcon from "../assets/auditoria_icon.png";
import unidadeMedidaIcon from "../assets/unidades_medida_icon.png";
import pagarIcon from "../assets/pagar_icon.png";
import receberIcon from "../assets/receber_icon.png";
import vendasPeriodoIcon from "../assets/vendas_periodo_icon.png";
import comissaoVendedores from "../assets/comissao_vendedores_icon.png";





import { useNavigate } from "react-router-dom";
import { useState } from "react";



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
      <div className="logo-container">
        <img src={logoHitsys} alt="Logo HITSYS" className="logo-image" />
        <div className="logo-text">HITSYS</div>
      </div>
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
              <img className="sideIcon" src={receberIcon} alt="Receber" /> Receber
            </button>
            <button onClick={() => navegar("/contas-pagar")}>
              <img className="sideIcon" src={pagarIcon} alt="Pagar" /> Pagar
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
              <img className="sideIcon" src={unidadeMedidaIcon} alt="Unidade de Medida" /> Unidades de Medida
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
              <img className="sideIcon" src={vendasPeriodoIcon} alt="Vendas por Período" />
               Vendas por Período
          </button>

            <button onClick={() => navegar("/relatorios/comissaoVendedores")}>
              <img className="sideIcon" src={comissaoVendedores} alt="Comissão de Vendedores" />
               Comissão de Vendedores
          </button>

          </div>
        )}

        {/* AUDITORIA */}
        <button onClick={() => navegar("/auditoria")}>
          <img className="sideIcon" src={auditoriaIcon} alt="Auditoria" /> Auditoria
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
