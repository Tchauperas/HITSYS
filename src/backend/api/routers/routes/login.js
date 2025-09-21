const express = require("express");
const router = express.Router();
const usuario = require("../../controllers/UsuarioController");

router.get("/", (req, res) => {
  res.redirect("http://localhost:5173/");
});

router.post("/login", usuario.login);

module.exports = router;
