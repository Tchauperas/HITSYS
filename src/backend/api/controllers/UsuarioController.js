const user = require("../models/Usuario");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const permission = require("../services/auth_permission");
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

      if (usuario.validated) {
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
            data: data,
          });
        } else {
          res.status(403).json({ success: false, message: `Senha inválida` });
        }
      } else {
        res.status(404).json({ success: false, message: usuario.error });
      }
    } catch (e) {
      res
        .status(500)
        .json({ success: false, message: `Erro na aplicação: ${e.message}` });
    }
  }

  async viewUsers(req, res) {
    try {
      let result = await user.viewUsers();
      result.validated
        ? res.status(201).json({ success: true, values: result.values })
        : res.status(400).json({
            success: false,
            message: `Erro ao listar usuários: ${result.error}`,
          });
    } catch (e) {
      res.status(500).json({
        success: false,
        message: `Internal server error: ${e.message}`,
      });
    }
  }

  async updateUser(req, res) {
    try {
      const { id } = req.params; // ID do usuário a ser atualizado
      const fieldsToUpdate = req.body; // Campos a serem atualizados

      const result = await user.updateUser(id, fieldsToUpdate);

      if (result.validated) {
        res.status(200).json({ success: true, message: result.message });
      } else {
        res.status(404).json({ success: false, message: result.error });
      }
    } catch (e) {
      res.status(500).json({
        success: false,
        message: `Erro na aplicação: ${e.message}`,
      });
    }
  }

  async deleteUser(req, res) {
    try {
      const { id } = req.params; // ID do usuário a ser excluído

      const result = await user.deleteUser(id);

      if (result.validated) {
        res.status(200).json({ success: true, message: result.message });
      } else {
        res.status(404).json({ success: false, message: result.error });
      }
    } catch (e) {
      res.status(500).json({
        success: false,
        message: `Erro na aplicação: ${e.message}`,
      });
    }
  }
}

module.exports = new UsuarioController();
