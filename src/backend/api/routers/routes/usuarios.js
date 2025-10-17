const express = require("express");
const router = express.Router();
const user = require("../../controllers/UsuarioController");

router.post("/cadastrar", user.sign_in);
router.get("/visualizar", user.viewUsers)

module.exports = router;
