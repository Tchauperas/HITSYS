const db = require("../configs/config");

class Vendedor {
  async cadastrarVendedor(data) {
    try {
      await db.insert(data).table("vendedores");
      return { validated: true };
    } catch (e) {
      return { validated: false, error: e.message };
    }
  }

  async visualizarVendedores() {
    try {
      let vendedores = await db
        .select(
          "vendedores.*",
          "usuarios.nome as nome_usuario",
          "pessoas.nome_razao_social as nome_pessoa"
        )
        .from("vendedores")
        .leftJoin("usuarios", "vendedores.id_usuario", "usuarios.id_usuario") 
        .leftJoin("pessoas", "vendedores.id_pessoa", "pessoas.id_pessoa"); 

      if (vendedores.length > 0) {
        return { validated: true, values: vendedores };
      } else {
        return { validated: false, error: "Nenhum vendedor cadastrado" };
      }
    } catch (e) {
      return { validated: false, error: e.message };
    }
  }

  async alterarVendedor(id, data) {
    try {
      const updatedRows = await db("vendedores")
        .where({ id_vendedor: id })
        .update(data);

      if (updatedRows > 0) {
        return { validated: true, message: "Vendedor atualizado com sucesso" };
      } else {
        return {
          validated: false,
          error: "Vendedor não encontrado para atualização",
        };
      }
    } catch (e) {
      return { validated: false, error: e.message };
    }
  }

  async deletarVendedor(id) {
    try {
      const deletedRows = await db("vendedores").where({ id_vendedor: id }).del();

      if (deletedRows > 0) {
        return { validated: true, message: "Vendedor excluído com sucesso" };
      } else {
        return {
          validated: false,
          error: "Vendedor não encontrado para exclusão",
        };
      }
    } catch (e) {
      return { validated: false, error: e.message };
    }
  }

  async visualizarVendedor(id) {
    try {
      let vendedor = await db
        .select(
          "vendedores.*",
          "usuarios.nome as nome_usuario",
          "pessoas.nome_razao_social as nome_pessoa"
        )
        .from("vendedores")
        .leftJoin("usuarios", "vendedores.id_usuario", "usuarios.id_usuario") 
        .leftJoin("pessoas", "vendedores.id_pessoa", "pessoas.id_pessoa") 
        .where({ id_vendedor: id });

      if (vendedor.length > 0) {
        return { validated: true, values: vendedor };
      } else {
        return { validated: false, error: "Vendedor não encontrado" };
      }
    } catch (e) {
      return { validated: false, error: e.message };
    }
  }
}

module.exports = new Vendedor();