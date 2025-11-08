const express = require("express");
const router = express.Router();
const perm = require("../../controllers/PermissoesController");

// lista todas as ações disponíveis
router.get("/acoes", perm.listarAcoes);

// lista ids de ações permitidas para um perfil
router.get("/:id", perm.listarPermissoesPerfil);

// atualiza permissões de um perfil (substitui)
router.put("/:id", perm.atualizarPermissoesPerfil);

module.exports = router;
