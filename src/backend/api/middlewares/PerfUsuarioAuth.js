const permission = require("../services/auth_permission");
const jwt = require("jsonwebtoken");
require("dotenv").config();

class PerfUsuarioAuth {
  async visualiza_perfil(req, res, next) {
    const auth = req.headers["authorization"];
    if (auth != undefined) {
      let bearer = auth.split(" ");
      let token = bearer[1];
      try {
        let decoded = jwt.decode(token, process.env.SECTK);
        await permission(decoded.id, 18)
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

  async insere_perfil(req, res, next) {
    const auth = req.headers["authorization"];
    if (auth != undefined) {
      let bearer = auth.split(" ");
      let token = bearer[1];
      try {
        let decoded = jwt.decode(token, process.env.SECTK);
        await permission(decoded.id, 19)
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

  async altera_perfil(req, res, next) {
    const auth = req.headers["authorization"];
    if (auth != undefined) {
      let bearer = auth.split(" ");
      let token = bearer[1];
      try {
        let decoded = jwt.decode(token, process.env.SECTK);
        await permission(decoded.id, 20)
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

  async deleta_perfil(req, res, next) {
    const auth = req.headers["authorization"];
    if (auth != undefined) {
      let bearer = auth.split(" ");
      let token = bearer[1];
      try {
        let decoded = jwt.decode(token, process.env.SECTK);
        await permission(decoded.id, 21)
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

  async altera_permissoes(req, res, next) {
    const auth = req.headers["authorization"];
    if (auth != undefined) {
      let bearer = auth.split(" ");
      let token = bearer[1];
      try {
        let decoded = jwt.decode(token, process.env.SECTK);
        await permission(decoded.id, 22)
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

module.exports = new PerfUsuarioAuth();
