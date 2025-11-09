const db = require('../configs/config');

class TiposPessoas {
  async visualizarTipos() {
    try {
      const tipos = await db.select('*').table('tipos_pessoas');
      if (tipos.length > 0) {
        return { validated: true, values: tipos };
      }
      return { validated: false, error: 'Nenhum tipo de pessoa encontrado' };
    } catch (e) {
      return { validated: false, error: e.message };
    }
  }
}

module.exports = new TiposPessoas();
