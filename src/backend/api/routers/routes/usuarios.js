const express = require("express");
const router = express.Router();
const user = require("../../controllers/UsuarioController");

router.post("/cadastrar", user.sign_in);
router.get("/visualizar", user.viewUsers);
router.get("/visualizar/:id", user.viewUser);
router.put("/atualizar/:id", user.updateUser);
router.delete("/excluir/:id", user.deleteUser);

module.exports = router;
