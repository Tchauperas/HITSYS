const express = require("express");
const router = express.Router();

const rootLogin = require("./routes/login");
const rootHome = require("./routes/home")
const rootEmpresas = require("./routes/empresas")
const rootPessoas = require("./routes/pessoas")
const rootProdutos = require("./routes/produtos")
const rootUsuarios = require("./routes/usuarios")
const rootPerfUsuarios = require("./routes/perf_usuarios")
const rootVendedores = require("./routes/vendedores")
const rootCompras = require("./routes/compras")
const rootVendas = require("./routes/vendas")
const rootContas = require("./routes/contas")

router.use("/", rootLogin);
router.use("/home", rootHome)
router.use("/empresas", rootEmpresas)
router.use("/pessoas", rootPessoas)
router.use("/produtos", rootProdutos)
router.use("/usuarios", rootUsuarios)
router.use("/perf_usuarios", rootPerfUsuarios)
router.use("/vendedores", rootVendedores)
router.use("/compras", rootCompras)
router.use("/vendas", rootVendas)
router.use("/contas", rootContas)

module.exports = router;
