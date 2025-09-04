const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = function auth_admin(req, res, next) {
  try {
    const auth = req.headers["authorization"];
    if (!(auth = undefined)) {
      const bearer = auth.split(" ");
      let token = bearer[1];
      try {
        let decoded = jwt.decode(token, process.env.SECTK);
        return decoded.id_perfil_usuario === 1
          ? next()
          : res
              .status(401)
              .json({
                success: false,
                message: "Usuário não autorizado ao realizar essa operação",
              });
      } catch (e) {
        res
          .status(500)
          .json({
            success: false,
            message: `Authentication error: ${e.message}`,
          });
      }
    } else {
      res.status(401).json({ success: false, message: "Invalid token" });
    }
  } catch (e) {
    res
      .status(500)
      .json({ success: false, message: `Internal server error: ${e.message}` });
  }
};
