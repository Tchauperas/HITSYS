import Navbar from "../components/Navbar"
import logo from "..//assets/empresas_icon.png"
import voltar_icon from "..//assets/voltar_icon.png"
import "./Cadastro_empresas.css"

const Cadastro_empresas = () => {
  return (
    <>
      <div className="cadastro_empresas-container">
        <Navbar></Navbar>
        <div className="content">
          <form
            onSubmit={(e) => {
              e.preventDefault() /* enviar dados */
            }}
          >
            <header className="top-row">
              <div className="title">
                <span className="building-icon"></span>
                <img src={logo} alt="Logo" className="logo" />
                <h1>Cadastro de Empresas</h1>
              </div>
              <div className="right-actions">
                <button
                  type="submit"
                  className="btn-salvar"
                  onClick={() => alert("Salvamo, confia 😀👍")}
                >
                  Salvar
                </button>
                <button className="btn-voltar">
                  <img src={voltar_icon} alt="Voltar" className="voltar_icon" />
                </button>
              </div>
            </header>

            {/* ROTA AINDA NÃO EXISTENTE */}
            <div className="status_row">
              <label class="status_empresa">
                <input type="checkbox" />
                <span class="slider"></span>
                Ativa
              </label>
            </div>
            <div className="campos_cadastro">
              <label htmlFor="razao">Razão Social:</label>
              <input
                type="text"
                id="razao"
                name="razao"
                placeholder="Digite a Razão Social"
                required
              />

              <label htmlFor="cnpj">CNPJ:</label>
              <input
                type="text"
                id="cnpj"
                name="cnpj"
                placeholder="00.000.000/0000-00"
                required
              />

              <label htmlFor="fantasia">Nome Fantasia:</label>
              <input
                type="text"
                id="fantasia"
                name="fantasia"
                placeholder="Digite o Nome Fantasia"
                required
              />

              <label htmlFor="ie">Inscrição Estadual (IE):</label>
              <input type="text" id="ie" name="ie" placeholder="Digite a IE" />

              <label htmlFor="logradouro">Logradouro:</label>
              <input
                type="text"
                id="logradouro"
                name="logradouro"
                placeholder="Rua, Avenida, etc."
                required
              />

              <label htmlFor="numero">N°:</label>
              <input
                type="text"
                id="numero"
                name="numero"
                placeholder="Número"
                required
              />

              <label htmlFor="bairro">Bairro:</label>
              <input
                type="text"
                id="bairro"
                name="bairro"
                placeholder="Digite o Bairro"
                required
              />

              <label htmlFor="complemento">Complemento:</label>
              <input
                type="text"
                id="complemento"
                name="complemento"
                placeholder="Ex: Apto, Bloco"
              />

              <label htmlFor="cidade">Cidade:</label>
              <input
                type="text"
                id="cidade"
                name="cidade"
                placeholder="Digite a Cidade"
                required
              />

              <label htmlFor="uf">UF:</label>
              <input
                type="text"
                id="uf"
                name="uf"
                placeholder="Ex: SP"
                maxLength="2"
                required
              />

              <label htmlFor="cep">CEP:</label>
              <input
                type="text"
                id="cep"
                name="cep"
                placeholder="00000-000"
                required
              />

              <label htmlFor="email">E-mail:</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="empresa@email.com"
                required
              />

              <label htmlFor="telefone">Telefone:</label>
              <input
                type="tel"
                id="telefone"
                name="telefone"
                placeholder="(00) 00000-0000"
                required
              />
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default Cadastro_empresas
