const express = require("express");
const router = express.Router();
const user = require("../../controllers/UsuarioController");

router.post("/cadastrar", user.sign_in);

module.exports = router;
