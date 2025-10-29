const Estado = require("../models/Estado");

class EstadoController {
  async cadastrarEstado(req, res) {
    const { uf, estado } = req.body;

    if (!uf || !estado) {
      return res.status(400).json({ validated: false, error: "Campos obrigatórios não preenchidos" });
    }

    try {
      const result = await Estado.cadastrarEstado({ uf, estado });
      if (result.validated) {
        return res.status(201).json({ validated: true, message: "Estado cadastrado com sucesso" });
      } else {
        return res.status(500).json(result);
      }
    } catch (e) {
      return res.status(500).json({ validated: false, error: e.message });
    }
  }

  async visualizarEstados(req, res) {
    try {
      const result = await Estado.visualizarEstados();
      if (result.validated) {
        return res.status(200).json({success: true, values: result.values});
      } else {
        return res.status(404).json(result);
      }
    } catch (e) {
      return res.status(500).json({ validated: false, error: e.message });
    }
  }

  async alterarEstado(req, res) {
    const { id } = req.params;
    const { uf, estado } = req.body;

    if (!uf || !estado) {
      return res.status(400).json({ validated: false, error: "Campos obrigatórios não preenchidos" });
    }

    try {
      const result = await Estado.alterarEstado(id, { uf, estado });
      if (result.validated) {
        return res.status(200).json({ validated: true, message: "Estado atualizado com sucesso" });
      } else {
        return res.status(404).json(result);
      }
    } catch (e) {
      return res.status(500).json({ validated: false, error: e.message });
    }
  }

  async deletarEstado(req, res) {
    const { id } = req.params;

    try {
      const result = await Estado.deletarEstado(id);
      if (result.validated) {
        return res.status(200).json({ validated: true, message: "Estado deletado com sucesso" });
      } else {
        return res.status(404).json(result);
      }
    } catch (e) {
      return res.status(500).json({ validated: false, error: e.message });
    }
  }

  async visualizarEstado(req, res) {
    const { id } = req.params;

    try {
      const result = await Estado.visualizarEstado(id);
      if (result.validated) {
        return res.status(200).json(result.values);
      } else {
        return res.status(404).json(result);
      }
    } catch (e) {
      return res.status(500).json({ validated: false, error: e.message });
    }
  }
}

module.exports = new EstadoController();