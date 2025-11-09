const tiposModel = require('../models/TiposPessoas');

class TiposPessoasController {
  async visualizarTipos(req, res) {
    try {
      const result = await tiposModel.visualizarTipos();
      if (result.validated) {
        res.status(200).json({ success: true, values: result.values });
      } else {
        res.status(404).json({ success: false, message: result.error });
      }
    } catch (e) {
      res.status(500).json({ success: false, message: `Internal server error: ${e.message}` });
    }
  }
}

module.exports = new TiposPessoasController();
