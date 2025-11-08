const db = require("../configs/config");

class PermissoesController {
  async listarAcoes(req, res) {
    try {
      const acoes = await db.select("*").table("acoes");
      return res.status(200).json({ success: true, values: acoes });
    } catch (e) {
      return res.status(500).json({ success: false, message: e.message });
    }
  }

  async listarPermissoesPerfil(req, res) {
    try {
      const id = req.params.id;
      if (!id || isNaN(id)) return res.status(400).json({ success: false, message: "Id inválido" });
      const rows = await db.select("id_acao").where({ id_perfil_usuario: id }).table("permissoes");
      const ids = rows.map((r) => r.id_acao);
      return res.status(200).json({ success: true, values: ids });
    } catch (e) {
      return res.status(500).json({ success: false, message: e.message });
    }
  }

  async atualizarPermissoesPerfil(req, res) {
    const id = req.params.id;
    const { acoes } = req.body; // espera um array de ids
    if (!id || isNaN(id)) return res.status(400).json({ success: false, message: "Id inválido" });
    if (!Array.isArray(acoes)) return res.status(400).json({ success: false, message: "Campo 'acoes' inválido" });

    const trx = await db.transaction();
    try {
      // remove permissões antigas
      await trx("permissoes").where({ id_perfil_usuario: id }).del();

      // insere as novas (se houver)
      if (acoes.length > 0) {
        const inserts = acoes.map((idAcao) => ({ id_perfil_usuario: id, id_acao: idAcao }));
        await trx("permissoes").insert(inserts);
      }

      await trx.commit();
      return res.status(200).json({ success: true });
    } catch (e) {
      await trx.rollback();
      return res.status(500).json({ success: false, message: e.message });
    }
  }
}

module.exports = new PermissoesController();
