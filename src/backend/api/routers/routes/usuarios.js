const express = require("express");
const router = express.Router();
const user = require("../../controllers/UsuarioController");

router.get("/", (req, res) => {
  res.redirect("http://localhost:5173/usuarios");
});

router.post("/cadastrar", user.sign_in);

module.exports = router;
