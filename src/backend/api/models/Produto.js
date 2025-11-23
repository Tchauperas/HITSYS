const db = require("../configs/config");

class Produto {
  async cadastrarProduto(data) {
    try {
      await db.insert(data).table("produtos");
      return { validated: true };
    } catch (e) {
      return { validated: false, error: e.message };
    }
  }

  async visualizarProdutos() {
    try {
      let produtos = await db.select("*").table("produtos");
      if (produtos.length > 0) {
        return { validated: true, values: produtos };
      } else {
        return { validated: false, error: "Nenhum produto cadastrado" };
      }
    } catch (e) {
      return { validated: false, error: e.message };
    }
  }

  async alterarProduto(id, data) {
    try {
      let produto = await db
        .update(data)
        .where({ id_produto: id })
        .table("produtos");
      if (produto != 0 || produto != undefined) {
        return { validated: true };
      } else {
        return { validated: false, error: "Produto não encontrado" };
      }
    } catch (e) {
      return { validated: false, error: e.message };
    }
  }

  async deletarProduto(id) {
    try {
      let produto = await db
        .delete()
        .where({ id_produto: id })
        .table("produtos");
      if (produto != 0) {
        return { validated: true };
      } else {
        return { validated: false, error: "Produto não encontrado" };
      }
    } catch (e) {
      return { validated: false, error: e.message };
    }
  }

  async visualizarProduto(id) {
    try {
      let produto = await db
        .select("*")
        .where({ id_produto: id })
        .table("produtos");
      if (produto.length > 0) {
        return { validated: true, values: produto };
      } else {
        return { validated: false, error: "Produto não encontrado" };
      }
    } catch (e) {
      return { validated: false, error: e.message };
    }
  }

  async debitarEstoque(id, debt) {
    try {
      const quant = await db.select("saldo_estoque").table("produtos").where({id_produto: id})
      let saldo =  quant[0].saldo_estoque - debt 
      console.log(saldo, quant, debt)
      await db.update({saldo_estoque: saldo}).table("produtos").where({id_produto: id})
      return {validated: true}
    } catch (e) {
      return {validated: false, error: e}
    }
  }

  async creditarEstoque(id, credit) {
    try {
      const quant = await db.select("saldo_estoque").table("produtos").where({id_produto: id})
      let saldo =  quant[0].saldo_estoque + credit 
      console.log(saldo, quant, credit)
      await db.update({saldo_estoque: saldo}).table("produtos").where({id_produto: id})
      return {validated: true}
    } catch (e) {
      return {validated: false, error: e}
    }
  }
}

module.exports = new Produto();
