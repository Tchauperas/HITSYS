import { useState } from "react"
import "./Login.css"

function Login() {
  const [login, setLogin] = useState("")
  const [senha, setSenha] = useState("")
  const [mensagem, setMensagem] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await fetch("http://127.0.0.1:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          login: login,
          senha_hash: senha,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        window.electronAPI?.loginSuccess(data)
      } else {
        alert("Erro ao realizar login: ", data.message)
      }
    } catch (error) {
      alert("Erro de conexão com servidor: ", error)
    }
  }

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-box">
        <div className="logo-name-box">
          <h1 className="logo-name">
            {" "}
            <img
              src="src\ui\assets\logo_hitsys.png"
              alt="Logo"
              className="logo"
            />
            HITSYS
          </h1>
        </div>
        <div className="inputs">
          <div className="input-group">
            <label htmlFor="login">Login</label>
            <input
              type="text"
              id="login"
              placeholder="Digite seu usuário"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="senha">Senha</label>
            <input
              type="password"
              id="senha"
              placeholder="Digite sua senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>
        </div>
        <button type="submit" className="btn-login">
          Entrar
        </button>

        {mensagem && <p className="mensagem">{mensagem}</p>}
      </form>
    </div>
  )
}

export default Login
