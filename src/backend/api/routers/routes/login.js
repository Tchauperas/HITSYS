const express = require("express");
const router = express.Router();
const usuario = require("../../controllers/UsuarioController");
const path = require("path")

const rendererPath = path.join(__dirname, "../../../../../renderer")
router.use(express.static(rendererPath))

router.get("/", (req, res) => {
  //res.sendFile(path.join(rendererPath, "index.html"))
  res.redirect("http://localhost:5173/")
});

router.post("/login", usuario.login);

module.exports = router;
