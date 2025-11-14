const audit = require("../models/Auditoria");

class AuditoriaController {
  async visualizarAuditoria(req, res) {
    try {
      let result = await audit.visualizarAuditoria();
      result.validated
        ? res.status(200).json({ success: true, values: result.values })
        : res.status(404).json({ success: false, message: result.error });
    } catch (e) {
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }
}

module.exports = new AuditoriaController();
