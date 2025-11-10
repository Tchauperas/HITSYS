const permission = require("../services/auth_permission");
const jwt = require("jsonwebtoken");
require("dotenv").config();

class SecaoAuth {
  async visualiza_secao(req, res, next) {
    const auth = req.headers["authorization"];
    if (auth != undefined) {
      let bearer = auth.split(" ");
      let token = bearer[1];
      try {
        let decoded = jwt.decode(token, process.env.SECTK);
        (await permission(decoded.id, 27))
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

  async insere_secao(req, res, next) {
    const auth = req.headers["authorization"];
    if (auth != undefined) {
      let bearer = auth.split(" ");
      let token = bearer[1];
      try {
        let decoded = jwt.decode(token, process.env.SECTK);
        (await permission(decoded.id, 28))
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

  async altera_secao(req, res, next) {
    const auth = req.headers["authorization"];
    if (auth != undefined) {
      let bearer = auth.split(" ");
      let token = bearer[1];
      try {
        let decoded = jwt.decode(token, process.env.SECTK);
        (await permission(decoded.id, 29))
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

  async deleta_secao(req, res, next) {
    const auth = req.headers["authorization"];
    if (auth != undefined) {
      let bearer = auth.split(" ");
      let token = bearer[1];
      try {
        let decoded = jwt.decode(token, process.env.SECTK);
        (await permission(decoded.id, 30))
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

module.exports = SecaoAuth();
