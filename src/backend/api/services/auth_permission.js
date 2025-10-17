const db = require("../configs/config");

module.exports = async function hasPermission(userId, idAcao) {
  if (!userId || !idAcao) {
    console.error("hasPermission: parâmetros inválidos", { userId, idAcao });
    throw new Error("Parâmetros userId e idAcao são obrigatórios");
  }

  const result = await db("permissoes")
    .join(
      "perfis_usuarios",
      "permissoes.id_perfil_usuario",
      "perfis_usuarios.id_perfil_usuario"
    )
    .join(
      "usuarios",
      "perfis_usuarios.id_perfil_usuario",
      "usuarios.id_perfil_usuario"
    )
    .where("usuarios.id_usuario", userId)
    .andWhere("permissoes.id_acao", idAcao)
    .first("permissoes.id_acao");

  return !!result;
};
