const user = require("../models/Usuario");
const bcrypt = require("bcryptjs");

class UsuarioController {
  async sign_in(req, res) {
    let { nome, login, senha_hash, id_perfil_usuario, id_permissoes, ativo } =
      req.body;
    try {
      let result = await user.sign_in(
        nome,
        login,
        senha_hash,
        id_perfil_usuario,
        id_permissoes,
        ativo
      );
      result.validated
        ? res.status(200).json({ success: true })
        : res.status(400).json({
            success: false,
            message: `Erro ao incluir usuário: ${result.error}`,
          });
    } catch (e) {
      res.status(500).json({
        success: false,
        message: `Erro na aplicação: ${e.message}`,
      });
    }
  }

  async login(req, res) {
    try {
      let { login, senha_hash } = req.body;
      let data = await user.findByLogin(login);

      if (await bcrypt.compare(senha_hash, data.values[0].senha_hash)) {
        res.status(201).json({ success: true, message: "Usuário autenticado" });
      } else {
        res.status(403).json({ success: false, message: "Senha inválida" });
      }
    } catch (e) {
      res
        .status(500)
        .json({ success: false, message: `Erro na aplicação: ${e.message}` });
    }
  }
}

module.exports = new UsuarioController();
