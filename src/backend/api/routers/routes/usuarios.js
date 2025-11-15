const express = require("express");
const router = express.Router();
const user = require("../../controllers/UsuarioController");
const auth = require("../../middlewares/UsuarioAuth");

router.post("/cadastrar", auth.insere_usuario, user.sign_in);
router.get("/visualizar", auth.visualiza_usuario, user.viewUsers);
router.get("/visualizar/:id", user.viewUser);
router.put("/atualizar/:id", auth.altera_usuario, user.updateUser);
router.delete("/excluir/:id", auth.deleta_usuario, user.deleteUser);

// Rota de teste (SEM autenticação) para facilitar criação de usuário via Postman
// Uso: POST /usuarios/cadastrar-test com body { nome, login, senha_hash, id_perfil_usuario, ativo }
// OBS: criada APENAS para testes; não usar em produção
router.post("/cadastrar-test", user.sign_in);

module.exports = router;
