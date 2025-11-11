const express = require("express");
const router = express.Router();
const user = require("../../controllers/UsuarioController");
const auth = require("../../middlewares/UsuarioAuth");

router.post("/cadastrar", auth.insere_usuario, user.sign_in);
router.get("/visualizar", auth.visualiza_usuario, user.viewUsers);
router.get("/visualizar/:id", user.viewUser);
router.put("/atualizar/:id", auth.altera_usuario, user.updateUser);
router.delete("/excluir/:id", auth.deleta_usuario, user.deleteUser);

module.exports = router;
