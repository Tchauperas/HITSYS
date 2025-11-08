const perfis = require("../models/PerfisUsuarios");

class Perf_usuariosController {
  async cadastrarPerfil(req, res) {
    const data = req.body;
    if (!data) return res.status(400).json({ success: false, message: "Invalid body request" });
    try {
      const result = await perfis.cadastrarPerfil(data);
      if (result.validated) return res.status(201).json({ success: true });
      return res.status(400).json({ success: false, message: result.error });
    } catch (e) {
      return res.status(500).json({ success: false, message: e.message });
    }
  }

  async visualizarPerfis(req, res) {
    try {
      const result = await perfis.visualizarPerfis();
      if (result.validated) return res.status(200).json({ success: true, values: result.values });
      return res.status(200).json({ success: true, values: [] });
    } catch (e) {
      return res.status(500).json({ success: false, message: e.message });
    }
  }

  async visualizarPerfil(req, res) {
    const id = req.params.id;
    if (isNaN(id)) return res.status(400).json({ success: false, message: "Id inválido" });
    try {
      const result = await perfis.visualizarPerfil(id);
      if (result.validated) return res.status(200).json({ success: true, values: result.values });
      return res.status(404).json({ success: false, message: result.error });
    } catch (e) {
      return res.status(500).json({ success: false, message: e.message });
    }
  }

  async alterarPerfil(req, res) {
    const id = req.params.id;
    if (isNaN(id)) return res.status(400).json({ success: false, message: "Id inválido" });
    try {
      const result = await perfis.alterarPerfil(id, req.body);
      if (result.validated) return res.status(200).json({ success: true });
      return res.status(404).json({ success: false, message: result.error });
    } catch (e) {
      return res.status(500).json({ success: false, message: e.message });
    }
  }

  async deletarPerfil(req, res) {
    const id = req.params.id;
    if (isNaN(id)) return res.status(400).json({ success: false, message: "Id inválido" });
    try {
      const result = await perfis.deletarPerfil(id);
      if (result.validated) return res.status(200).json({ success: true });
      return res.status(404).json({ success: false, message: result.error });
    } catch (e) {
      return res.status(500).json({ success: false, message: e.message });
    }
  }
}

module.exports = new Perf_usuariosController();
