const permission = require("../services/auth_permission");
const jwt = require("jsonwebtoken");
require("dotenv").config();

class PessoaAuth {
  async visualiza_pessoa(req, res, next) {
    const auth = req.headers["authorization"];
    if (auth != undefined) {
      let bearer = auth.split(" ");
      let token = bearer[1];
      try {
        let decoded = jwt.decode(token, process.env.SECTK);
        await permission(decoded.id, 5)
          ? next()
          : res.status(401).json({
              success: false,
              message: "O usuário não pode realizar essa ação.",
            });
      } catch (e) {
        res.status(500).json({
          success: false,
          message: `Internal server error: ${e}`,
        });
      }
    } else {
      res
        .status(401)
        .json({ success: false, message: "Usuário não autenticado" });
    }
  }

  async insere_pessoa(req, res, next) {
    const auth = req.headers["authorization"];
    if (auth != undefined) {
      let bearer = auth.split(" ");
      let token = bearer[1];
      try {
        let decoded = jwt.decode(token, process.env.SECTK);
        await permission(decoded.id, 6)
          ? next()
          : res.status(401).json({
              success: false,
              message: "O usuário não pode realizar essa ação.",
            });
      } catch (e) {
        res.status(500).json({
          success: false,
          message: `Internal server error: ${e}`,
        });
      }
    } else {
      res
        .status(401)
        .json({ success: false, message: "Usuário não autenticado" });
    }
  }

  async altera_pessoa(req, res, next) {
    const auth = req.headers["authorization"];
    if (auth != undefined) {
      let bearer = auth.split(" ");
      let token = bearer[1];
      try {
        let decoded = jwt.decode(token, process.env.SECTK);
        await permission(decoded.id, 7)
          ? next()
          : res.status(401).json({
              success: false,
              message: "O usuário não pode realizar essa ação.",
            });
      } catch (e) {
        res.status(500).json({
          success: false,
          message: `Internal server error: ${e}`,
        });
      }
    } else {
      res
        .status(401)
        .json({ success: false, message: "Usuário não autenticado" });
    }
  }

  async deleta_pessoa(req, res, next) {
    const auth = req.headers["authorization"];
    if (auth != undefined) {
      let bearer = auth.split(" ");
      let token = bearer[1];
      try {
        let decoded = jwt.decode(token, process.env.SECTK);
        await permission(decoded.id, 8)
          ? next()
          : res.status(401).json({
              success: false,
              message: "O usuário não pode realizar essa ação.",
            });
      } catch (e) {
        res.status(500).json({
          success: false,
          message: `Internal server error: ${e}`,
        });
      }
    } else {
      res
        .status(401)
        .json({ success: false, message: "Usuário não autenticado" });
    }
  }
}

module.exports = new PessoaAuth();
