const db = require("../configs/config");
const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = async function (auth, id_acao, descricao_acao) {
  try {
    if (!auth) {
      console.error("Token de autorização não fornecido");
      return { error: "Token não fornecido" };
    }

    let bearer = auth.split(" ");
    let token = bearer[1];
    
    let decoded = jwt.verify(token, process.env.SECTK);
    
    let dateTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
    
    await db.insert({
      data_hora: dateTime, 
      id_usuario: decoded.id, 
      id_acao: id_acao, 
      descricao_acao: descricao_acao
    }).into("auditoria");
    
    console.log(`Auditoria registrada: Usuário ${decoded.id} - Ação ${id_acao}`);
    return { success: true };
    
  } catch (e) {
    console.error("Erro ao auditar:", e.message);
    return { error: e.message };
  }
};
