const express = require("express");
const router = express.Router();
const permission = require("../../services/auth_permission");
const auditoria = require("../../controllers/AuditoriaController");
const jwt = require("jsonwebtoken")

router.get(
  "/visualizar",
  async (req, res, next) => {
    const auth = req.headers["authorization"];
    if (auth != undefined) {
      let bearer = auth.split(" ");
      let token = bearer[1];
      try {
        let decoded = jwt.decode(token, process.env.SECTK);
        (await permission(decoded.id, 94))
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
  },
  auditoria.visualizarAuditoria
);

module.exports = router;
