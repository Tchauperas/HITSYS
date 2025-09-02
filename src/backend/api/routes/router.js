const express = require("express");
const router = express.Router();

const usuario = require("../controllers/UsuarioController")

router.get("/", (req, res) => {
    res.send("API funcionando")
})

router.post("/sign_in", usuario.sign_in)
router.post("/login", usuario.login)

module.exports = router;