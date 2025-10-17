const express = require("express");
const path = require("path");
const router = express.Router();
const usuario = require("../../controllers/UsuarioController");

const rendererPath = path.join(__dirname, "../../../../../renderer");

router.use(express.static(rendererPath));

router.post("/login", usuario.login);

router.get("/", (req, res) => {
  res.sendFile(path.join(rendererPath, "index.html"));
});

module.exports = router;
