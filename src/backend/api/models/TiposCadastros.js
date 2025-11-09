const db = require('../configs/config');

class TiposCadastros {
  async visualizarTipos() {
    try {
      const tipos = await db.select('*').table('tipos_cadastros');
      if (tipos.length > 0) {
        return { validated: true, values: tipos };
      }
      return { validated: false, error: 'Nenhum tipo encontrado' };
    } catch (e) {
      return { validated: false, error: e.message };
    }
  }
}

module.exports = new TiposCadastros();
