const db = require("../configs/config");

class Auditoria {
  async visualizarAuditoria() {
    try {
      let data = await db
        .select(
          "auditoria.*",
          "usuarios.nome as nome_usuario"
        )
        .table("auditoria")
        .leftJoin("usuarios", "auditoria.id_usuario", "usuarios.id_usuario");
      if (data.length <= 0)
        return { validated: false, error: "Sem dados para consulta" };
      return { validated: true, values: data };
    } catch (e) {
      return { validated: false, error: e };
    }
  }
}

module.exports = new Auditoria();
