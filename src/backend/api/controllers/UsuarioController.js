const user = require("../models/Usuario");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

class UsuarioController {
  async sign_in(req, res) {
    let { nome, login, senha_hash, id_perfil_usuario, ativo } = req.body;
    try {
      let result = await user.sign_in(
        nome,
        login,
        senha_hash,
        id_perfil_usuario,
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
      let usuario = await user.findByLogin(login);
      let data = usuario.values[0];

      if (await bcrypt.compare(senha_hash, data.senha_hash)) {
        let token = jwt.sign(
          { id: data.id_usuario, id_perfil: data.id_perfil_usuario },
          process.env.SECTK,
          { expiresIn: 5000 }
        );
        res.status(201).json({
          success: true,
          token: token,
        });
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
