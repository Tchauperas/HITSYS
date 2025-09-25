import "./Navbar.css"

const Navbar = () => {
  return (
    <>
      <div className="sidebar">
        <img
          className="logo"
          src="src\ui\assets\logo_mista.jpg"
          alt="Logo Hitsys"
        />
        <div className="topButtons">
          <button
            onClick={() =>
              (window.location.href = "http://localhost:3000/home")
            }
          >
            <img
              className="sideIcon"
              src="src\ui\assets\home_icon.png"
              alt="home"
            />
            Home
          </button>

          <button
            onClick={() =>
              (window.location.href = "http://localhost:3000/empresas")
            }
          >
            <img
              className="sideIcon"
              src="src\ui\assets\empresas_icon.png"
              alt="home"
            />
            Empresas
          </button>

          <button
            onClick={() =>
              (window.location.href = "http://localhost:3000/pessoas")
            }
          >
            <img
              className="sideIcon"
              src="src\ui\assets\pessoas_icon.png"
              alt="home"
            />
            Pessoas
          </button>

          <button
            onClick={() =>
              (window.location.href = "http://localhost:3000/produtos")
            }
          >
            <img
              className="sideIcon"
              src="src\ui\assets\produtos_icon.png"
              alt="home"
            />
            Produtos
          </button>

          <button
            onClick={() =>
              (window.location.href = "http://localhost:3000/usuarios")
            }
          >
            <img
              className="sideIcon"
              src="src\ui\assets\usuarios_icon.png"
              alt="home"
            />
            Usuários
          </button>

          <button
            onClick={() =>
              (window.location.href = "http://localhost:3000/perf_usuarios")
            }
          >
            <img
              className="sideIcon"
              src="src\ui\assets\perfis_icon.png"
              alt="home"
            />
            Perfis de Usuários
          </button>

          <button
            onClick={() =>
              (window.location.href = "http://localhost:3000/vendedores")
            }
          >
            <img
              className="sideIcon"
              src="src\ui\assets\vendedores_icon.png"
              alt="home"
            />
            Vendedores
          </button>
        </div>
        <div className="bottomButtons">
          <button
            onClick={() =>
              (window.location.href = "http://localhost:3000/compras")
            }
          >
            <img
              className="sideIcon"
              src="src\ui\assets\compras_icon.png"
              alt="home"
            />
            Compras
          </button>

          <button
            onClick={() =>
              (window.location.href = "http://localhost:3000/vendas")
            }
          >
            <img
              className="sideIcon"
              src="src\ui\assets\vendas_icon.png"
              alt="home"
            />
            Vendas
          </button>

          <button
            onClick={() =>
              (window.location.href = "http://localhost:3000/contas")
            }
          >
            <img
              className="sideIcon"
              src="src\ui\assets\contas_icon.png"
              alt="home"
            />
            Contas
          </button>
        </div>
      </div>
    </>
  )
}

export default Navbar
