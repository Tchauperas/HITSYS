import "./Navbar.css"

const Navbar = () => {
  return (
    <>
      <div>
        <button
          onClick={() => (window.location.href = "http://localhost:3000/home")}
        >
          Home Button
        </button>

        <button
          onClick={() =>
            (window.location.href = "http://localhost:3000/empresas")
          }
        >
          Empresas
        </button>

        <button
          onClick={() =>
            (window.location.href = "http://localhost:3000/pessoas")
          }
        >
          Pessoas
        </button>

        <button
          onClick={() =>
            (window.location.href = "http://localhost:3000/produtos")
          }
        >
          Produtos
        </button>

        <button
          onClick={() =>
            (window.location.href = "http://localhost:3000/usuarios")
          }
        >
          Usuários
        </button>

        <button
          onClick={() =>
            (window.location.href = "http://localhost:3000/perf_usuarios")
          }
        >
          Perfis de Usuários
        </button>

        <button
          onClick={() =>
            (window.location.href = "http://localhost:3000/vendedores")
          }
        >
          Vendedores
        </button>

        <button
          onClick={() =>
            (window.location.href = "http://localhost:3000/compras")
          }
        >
          Compras
        </button>

        <button
          onClick={() =>
            (window.location.href = "http://localhost:3000/vendas")
          }
        >
          Vendas
        </button>

        <button
          onClick={() =>
            (window.location.href = "http://localhost:3000/contas")
          }
        >
          Contas
        </button>
      </div>
    </>
  );
};

export default Navbar;
